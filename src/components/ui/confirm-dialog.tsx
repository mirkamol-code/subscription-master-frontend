import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { MouseEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function confirmWithoutClosing(event: MouseEvent<HTMLButtonElement>, onConfirm: () => void) {
  event.preventDefault()
  onConfirm()
}

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  pendingLabel?: string
  onConfirm: () => void
  pending?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel = 'Working…',
  onConfirm,
  pending,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="grid size-11 place-items-center rounded-full bg-danger/10 text-danger">
          <Trash2 className="size-5" />
        </div>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={pending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={(event) => confirmWithoutClosing(event, onConfirm)}
          >
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
