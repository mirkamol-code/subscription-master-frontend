import type { InputHTMLAttributes, Ref, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-fg outline-none transition placeholder:text-muted/70 hover:border-fg/20 focus:border-accent focus:ring-4 focus:ring-accent/15 disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-muted aria-invalid:border-danger aria-invalid:focus:ring-danger/15'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
}

export function Input({ className, ref, ...props }: InputProps) {
  return <input ref={ref} className={cn(fieldClass, className)} {...props} />
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>
  wrapperClassName?: string
}

export function Select({ className, wrapperClassName, ref, children, ...props }: SelectProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <select ref={ref} className={cn(fieldClass, 'appearance-none pr-9', className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
}
