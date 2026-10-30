import { emailsApi } from '@/api/endpoints/emails'
import type { BillingEmailAttachment } from '@/types/api'

export async function downloadAttachment(emailId: number, attachment: BillingEmailAttachment) {
  const blob = await emailsApi.getAttachment(emailId, attachment.id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
