import { CategoryIcon } from '@/components/common/category-icon'
import { getBrandLogo } from '@/lib/brand-logos'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/api'

const tileSizes = {
  sm: 'size-8 rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-14 rounded-2xl',
}

const markSizes = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

interface SubscriptionLogoProps {
  merchantKey: string | null
  category: Category
  size?: keyof typeof tileSizes
  className?: string
}

export function SubscriptionLogo({ merchantKey, category, size = 'md', className }: SubscriptionLogoProps) {
  const logo = getBrandLogo(merchantKey)
  if (!logo) return <CategoryIcon category={category} size={size} className={className} />
  const mask = `url("${logo.src}") center / contain no-repeat`
  return (
    <div aria-hidden className={cn('grid shrink-0 place-items-center bg-fg/[0.06] text-fg', tileSizes[size], className)}>
      {logo.tint ? (
        <span className={markSizes[size]} style={{ backgroundColor: logo.tint, mask, WebkitMask: mask }} />
      ) : (
        <img src={logo.src} alt="" className={cn('object-contain', markSizes[size])} />
      )}
    </div>
  )
}
