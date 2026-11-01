import { DUE_TONES, DUE_TONE_LABEL, getDueToneClass } from '@/features/admin/due-calendar'
import { cn } from '@/lib/utils'

export function DueLegend() {
  return (
    <ul aria-label="Calendar colours" className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-muted">
      {DUE_TONES.map((tone) => (
        <li key={tone} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn('due-swatch', getDueToneClass(tone))} />
          {DUE_TONE_LABEL[tone]}
        </li>
      ))}
    </ul>
  )
}
