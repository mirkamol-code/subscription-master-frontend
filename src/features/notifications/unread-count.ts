const MAX_SHOWN = 9

export function formatUnreadCount(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) return null
  return count > MAX_SHOWN ? `${MAX_SHOWN}+` : String(Math.floor(count))
}
