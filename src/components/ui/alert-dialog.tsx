import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogCancel = AlertDialogPrimitive.Cancel

export function AlertDialogContent({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <AlertDialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface-raised p-6 shadow-2xl shadow-black/40 outline-none animate-pop-in',
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  )
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title className={cn('mt-4 text-lg font-semibold text-fg', className)} {...props} />
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('mt-1.5 text-sm leading-relaxed text-muted', className)}
      {...props}
    />
  )
}
