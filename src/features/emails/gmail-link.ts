export function buildGmailMessageUrl(gmailMessageId: string, gmailAddress: string | null): string {
  const message = `#all/${encodeURIComponent(gmailMessageId)}`
  if (!gmailAddress) return `https://mail.google.com/mail/u/0/${message}`
  return `https://mail.google.com/mail/?authuser=${encodeURIComponent(gmailAddress)}${message}`
}
