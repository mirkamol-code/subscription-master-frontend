import { useState } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypedConfirmDialog } from '@/features/account/typed-confirm-dialog'
import { useDeleteAccount, useDisconnectGmail } from '@/features/account/use-account-deletion'
import { useCurrentUser } from '@/hooks/use-current-user'

type DangerAction = 'disconnect' | 'delete'

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
  const deleteAccount = useDeleteAccount()
  const mutation = action === 'delete' ? deleteAccount : disconnect

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
        <DangerRow
          title="Disconnect Gmail and delete my data"
          text="Removes our access to Gmail and deletes your subscriptions, payments, billing emails and notifications. You’ll be signed out."
          label="Disconnect Gmail"
          onClick={() => setAction('disconnect')}
        />
        <DangerRow
          title="Delete my account"
          text="Deletes everything above and your account itself."
          label="Delete account"
          onClick={() => setAction('delete')}
        />
      </CardContent>
      <TypedConfirmDialog
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
        title={action === 'delete' ? 'Delete your account?' : 'Disconnect Gmail and delete your data?'}
        description={
          action === 'delete'
            ? 'Your account, subscriptions, payments, billing emails and notifications will be deleted for good.'
            : 'Your subscriptions, payments, billing emails and notifications will be deleted for good, and Google access removed.'
        }
        email={user?.email ?? ''}
        confirmLabel={action === 'delete' ? 'Delete account' : 'Disconnect and delete'}
        pendingLabel="Deleting…"
        onConfirm={() => void confirm()}
        pending={mutation.isPending}
      />
    </Card>
  )
}
