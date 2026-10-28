import type { ComponentType } from 'react'
import {
  Activity,
  BookOpen,
  Briefcase,
  Clapperboard,
  Layers,
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
    iconBg: 'bg-purple-50 text-purple-600',
    accentColor: '#9333ea',
  },
  PRODUCTIVITY: {
    label: 'Productivity',
    icon: Briefcase,
    iconBg: 'bg-blue-50 text-blue-600',
    accentColor: '#2563eb',
  },
  AI_TOOLS: {
    label: 'AI Tools',
    icon: Sparkles,
    iconBg: 'bg-emerald-50 text-emerald-600',
    accentColor: '#059669',
  },
  EDUCATION: {
    label: 'Education',
    icon: BookOpen,
    iconBg: 'bg-indigo-50 text-indigo-600',
    accentColor: '#4f46e5',
  },
  HEALTH: {
    label: 'Health & Fitness',
    icon: Activity,
    iconBg: 'bg-rose-50 text-rose-600',
    accentColor: '#e11d48',
  },
  FINANCE: {
    label: 'Finance',
    icon: Wallet,
    iconBg: 'bg-amber-50 text-amber-600',
    accentColor: '#d97706',
  },
  OTHER: {
    label: 'Other',
    icon: Layers,
    iconBg: 'bg-slate-100 text-slate-600',
    accentColor: '#64748b',
  },
}

export function getCategoryMeta(category: Category): CategoryMeta {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER
}
