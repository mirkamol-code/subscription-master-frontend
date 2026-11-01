import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiddenToggleLabel } from '@/features/subscriptions/hidden-toggle-label'
import { STATUS_CHOICE_UI } from '@/features/subscriptions/status-choice-ui'
import { getStatusChoices, type UserStatus } from '@/features/subscriptions/status-choices'
import { cn } from '@/lib/utils'
import type { Subscription } from '@/types/api'

export interface SubscriptionItemActions {
  onChangeStatus: (item: Subscription, status: UserStatus) => void
  onToggleHidden: (item: Subscription) => void
  onDelete: (item: Subscription) => void
}

interface SubscriptionActionsMenuProps extends SubscriptionItemActions {
  item: Subscription
  className?: string
}

export function SubscriptionActionsMenu({
  item,
  onChangeStatus,
  onToggleHidden,
  onDelete,
  className,
}: SubscriptionActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`More actions for ${item.name}`}
          className={cn(
            'grid size-8 place-items-center rounded-lg text-muted outline-none transition-colors hover:bg-fg/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-fg/[0.06]',
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="z-40">
        <DropdownMenuItem asChild>
          <Link to={`/subscriptions/${item.id}/edit`}>
            <Pencil /> Edit
          </Link>
        </DropdownMenuItem>
        {getStatusChoices(item.status).map((status) => {
          const { icon: StatusIcon, label } = STATUS_CHOICE_UI[status]
          return (
            <DropdownMenuItem key={status} onSelect={() => onChangeStatus(item, status)}>
              <StatusIcon /> {label}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuItem onSelect={() => onToggleHidden(item)}>
          <HiddenToggleLabel isHidden={item.hidden} iconClassName="text-muted" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem isDestructive onSelect={() => onDelete(item)}>
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
