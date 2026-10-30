import type { GmailConnection } from '@/types/api'

export interface GmailConnectionDescription {
  title: string
  description: string
  canSync: boolean
  actionLabel?: string
}

export function describeGmailConnection(connection: GmailConnection): GmailConnectionDescription {
  const address = connection.gmailAddress?.trim() ?? ''
  if (connection.status === 'DISCONNECTED') {
    return {
      title: 'Gmail disconnected',
      description: `Reconnect ${address || 'Gmail'} to keep finding subscriptions in your billing emails.`,
      canSync: false,
      actionLabel: 'Reconnect Gmail',
    }
  }
  if (connection.status === 'CONNECTED') return { title: 'Gmail connected', description: address, canSync: true }
  return {
    title: 'Find subscriptions automatically',
    description: 'Connect Gmail and we’ll read your billing emails for receipts and renewals.',
    canSync: false,
    actionLabel: 'Connect Gmail',
  }
}
