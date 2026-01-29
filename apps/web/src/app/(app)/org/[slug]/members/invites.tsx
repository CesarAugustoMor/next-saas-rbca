import { ability, getCurrentOrg } from '@/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/get-invites'

import { CreateInviteForm } from './create-invite-form'
import { RevokeInviteButton } from './revoke-invite-button'

export async function Invites() {
  const currentOrg = getCurrentOrg()
  const permissions = await ability()

  const { invites } = await getInvites(currentOrg!)

  return (
    <div className="space-y-4">
        <h2 className="text-lg font-semibold">Invites</h2>
    </div>
  )
}
