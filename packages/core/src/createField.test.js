import { allSettled, createEffect, fork, sample } from 'effector'
import { describe, expect, test, vi } from 'vitest'
import { createField } from '.'

const validateIsAdult = age => age >= 18 ? [] : ['too young']

describe('Given empty age field', () => {
  const ageField = createField()

  test('Initialized with correct default values', () => {
    const scope = fork()
    expect(scope.getState(ageField.$value)).toEqual('')
    expect(scope.getState(ageField.$name)).toBe(null)
    expect(scope.getState(ageField.$validationOn)).toBe('blur')
    expect(scope.getState(ageField.$isValid)).toBe(true)
    expect(scope.getState(ageField.$error)).toBe(null)
    expect(scope.getState(ageField.$errors)).toEqual([])
    expect(scope.getState(ageField.$hasError)).toBe(false)
    expect(scope.getState(ageField.$focused)).toBe(false)
    expect(scope.getState(ageField.$touched)).toBe(false)
    expect(scope.getState(ageField.$isDirty)).toBe(false)
    expect(scope.getState(ageField.$isSubmitting)).toBe(false)
    expect(scope.getState(ageField.$isValidating)).toBe(false)
  })

  describe('Then interact with field', async () => {
    const scope = fork()
    const submitFn = vi.fn()
    const submitFx = createEffect(submitFn)
    sample({
      clock: ageField.submitted,
      target: submitFx,
    })

    await allSettled(ageField.focus, { scope })
    await allSettled(ageField.setValue, { params: 14, scope })
    await allSettled(ageField.submit, { scope })
    expect(scope.getState(ageField.$focused)).toBe(true)
    expect(scope.getState(ageField.$isDirty)).toBe(true)
    expect(scope.getState(ageField.$value)).toEqual(14)
    expect(submitFn).toHaveBeenCalled()

    test('When reset field', async () => {
      await allSettled(ageField.reset, { scope })
      expect(scope.getState(ageField.$value)).toEqual('')
      expect(scope.getState(ageField.$isDirty)).toBe(false)
    })
  })
})

describe('Given age field with params', () => {
  const ageField = createField({
    name: 'age',
    initialValue: 16,
    validate: validateIsAdult,
    validateOn: 'change',
  })

  test('Initialized with correct values', () => {
    const scope = fork()
    expect(scope.getState(ageField.$value)).toEqual(16)
    expect(scope.getState(ageField.$name)).toBe('age')
    expect(scope.getState(ageField.$validationOn)).toBe('change')
    expect(scope.getState(ageField.$isValid)).toBe(true)
    expect(scope.getState(ageField.$error)).toBe(null)
    expect(scope.getState(ageField.$errors)).toEqual([])
    expect(scope.getState(ageField.$hasError)).toBe(false)
    expect(scope.getState(ageField.$focused)).toBe(false)
    expect(scope.getState(ageField.$touched)).toBe(false)
    expect(scope.getState(ageField.$isDirty)).toBe(false)
    expect(scope.getState(ageField.$isSubmitting)).toBe(false)
    expect(scope.getState(ageField.$isValidating)).toBe(false)
  })
})

describe('Given age field with adult validation and validate on blur', () => {
  const ageField = createField({ validate: validateIsAdult })

  test('When set age to 15 years', async () => {
    const scope = fork()
    await allSettled(ageField.setValue, { params: 15, scope })
    expect(scope.getState(ageField.$isValid)).toBe(true)

    await allSettled(ageField.blur, { scope })
    expect(scope.getState(ageField.$isValid)).toBe(false)
    expect(scope.getState(ageField.$error)).toEqual('too young')
    expect(scope.getState(ageField.$errors)).toEqual(['too young'])
  })
  test('When set age to 20 years', async () => {
    const scope = fork()
    await allSettled(ageField.setValue, { params: 20, scope })
    await allSettled(ageField.blur, { scope })
    expect(scope.getState(ageField.$isValid)).toBe(true)
    expect(scope.getState(ageField.$error)).toEqual(null)
    expect(scope.getState(ageField.$errors)).toEqual([])
  })

  describe('Then set validationOn to "change"', async () => {
    const scope = fork()
    await allSettled(ageField.setValidateOn, { params: 'change', scope })

    test('When set age to 15 years', async () => {
      await allSettled(ageField.setValue, { params: 15, scope })
      expect(scope.getState(ageField.$isValid)).toBe(false)
      expect(scope.getState(ageField.$error)).toEqual('too young')
      expect(scope.getState(ageField.$errors)).toEqual(['too young'])
    })
    test('When set age to 20 years', async () => {
      await allSettled(ageField.setValue, { params: 20, scope })
      expect(scope.getState(ageField.$isValid)).toBe(true)
      expect(scope.getState(ageField.$error)).toEqual(null)
      expect(scope.getState(ageField.$errors)).toEqual([])
    })
  })

  describe('Then set validationOn to "submit"', async () => {
    const scope = fork()
    await allSettled(ageField.setValidateOn, { params: 'submit', scope })

    test('When set age to 15 years', async () => {
      await allSettled(ageField.setValue, { params: 15, scope })
      expect(scope.getState(ageField.$isValid)).toBe(true)

      await allSettled(ageField.submit, { scope })
      expect(scope.getState(ageField.$isValid)).toBe(false)
      expect(scope.getState(ageField.$error)).toEqual('too young')
      expect(scope.getState(ageField.$errors)).toEqual(['too young'])
    })
    test('When set age to 20 years', async () => {
      await allSettled(ageField.setValue, { params: 20, scope })
      await allSettled(ageField.submit, { scope })
      expect(scope.getState(ageField.$isValid)).toBe(true)
      expect(scope.getState(ageField.$error)).toEqual(null)
      expect(scope.getState(ageField.$errors)).toEqual([])
    })
  })
})
