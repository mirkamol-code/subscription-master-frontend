import { describe, expect, it } from 'vitest'
import { isDeleteConfirmed } from '@/features/user-deletion/delete-confirmation'

describe('isDeleteConfirmed', () => {
  it('confirms when the User types the email they sign in with', () => {
    // when
    const isConfirmed = isDeleteConfirmed('sam@gmail.com', 'sam@gmail.com')

    // then
    expect(isConfirmed).toBe(true)
  })

  it('ignores surrounding spaces and letter case', () => {
    // when
    const isConfirmed = isDeleteConfirmed('  Sam@Gmail.com ', 'sam@gmail.com')

    // then
    expect(isConfirmed).toBe(true)
  })

  it.each([
    ['another email', 'alex@gmail.com', 'sam@gmail.com'],
    ['part of the email', 'sam@gmail', 'sam@gmail.com'],
    ['nothing', '', 'sam@gmail.com'],
    ['anything while the email is unknown', '', ''],
    ['spaces while the email is unknown', ' ', ' '],
  ])('refuses %s', (_, typed, email) => {
    // when
    const isConfirmed = isDeleteConfirmed(typed, email)

    // then
    expect(isConfirmed).toBe(false)
  })
})
