import {
  attach,
  createEffect,
  createEvent,
  createStore,
  is,
  sample,
} from 'effector'

export function createField(options = {}) {
  const {
    name = null,
    initialValue = '',
    validate = () => [],
    validateOn = 'blur',
    isSubmitting = false,
    onReset,
  } = options

  const interacted = createEvent()
  const submitted = createEvent()
  const submissionValidated = createEvent()
  const validateOnSet = createEvent()
  const reset = is.event(onReset) ? onReset : createEvent()
  const focused = interacted.prepend(() => ({ focus: true, type: 'focus' }))
  const blurred = interacted.prepend(() => ({ focus: false, type: 'blur' }))
  const changed = interacted.prepend(value => ({ value, type: 'change' }))

  const $value = createStore(initialValue)
  const $name = createStore(name)
  const $errors = createStore([])
  const $focused = createStore(false)
  const $touched = createStore(false)
  const $isDirty = $value.map(value => value !== initialValue)
  const $error = $errors.map(errors => errors[0] || null)
  const $isValid = $errors.map(errors => errors.length === 0)
  const $hasError = $isValid.map(isValid => !isValid)
  const $isSubmitting = is.store(isSubmitting) ? isSubmitting : createStore(isSubmitting)
  const $validationOn = createStore(validateOn)

  const validateSourceFx = createEffect(validate)
  const validateFx = attach({ effect: validateSourceFx, source: $value })
  const validateSubmissionFx = attach({ effect: validateFx })

  sample({
    clock: changed,
    fn: ({ value }) => value,
    target: $value,
  })
  sample({
    clock: interacted,
    fn: ({ focus }) => focus,
    target: $focused,
  })
  sample({
    clock: $focused,
    filter: not($touched),
    fn: () => true,
    target: $touched,
  })
  sample({
    clock: validateOnSet,
    target: $validationOn,
  })
  sample({
    clock: interacted,
    source: $validationOn,
    filter: (validationType, { type }) => type === validationType,
    target: validateFx,
  })
  sample({
    clock: validateSourceFx.doneData,
    target: $errors,
  })

  sample({
    clock: submitted,
    source: $value,
    target: validateSubmissionFx,
  })
  sample({
    clock: validateSubmissionFx.done,
    source: $value,
    filter: $isValid,
    target: submissionValidated,
  })

  $value.reset(reset)
  $errors.reset(reset)
  $focused.reset(reset)
  $touched.reset(reset)

  return {
    $name,
    $value,
    $error,
    $errors,
    $touched,
    $focused,
    $isValid,
    $isDirty,
    $hasError,
    $isSubmitting,
    $validationOn,
    '$isValidating': validateSourceFx.pending,

    // input events
    'change': changed,
    'focus': focused,
    'blur': blurred,
    'submit': submitted,
    'setValue': changed.prepend(value => ({ value })),
    'setValidateOn': validateOnSet,

    // output events
    'submitted': submissionValidated,
    'validated': validateFx.done,
    reset,

    '@@unitShape': () => ({
      name: $name,
      value: $value,
      error: $error,
      errors: $errors,
      touched: $touched,
      focused: $focused,
      isValid: $isValid,
      isDirty: $isDirty,
      hasError: $hasError,
      isSubmitting: $isSubmitting,
      isValidating: validateSourceFx.pending,
      change: changed,
      focus: focused,
      blur: blurred,
      submit: submitted,
      setValue: changed.prepend(value => ({ value })),
      setValidateOn: validateOnSet,
    }),
  }
}

function not(store) {
  return store.map(state => !state)
}
