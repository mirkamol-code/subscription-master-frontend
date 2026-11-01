import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isDeleteConfirmed } from '@/features/user-deletion/delete-confirmation'

interface TypedConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  email: string
  confirmLabel: string
  pendingLabel: string
  onConfirm: () => void
  pending: boolean
}

export function TypedConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  email,
  confirmLabel,
  pendingLabel,
  onConfirm,
  pending,
}: TypedConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const canConfirm = isDeleteConfirmed(typed, email) && !pending

  const changeOpen = (isOpen: boolean) => {
    if (!pending) onOpenChange(isOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogContent className="max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (canConfirm) onConfirm()
          }}
        >
          <div className="grid size-11 place-items-center rounded-full bg-danger/10 text-danger">
            <TriangleAlert className="size-5" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
          <label htmlFor="confirm-email" className="mt-5 block text-sm font-medium text-fg">
            Type <span className="font-semibold text-fg">{email}</span> to confirm
          </label>
          <Input
            id="confirm-email"
            type="email"
            autoComplete="off"
            className="mt-1.5"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            disabled={pending}
          />
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={pending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={!canConfirm}>
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
