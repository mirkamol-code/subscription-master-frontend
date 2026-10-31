import { describe, expect, it } from 'vitest'
import { getReviewPrompt } from '@/features/subscriptions/review-prompt'

describe('getReviewPrompt', () => {
  it('asks for the amount when a renewal receipt could not be priced', () => {
    // when
    const prompt = getReviewPrompt({ reviewReason: 'AMOUNT_UNREADABLE', reviewNote: 'Receipt found, amount unreadable.' })

    // then
    expect(prompt).toEqual({ message: 'Receipt found, amount unreadable.', action: 'ENTER_AMOUNT' })
  })

  it('asks to confirm details that were guessed from an email', () => {
    // when
    const prompt = getReviewPrompt({ reviewReason: null, reviewNote: null })

    // then
    expect(prompt).toEqual({
      message: 'We guessed the amount, currency or billing cycle from an email. Check they’re right.',
      action: 'CONFIRM_GUESS',
    })
  })

  it('keeps the guessed-details action for a note without a known reason', () => {
    // when
    const prompt = getReviewPrompt({ reviewReason: null, reviewNote: 'Something else to check.' })

    // then
    expect(prompt).toEqual({ message: 'Something else to check.', action: 'CONFIRM_GUESS' })
  })
})
