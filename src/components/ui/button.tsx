import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-accent-fg shadow-sm shadow-accent/20 hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30',
        gradient:
          'bg-(image:--gradient-brand) text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:brightness-110',
        outline:
          'border border-border bg-transparent text-fg hover:border-fg/20 hover:bg-surface-raised',
        inverse: 'bg-fg text-background hover:bg-fg/90',
        ghost: 'text-muted hover:bg-surface-raised hover:text-fg',
        destructive: 'bg-danger text-white shadow-xs hover:brightness-110',
        subtle: 'bg-surface-raised text-fg hover:bg-fg/10',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 rounded-lg px-3 text-[13px]',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild, type, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
