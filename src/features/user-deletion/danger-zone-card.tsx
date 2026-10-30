import { useState } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypedConfirmDialog } from '@/features/user-deletion/typed-confirm-dialog'
import { useDeleteUser, useDisconnectGmail } from '@/features/user-deletion/use-user-deletion'
import { useCurrentUser } from '@/hooks/use-current-user'

type DangerAction = 'disconnect' | 'delete'

const DELETED_DATA = 'subscriptions, payments, billing emails, notifications and browser notification sign-ups on every device'

const DANGER_ACTIONS: Record<DangerAction, { title: string; text: string; buttonLabel: string; dialogTitle: string; dialogText: string; confirmLabel: string }> = {
  disconnect: {
    title: 'Disconnect Gmail and delete my data',
    text: `Removes our access to Gmail and deletes your ${DELETED_DATA}. You’ll be signed out.`,
    buttonLabel: 'Disconnect Gmail',
    dialogTitle: 'Disconnect Gmail and delete your data?',
    dialogText: `Your ${DELETED_DATA} will be deleted for good, and Google access removed.`,
    confirmLabel: 'Disconnect and delete',
  },
  delete: {
    title: 'Delete my account',
    text: 'Deletes everything above and your account itself.',
    buttonLabel: 'Delete account',
    dialogTitle: 'Delete your account?',
    dialogText: `Your account and your ${DELETED_DATA} will be deleted for good.`,
    confirmLabel: 'Delete account',
  },
}

function DangerRow({ title, text, label, onClick }: { title: string; text: string; label: string; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-[13px] text-slate-500">{text}</p>
      </div>
      <Button variant="outline" size="sm" className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={onClick}>
        {label}
      </Button>
    </div>
  )
}

export function DangerZoneCard() {
  const [action, setAction] = useState<DangerAction | null>(null)
  const { data: user } = useCurrentUser()
  const disconnect = useDisconnectGmail()
  const deleteUser = useDeleteUser()
  const mutation = action === 'delete' ? deleteUser : disconnect
  const dialog = DANGER_ACTIONS[action ?? 'disconnect']

  const confirm = async () => {
    try {
      await mutation.mutateAsync()
      setAction(null)
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return (
    <Card className="border-rose-100">
      <CardHeader>
        <div>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>These can’t be undone.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 pt-0">
        {(Object.keys(DANGER_ACTIONS) as DangerAction[]).map((key) => (
          <DangerRow
            key={key}
            title={DANGER_ACTIONS[key].title}
            text={DANGER_ACTIONS[key].text}
            label={DANGER_ACTIONS[key].buttonLabel}
            onClick={() => setAction(key)}
          />
        ))}
      </CardContent>
      <TypedConfirmDialog
        key={action ?? 'closed'}
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
        title={dialog.dialogTitle}
        description={dialog.dialogText}
        email={user?.email ?? ''}
        confirmLabel={dialog.confirmLabel}
        pendingLabel="Deleting…"
        onConfirm={() => void confirm()}
        pending={mutation.isPending}
      />
    </Card>
  )
}
