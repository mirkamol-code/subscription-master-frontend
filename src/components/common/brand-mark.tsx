import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-teal-400 to-emerald-600 text-white shadow-sm shadow-emerald-600/30',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[60%]">
        <path
          d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
