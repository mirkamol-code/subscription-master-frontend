import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HiddenToggleLabelProps {
  isHidden: boolean
  hideLabel?: string
  unhideLabel?: string
  iconClassName?: string
}

export function HiddenToggleLabel({
  isHidden,
  hideLabel = 'Hide',
  unhideLabel = 'Unhide',
  iconClassName,
}: HiddenToggleLabelProps) {
  const Icon = isHidden ? Eye : EyeOff
  return (
    <>
      <Icon className={cn('size-4', iconClassName)} aria-hidden />
      {isHidden ? unhideLabel : hideLabel}
    </>
  )
}
