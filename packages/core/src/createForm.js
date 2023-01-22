import { createEvent, sample } from 'effector'
import { createField } from './createField'

export function createForm({
  initialValues,
  validationSchema = {},
  validateOn = 'blur',
  isSubmitting,
}) {
  const fields = {}
  const values = {}
  const errors = {}
  const reset = createEvent()
  const submitted = createEvent()
  const submissionValidated = createEvent()

  Object.entries(initialValues).forEach(([name, initialValue]) => {
    const field = createField({
      validate: validationSchema[name],
      onReset: reset,
      isSubmitting,
      initialValue,
      validateOn,
      name,
    })

    fields[name] = field
    values[name] = field.$value
    errors[name] = field.$error
  })

  sample({
    clock: submitted,
    source: values,
    target: submissionValidated,
  })

  return {
    isSubmitting,
    fields,
    values,
    errors,
    reset,
    'submit': submitted,
    'submitted': submissionValidated,
    '@@unitShape': () => ({
      submit: submitted,
      isSubmitting,
      values,
      errors,
      fields: fieldsUnitShape(fields),
    }),
  }
}

function fieldsUnitShape(fields) {
  const fieldsEntries = Object.entries(fields).map(([name, value]) =>
    [name, value['@@unitShape']()],
  )

  return Object.fromEntries(fieldsEntries)
}
