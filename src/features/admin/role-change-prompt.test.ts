import { describe, expect, it } from 'vitest'
import { getRoleChangePrompt } from '@/features/admin/role-change-prompt'

describe('getRoleChangePrompt', () => {
  it('asks before making someone an admin', () => {
    // when
    const prompt = getRoleChangePrompt({ name: 'Alice', nextRole: 'ADMIN', isSelf: false })

    // then
    expect(prompt).toEqual({
      title: 'Make Alice an admin?',
      description: 'Alice will see every user, subscription and payment, and can change other people’s roles.',
      confirmLabel: 'Make admin',
      actionLabel: 'Make admin',
      isDestructive: false,
    })
  })

  it('asks before removing another person’s admin role', () => {
    // when
    const prompt = getRoleChangePrompt({ name: 'Bob', nextRole: 'USER', isSelf: false })

    // then
    expect(prompt).toEqual({
      title: 'Remove admin from Bob?',
      description: 'Bob will lose access to the admin area on their next request.',
      confirmLabel: 'Remove admin',
      actionLabel: 'Remove admin',
      isDestructive: true,
    })
  })

  it('warns harder when admins remove their own role', () => {
    // when
    const prompt = getRoleChangePrompt({ name: 'Me', nextRole: 'USER', isSelf: true })

    // then
    expect(prompt).toEqual({
      title: 'Remove your own admin role?',
      description:
        'You will lose access to the admin area straight away and only another admin can give it back.',
      confirmLabel: 'Remove my admin role',
      actionLabel: 'Remove admin',
      isDestructive: true,
    })
  })
})
