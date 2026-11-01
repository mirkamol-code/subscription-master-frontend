import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

const contentVariants = cva('fixed z-50 border-border bg-surface-raised shadow-2xl shadow-black/40 outline-none', {
  variants: {
    placement: {
      center:
        'left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 animate-pop-in',
      left: 'inset-y-0 left-0 w-72 border-r animate-slide-in-left',
    },
  },
  defaultVariants: { placement: 'center' },
})

interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof contentVariants> {
  overlayClassName?: string
}

export function DialogContent({ className, overlayClassName, placement, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in', overlayClassName)}
      />
      <DialogPrimitive.Content className={cn(contentVariants({ placement }), className)} {...props} />
    </DialogPrimitive.Portal>
  )
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('text-lg font-semibold text-fg', className)} {...props} />
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('mt-1 text-sm text-muted', className)} {...props} />
}

export function DialogCloseButton({ className, ...props }: ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      aria-label="Close"
      className={cn(
        'grid size-8 place-items-center rounded-lg text-muted outline-none transition-colors hover:bg-fg/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <X className="size-4" />
    </DialogPrimitive.Close>
  )
}
