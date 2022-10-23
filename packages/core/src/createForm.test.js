import { allSettled, createEffect, fork, sample } from 'effector'
import { describe, expect, test, vi } from 'vitest'
import { createForm } from './createForm'

describe('Given form', () => {
  const scope = fork()
  const form = createForm({
    initialValues: {
      firstName: '',
      lastName: '',
    },
  })

  test('When fill first and last names', async () => {
    const { firstName, lastName } = form.fields
    allSettled(firstName.setValue, { params: 'Alan', scope })
    allSettled(lastName.setValue, { params: 'Turing', scope })
    expect(scope.getState(form.values.firstName)).toEqual('Alan')
    expect(scope.getState(form.values.lastName)).toEqual('Turing')
  })

  test('When submit form', () => {
    const submitFn = vi.fn(values => values)
    const submitFx = createEffect(submitFn)
    sample({
      clock: form.submitted,
      target: submitFx,
    })

    allSettled(form.submit, { scope })
    expect(submitFn).toHaveReturnedWith({
      firstName: 'Alan',
      lastName: 'Turing',
    })
  })
})
