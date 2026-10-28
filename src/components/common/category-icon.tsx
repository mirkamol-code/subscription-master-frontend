import { getCategoryMeta } from '@/lib/category-config'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/api'

const sizes = {
  sm: 'size-8 rounded-lg [&_svg]:size-4',
  md: 'size-10 rounded-xl [&_svg]:size-[18px]',
  lg: 'size-14 rounded-2xl [&_svg]:size-6',
}

export function CategoryIcon({
  category,
  size = 'md',
  className,
}: {
  category: Category
  size?: keyof typeof sizes
  className?: string
}) {
  const meta = getCategoryMeta(category)
  const Icon = meta.icon
  return (
    <div
      aria-hidden
      className={cn('grid shrink-0 place-items-center', meta.iconBg, sizes[size], className)}
    >
      <Icon />
    </div>
  )
}
