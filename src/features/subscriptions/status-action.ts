import { Ban, CircleCheck, type LucideIcon } from 'lucide-react'
import type { UserStatus } from '@/features/subscriptions/status-choices'

interface StatusChoiceUi {
  label: string
  doneMessage: (name: string) => string
  icon: LucideIcon
}

export const STATUS_CHOICE_UI: Record<UserStatus, StatusChoiceUi> = {
  ACTIVE: { label: 'Mark active', doneMessage: (name) => `${name} is active`, icon: CircleCheck },
  CANCELLED: { label: 'Mark cancelled', doneMessage: (name) => `${name} marked cancelled`, icon: Ban },
}
