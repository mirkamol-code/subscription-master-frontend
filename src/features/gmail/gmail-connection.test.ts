import { describe, expect, it } from 'vitest'
import { describeGmailConnection } from '@/features/gmail/gmail-connection'
import type { GmailConnection } from '@/types/api'

describe('describeGmailConnection', () => {
  it('shows the connected address and allows a Sync', () => {
    // given
    const connection = { connected: true, gmailAddress: 'sam@gmail.com', status: 'CONNECTED' as const }

    // when
    const card = describeGmailConnection(connection)

    // then
    expect(card).toEqual({
      title: 'Gmail connected',
      description: 'sam@gmail.com',
      canSync: true,
    })
  })

  it('asks the User to reconnect a disconnected Gmail', () => {
    // given
    const connection = { connected: false, gmailAddress: 'sam@gmail.com', status: 'DISCONNECTED' as const }

    // when
    const card = describeGmailConnection(connection)

    // then
    expect(card).toEqual({
      title: 'Gmail disconnected',
      description: 'Reconnect sam@gmail.com to keep finding subscriptions in your billing emails.',
      canSync: false,
      actionLabel: 'Reconnect Gmail',
    })
  })

  it.each(['NOT_CONNECTED', 'REVOKED'])('offers to connect Gmail when the state is %s', (status) => {
    // given
    const connection = { connected: false, gmailAddress: null, status: status as GmailConnection['status'] }

    // when
    const card = describeGmailConnection(connection)

    // then
    expect(card).toEqual({
      title: 'Find subscriptions automatically',
      description: 'Connect Gmail and we’ll read your billing emails for receipts and renewals.',
      canSync: false,
      actionLabel: 'Connect Gmail',
    })
  })

  it('still reads well when a disconnected Gmail has no address', () => {
    // given
    const connection = { connected: false, gmailAddress: null, status: 'DISCONNECTED' as const }

    // when
    const card = describeGmailConnection(connection)

    // then
    expect(card.description).toBe('Reconnect Gmail to keep finding subscriptions in your billing emails.')
  })
})
