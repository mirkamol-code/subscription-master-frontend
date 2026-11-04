import type { Subscription } from '@/types/api'

export type ReviewAction = 'ENTER_AMOUNT' | 'CONFIRM_GUESS' | 'CONFIRM_RECURRING'

export interface ReviewPrompt {
  message: string
  action: ReviewAction
}

const GUESSED_DETAILS_MESSAGE = 'We guessed the amount, currency or billing cycle from an email. Check they’re right.'

export function getReviewPrompt(subscription: Pick<Subscription, 'reviewReason' | 'reviewNote'>): ReviewPrompt {
  const message = subscription.reviewNote ?? GUESSED_DETAILS_MESSAGE
  return { message, action: chooseReviewAction(subscription.reviewReason) }
}

function chooseReviewAction(reason: Subscription['reviewReason']): ReviewAction {
  switch (reason) {
    case 'AMOUNT_UNREADABLE':
      return 'ENTER_AMOUNT'
    case 'SIMILAR_INVOICES':
    case 'SIMILAR_INVOICES_REPEATED':
    case 'UNCONFIRMED_TRIAL':
      return 'CONFIRM_RECURRING'
    default:
      return 'CONFIRM_GUESS'
  }
}
