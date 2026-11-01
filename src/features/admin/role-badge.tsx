import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AdminRole } from '@/features/admin/types'

export function RoleBadge({ role }: { role: AdminRole }) {
  return role === 'ADMIN' ? (
    <Badge className="bg-accent/10 text-accent">
      <ShieldCheck className="size-3" /> Admin
    </Badge>
  ) : (
    <Badge className="bg-fg/[0.06] text-muted">User</Badge>
  )
}
