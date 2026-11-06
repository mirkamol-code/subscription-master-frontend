import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-[10px] bg-(image:--gradient-brand) text-white shadow-md shadow-accent/30',
        className,
      )}
    >
      <svg viewBox="32 32 448 448" fill="none" className="size-full">
        <g transform="translate(32, 32) scale(0.875)" fill="currentColor">
          <path d="M 256 74 A 182 182 0 1 1 108 376" fill="none" stroke="currentColor" strokeWidth="36" strokeLinecap="round" />
          <polygon points="256,46 296,90 236,106" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="256" cy="180" r="14" />
          <path d="M 220 220 C 220 185 292 185 292 220 C 292 250 316 276 322 300 L 190 300 C 196 276 220 250 220 220 Z" />
          <circle cx="256" cy="326" r="14" />
          <path
            d="M 240 250 L 252 262 L 274 240"
            fill="none"
            stroke="#6366F1"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
  )
}
