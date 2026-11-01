import { useState } from 'react'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useCurrentUser } from '@/hooks/use-current-user'
import { getRoleChangePrompt } from '@/features/admin/role-change-prompt'
import { useChangeRole } from '@/features/admin/use-change-role'
import { getDisplayName } from '@/features/admin/user-display-name'
import type { AdminUser } from '@/features/admin/types'

export function RoleControl({ user }: { user: AdminUser }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const currentUser = useCurrentUser()
  const changeRole = useChangeRole()
  const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
  const prompt = getRoleChangePrompt({
    name: getDisplayName(user),
    nextRole,
    isSelf: currentUser.data?.id === user.id,
  })

  const Icon = prompt.isDestructive ? ShieldOff : ShieldCheck
  const confirmRoleChange = () =>
    changeRole.mutate({ id: user.id, role: nextRole }, { onSettled: () => setIsConfirming(false) })

  return (
    <>
      <Button variant={prompt.isDestructive ? 'outline' : 'default'} onClick={() => setIsConfirming(true)}>
        <Icon className="size-4" />
        {prompt.actionLabel}
      </Button>
      <ConfirmDialog
        open={isConfirming}
        onOpenChange={setIsConfirming}
        title={prompt.title}
        description={prompt.description}
        confirmLabel={prompt.confirmLabel}
        pendingLabel="Saving…"
        pending={changeRole.isPending}
        onConfirm={confirmRoleChange}
        icon={Icon}
        isDestructive={prompt.isDestructive}
      />
    </>
  )
}
