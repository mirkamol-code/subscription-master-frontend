import type { Subscription } from '@/types/api'

export type ReviewAction = 'ENTER_AMOUNT' | 'CONFIRM_GUESS'

export interface ReviewPrompt {
  message: string
  action: ReviewAction
}

const GUESSED_DETAILS_MESSAGE = 'We guessed the amount, currency or billing cycle from an email. Check they’re right.'

export function getReviewPrompt(subscription: Pick<Subscription, 'reviewReason' | 'reviewNote'>): ReviewPrompt {
  const message = subscription.reviewNote ?? GUESSED_DETAILS_MESSAGE
  const action = subscription.reviewReason === 'AMOUNT_UNREADABLE' ? 'ENTER_AMOUNT' : 'CONFIRM_GUESS'
  return { message, action }
}
