import { describe, expect, it } from 'vitest'
import { buildGmailMessageUrl } from '@/features/emails/gmail-link'

describe('buildGmailMessageUrl', () => {
  it('opens the message in the connected Gmail account', () => {
    // when
    const url = buildGmailMessageUrl('18c2a1f0netflix01', 'alex.doe@gmail.com')

    // then
    expect(url).toBe('https://mail.google.com/mail/?authuser=alex.doe%40gmail.com#all/18c2a1f0netflix01')
  })

  it('falls back to the default account when the address is unknown', () => {
    // when
    const url = buildGmailMessageUrl('18c2a1f0netflix01', null)

    // then
    expect(url).toBe('https://mail.google.com/mail/u/0/#all/18c2a1f0netflix01')
  })

  it('keeps an unusual message id from breaking out of the fragment', () => {
    // when
    const url = buildGmailMessageUrl('abc/../x?y', null)

    // then
    expect(url).toBe('https://mail.google.com/mail/u/0/#all/abc%2F..%2Fx%3Fy')
  })
})
