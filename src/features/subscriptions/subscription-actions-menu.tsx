import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { STATUS_CHOICE_UI } from '@/features/subscriptions/status-action'
import { getStatusChoices, type UserStatus } from '@/features/subscriptions/status-choices'
import { cn } from '@/lib/utils'
import type { Subscription } from '@/types/api'

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 outline-none data-highlighted:bg-slate-100'

export interface SubscriptionItemActions {
  onChangeStatus: (item: Subscription, status: UserStatus) => void
  onDelete: (item: Subscription) => void
}

interface SubscriptionActionsMenuProps extends SubscriptionItemActions {
  item: Subscription
  className?: string
}

export function SubscriptionActionsMenu({
  item,
  onChangeStatus,
  onDelete,
  className,
}: SubscriptionActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`More actions for ${item.name}`}
          className={cn(
            'grid size-8 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-teal-500/60 data-[state=open]:bg-slate-100',
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-40 min-w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl animate-pop-in"
        >
          <DropdownMenu.Item asChild className={itemClass}>
            <Link to={`/subscriptions/${item.id}/edit`}>
              <Pencil className="size-4 text-slate-400" /> Edit
            </Link>
          </DropdownMenu.Item>
          {getStatusChoices(item.status).map((status) => {
            const { icon: StatusIcon, label } = STATUS_CHOICE_UI[status]
            return (
              <DropdownMenu.Item key={status} onSelect={() => onChangeStatus(item, status)} className={itemClass}>
                <StatusIcon className="size-4 text-slate-400" /> {label}
              </DropdownMenu.Item>
            )
          })}
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
          <DropdownMenu.Item
            onSelect={() => onDelete(item)}
            className={cn(itemClass, 'text-rose-600 data-highlighted:bg-rose-50')}
          >
            <Trash2 className="size-4" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
