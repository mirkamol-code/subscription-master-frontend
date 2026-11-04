import { describe, expect, it } from 'vitest'
import { labelAccountOption, parseAwaitingAccount } from '@/features/emails/awaiting-account'

const response = [
  {
    emailId: 31,
    kind: 'RECEIPT',
    sender: 'Noreply Billing - Hetzner Online GmbH <noreply.billing@hetzner.com>',
    subject: 'Hetzner Online GmbH - Invoice 000000000003',
    receivedAt: '2026-11-12T05:08:00Z',
    amount: 6.0,
    currency: 'USD',
    accounts: [
      { subscriptionId: 41, name: 'Hetzner', customerReference: 'K0000000001' },
      { subscriptionId: 42, name: 'Hetzner', customerReference: 'K0000000002' },
    ],
  },
]

describe('parseAwaitingAccount', () => {
  it('reads emails waiting for an account with the accounts the user can pick', () => {
    // when
    const emails = parseAwaitingAccount(response)

    // then
    expect(emails).toHaveLength(1)
    expect(emails[0]).toMatchObject({ emailId: 31, amount: 6, currency: 'USD' })
    expect(emails[0].accounts.map((account) => account.subscriptionId)).toEqual([41, 42])
  })

  it('accepts a status email that has no amount', () => {
    // when
    const emails = parseAwaitingAccount([{ ...response[0], kind: 'CANCELLATION', amount: null, currency: null }])

    // then
    expect(emails[0].amount).toBeNull()
  })

  it('rejects a response that no longer lists the accounts', () => {
    // given
    const { accounts: _accounts, ...withoutAccounts } = response[0]

    // when / then
    expect(() => parseAwaitingAccount([withoutAccounts])).toThrow()
  })
})

describe('labelAccountOption', () => {
  it('names the account by its customer ID', () => {
    // when / then
    expect(labelAccountOption({ subscriptionId: 41, name: 'Hetzner', customerReference: 'K0000000001' })).toBe('Hetzner · K0000000001')
  })

  it('says when an account has no customer ID', () => {
    // when / then
    expect(labelAccountOption({ subscriptionId: 43, name: 'Hetzner', customerReference: null })).toBe('Hetzner · no customer ID')
  })
})
