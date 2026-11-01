const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDateTime(instant: string | null) {
  return instant ? dateTimeFormat.format(new Date(instant)) : '—'
}
