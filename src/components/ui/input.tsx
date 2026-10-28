import type { InputHTMLAttributes, Ref, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const fieldClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-500/10'

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
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}
