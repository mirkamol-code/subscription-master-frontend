import { describe, expect, it } from 'vitest'
import { buildEmailDocument } from '@/features/emails/email-document'

describe('buildEmailDocument', () => {
  it('puts the backend’s Content-Security-Policy ahead of the email', () => {
    // given
    const csp = "default-src 'none'; img-src data:"

    // when
    const document = buildEmailDocument('<p>Your receipt</p>', csp)

    // then
    expect(document).toMatch(
      /^<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:">/,
    )
    expect(document.indexOf('Content-Security-Policy')).toBeLessThan(document.indexOf('Your receipt'))
  })

  it('escapes the policy so it can’t break out of the meta tag', () => {
    // given
    const csp = 'default-src \'none\'"><script>alert(1)</script>'

    // when
    const document = buildEmailDocument('<p>Hi</p>', csp)

    // then
    expect(document).not.toContain('<script>')
    expect(document).toContain('content="default-src \'none\'&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"')
  })

  it('falls back to a strict policy when the backend sends none', () => {
    // when
    const document = buildEmailDocument('<p>Hi</p>', null)

    // then
    expect(document).toContain(
      'content="default-src \'none\'; img-src data: cid:; style-src \'unsafe-inline\'; font-src data:"',
    )
  })

  it('opens the email’s links in a new tab', () => {
    // when
    const document = buildEmailDocument('<a href="https://netflix.com">Manage</a>', "default-src 'none'")

    // then
    expect(document).toContain('<base target="_blank">')
  })
})
