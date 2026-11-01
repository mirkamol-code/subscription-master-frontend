import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors [&_svg]:size-4'

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-40 rounded-xl border border-border bg-surface-raised p-1 shadow-2xl shadow-black/20 animate-pop-in',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

interface DropdownMenuItemProps extends ComponentProps<typeof DropdownMenuPrimitive.Item> {
  isDestructive?: boolean
}

export function DropdownMenuItem({ className, isDestructive, ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        itemClass,
        isDestructive
          ? 'text-danger data-highlighted:bg-danger/10'
          : 'text-fg data-highlighted:bg-fg/[0.06] [&_svg]:text-muted',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(itemClass, 'text-fg data-highlighted:bg-fg/[0.06] [&_svg]:text-muted', className)}
      {...props}
    >
      {children}
      <DropdownMenuPrimitive.ItemIndicator className="ml-auto">
        <Check className="text-accent!" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  )
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2.5 pb-1 pt-2 text-xs font-medium text-muted', className)}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn('my-1 h-px bg-border', className)} {...props} />
}
