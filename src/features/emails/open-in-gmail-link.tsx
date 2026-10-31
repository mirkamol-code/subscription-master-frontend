import { ExternalLink } from 'lucide-react'
import { buildGmailMessageUrl } from '@/features/emails/gmail-link'
import { useGmailAddress } from '@/features/gmail/use-gmail'
import { cn } from '@/lib/utils'

interface OpenInGmailLinkProps {
  gmailMessageId: string
  className?: string
}

export function OpenInGmailLink({ gmailMessageId, className }: OpenInGmailLinkProps) {
  const gmailAddress = useGmailAddress()
  return (
    <a
      href={buildGmailMessageUrl(gmailMessageId, gmailAddress)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1.5 hover:text-teal-700', className)}
    >
      <ExternalLink className="size-3.5" aria-hidden /> Open in Gmail
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
