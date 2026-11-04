import { useState } from 'react'
import { toast } from 'sonner'
import { getApiError } from '@/api/client'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/input'
import { labelAccountOption, type AwaitingAccountEmail } from '@/features/emails/awaiting-account'
import { useAssignAccount, useAwaitingAccount } from '@/features/emails/use-billing-emails'
import { formatInstant, formatMoney } from '@/lib/utils'

export function AwaitingAccountCard() {
  const emails = useAwaitingAccount()
  const assignMutation = useAssignAccount()
  const [selectedAccounts, setSelectedAccounts] = useState<Record<number, number>>({})

  if (emails.isError) {
    return (
      <Card className="p-4">
        <ErrorState bare error={emails.error} onRetry={() => void emails.refetch()} />
      </Card>
    )
  }
  if (!emails.data?.length) return null

  const assignAccount = async (email: AwaitingAccountEmail) => {
    const subscriptionId = selectedAccounts[email.emailId]
    if (subscriptionId === undefined) return
    try {
      await assignMutation.mutateAsync({ emailId: email.emailId, subscriptionId })
      toast.success('Email assigned to the account')
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Pick an account</CardTitle>
          <CardDescription>
            These emails name no customer ID, and you have more than one account with the same merchant. Choose the account each one
            belongs to.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        <ul className="divide-y divide-border">
          {emails.data.map((email) => {
            const selectId = `account-for-${email.emailId}`
            const selected = selectedAccounts[email.emailId]
            return (
              <li key={email.emailId} className="flex flex-wrap items-center gap-3 px-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fg">{email.subject ?? 'Billing email'}</span>
                  <span className="block text-xs text-muted">
                    {formatInstant(email.receivedAt)}
                    {email.amount !== null && email.currency !== null && ` · ${formatMoney(email.amount, email.currency)}`}
                  </span>
                </span>
                <label htmlFor={selectId} className="sr-only">
                  Account for {email.subject ?? 'this email'}
                </label>
                <Select
                  id={selectId}
                  wrapperClassName="w-56"
                  value={selected ?? ''}
                  onChange={(event) =>
                    setSelectedAccounts((current) => ({ ...current, [email.emailId]: Number(event.target.value) }))
                  }
                >
                  <option value="" disabled>
                    Choose account
                  </option>
                  {email.accounts.map((account) => (
                    <option key={account.subscriptionId} value={account.subscriptionId}>
                      {labelAccountOption(account)}
                    </option>
                  ))}
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void assignAccount(email)}
                  disabled={selected === undefined || assignMutation.isPending}
                >
                  {assignMutation.isPending ? 'Saving…' : 'Assign'}
                </Button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
