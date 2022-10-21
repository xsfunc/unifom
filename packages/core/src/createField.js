import { attach, createEffect, createEvent, createStore, is, sample } from 'effector'

export function createField({
  name = null,
  initialValue,
  validate = () => [],
  validateOn = 'blur',
  isSubmitting,
  onReset,
}) {
  const interacted = createEvent()
  const submitted = createEvent()
  const submissionValidated = createEvent()
  const reset = is.event(onReset) ? onReset : createEvent()
  const focused = interacted.prepend(() => ({ focus: true, type: 'focus' }))
  const blurred = interacted.prepend(() => ({ focus: false, type: 'blur' }))
  const changed = interacted.prepend(value => ({ value, type: 'change' }))

  const $value = createStore(initialValue)
  const $name = createStore(name)
  const $errors = createStore([])
  const $focused = createStore(false)
  const $isDirty = createStore(false)
  const $touched = createStore(false)
  const $error = $errors.map(errors => errors[0])
  const $isValid = $errors.map(errors => errors.length === 0)
  const $hasError = $isValid.map(isValid => !isValid)
  const $validationType = createStore(validateOn)

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
    clock: $value,
    filter: not($isDirty),
    fn: () => true,
    target: $isDirty,
  })
  sample({
    clock: $focused,
    filter: not($touched),
    fn: () => true,
    target: $touched,
  })
  sample({
    clock: interacted,
    source: $validationType,
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
  $isDirty.reset(reset)
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
    $isSubmitting: isSubmitting,
    $isValidating: validateSourceFx.pending,

    // input events
    change: changed,
    focus: focused,
    blur: blurred,
    submit: submitted,
    reset,
    // sugar
    setValue: changed.prepend(value => ({ value })),

    // output events
    submitted: submissionValidated,
  }
}

function not(store) {
  return store.map(state => !state)
}

