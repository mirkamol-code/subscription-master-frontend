import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Page } from '@/types/api'

interface PagerProps {
  page: Page<unknown>
  onPageChange: (page: number) => void
  label: string
}

export function Pager({ page, onPageChange, label }: PagerProps) {
  if (page.totalPages <= 1) return null
  return (
    <nav aria-label={label} className="flex items-center justify-between gap-3">
      <p className="text-[13px] text-muted">
        Page {page.number + 1} of {page.totalPages}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page.first} onClick={() => onPageChange(page.number - 1)}>
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page.last} onClick={() => onPageChange(page.number + 1)}>
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  )
}
