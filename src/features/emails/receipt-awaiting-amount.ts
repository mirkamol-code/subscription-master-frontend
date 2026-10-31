import type { BillingEmail } from '@/types/api'

export function findReceiptAwaitingAmount(emails: BillingEmail[] | undefined): BillingEmail | undefined {
  return emails
    ?.filter((email) => email.amountUnreadable)
    .reduce<BillingEmail | undefined>(
      (newest, email) => (!newest || Date.parse(email.receivedAt) > Date.parse(newest.receivedAt) ? email : newest),
      undefined,
    )
}
