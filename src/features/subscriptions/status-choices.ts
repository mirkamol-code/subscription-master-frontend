import type { SubscriptionStatus } from '@/types/api'

export type UserStatus = Extract<SubscriptionStatus, 'ACTIVE' | 'CANCELLED'>

const USER_STATUSES: UserStatus[] = ['ACTIVE', 'CANCELLED']

export function getStatusChoices(status: SubscriptionStatus): UserStatus[] {
  return USER_STATUSES.filter((choice) => choice !== status)
}
