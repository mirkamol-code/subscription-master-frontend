import type { ComponentType, ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ComponentType<{ className?: string }>
  action?: ReactNode
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
      <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
