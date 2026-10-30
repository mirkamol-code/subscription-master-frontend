function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isDeleteConfirmed(typed: string, email: string): boolean {
  const expected = normalizeEmail(email)
  return expected.length > 0 && normalizeEmail(typed) === expected
}
