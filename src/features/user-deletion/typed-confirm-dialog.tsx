import { useState } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
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
    <AlertDialog.Root open={open} onOpenChange={changeOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
          <form
            className="animate-pop-in"
            onSubmit={(event) => {
              event.preventDefault()
              if (canConfirm) onConfirm()
            }}
          >
            <div className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600">
              <TriangleAlert className="size-5" />
            </div>
            <AlertDialog.Title className="mt-4 text-lg font-semibold text-slate-900">{title}</AlertDialog.Title>
            <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {description}
            </AlertDialog.Description>
            <label htmlFor="confirm-email" className="mt-5 block text-sm font-medium text-slate-700">
              Type <span className="font-semibold text-slate-900">{email}</span> to confirm
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
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <Button type="submit" variant="destructive" disabled={!canConfirm}>
                {pending ? pendingLabel : confirmLabel}
              </Button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
