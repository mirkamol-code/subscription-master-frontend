import type { ComponentType } from 'react'
import {
  Activity,
  BookOpen,
  Briefcase,
  Clapperboard,
  Layers,
  Server,
  Sparkles,
  Wallet,
} from 'lucide-react'
import type { Category } from '@/types/api'

export interface CategoryMeta {
  label: string
  icon: ComponentType<{ className?: string }>
  iconBg: string
  accentColor: string
}

export const CATEGORY_CONFIG: Record<Category, CategoryMeta> = {
  ENTERTAINMENT: {
    label: 'Entertainment',
    icon: Clapperboard,
    iconBg: 'bg-purple-500/12 text-purple-500',
    accentColor: '#9333ea',
  },
  PRODUCTIVITY: {
    label: 'Productivity',
    icon: Briefcase,
    iconBg: 'bg-blue-500/12 text-blue-500',
    accentColor: '#2563eb',
  },
  AI_TOOLS: {
    label: 'AI Tools',
    icon: Sparkles,
    iconBg: 'bg-emerald-500/12 text-emerald-600',
    accentColor: '#059669',
  },
  EDUCATION: {
    label: 'Education',
    icon: BookOpen,
    iconBg: 'bg-indigo-500/12 text-indigo-500',
    accentColor: '#6366f1',
  },
  HEALTH: {
    label: 'Health & Fitness',
    icon: Activity,
    iconBg: 'bg-rose-500/12 text-rose-500',
    accentColor: '#e11d48',
  },
  FINANCE: {
    label: 'Finance',
    icon: Wallet,
    iconBg: 'bg-amber-500/12 text-amber-600',
    accentColor: '#d97706',
  },
  INFRASTRUCTURE: {
    label: 'Infrastructure',
    icon: Server,
    iconBg: 'bg-cyan-500/12 text-cyan-600',
    accentColor: '#0891b2',
  },
  OTHER: {
    label: 'Other',
    icon: Layers,
    iconBg: 'bg-fg/[0.06] text-muted',
    accentColor: '#64748b',
  },
}

export function getCategoryMeta(category: Category): CategoryMeta {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER
}
