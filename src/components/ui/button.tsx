import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white shadow-xs hover:bg-slate-800',
        accent:
          'bg-teal-600 text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 hover:shadow-md hover:shadow-teal-600/25',
        outline:
          'border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-500',
        subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900',
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
