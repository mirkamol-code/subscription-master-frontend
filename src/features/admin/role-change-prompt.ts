import type { AdminRole } from '@/features/admin/types'

interface RoleChange {
  name: string
  nextRole: AdminRole
  isSelf: boolean
}

export interface RoleChangePrompt {
  title: string
  description: string
  confirmLabel: string
  actionLabel: string
  isDestructive: boolean
}

export function getRoleChangePrompt({ name, nextRole, isSelf }: RoleChange): RoleChangePrompt {
  if (nextRole === 'ADMIN')
    return {
      title: `Make ${name} an admin?`,
      description: `${name} will see every user, subscription and payment, and can change other people’s roles.`,
      confirmLabel: 'Make admin',
      actionLabel: 'Make admin',
      isDestructive: false,
    }
  if (isSelf)
    return {
      title: 'Remove your own admin role?',
      description:
        'You will lose access to the admin area straight away and only another admin can give it back.',
      confirmLabel: 'Remove my admin role',
      actionLabel: 'Remove admin',
      isDestructive: true,
    }
  return {
    title: `Remove admin from ${name}?`,
    description: `${name} will lose access to the admin area on their next request.`,
    confirmLabel: 'Remove admin',
    actionLabel: 'Remove admin',
    isDestructive: true,
  }
}
