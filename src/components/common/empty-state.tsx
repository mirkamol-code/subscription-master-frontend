import { Inbox } from 'lucide-react'

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
        <Inbox className="size-5" />
      </div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}

