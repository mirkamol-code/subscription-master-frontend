import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
          <div className="animate-pop-in">
            <div className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600">
              <Trash2 className="size-5" />
            </div>
            <AlertDialog.Title className="mt-4 text-lg font-semibold text-slate-900">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {description}
            </AlertDialog.Description>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <Button
                variant="destructive"
                disabled={pending}
                onClick={(event) => {
                  // Keep the dialog open until the action settles; the caller closes it.
                  event.preventDefault()
                  onConfirm()
                }}
              >
                {pending ? pendingLabel : confirmLabel}
              </Button>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
