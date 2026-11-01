interface NamedUser {
  displayName: string | null
  email: string
}

export function getDisplayName(user: NamedUser) {
  return user.displayName || user.email
}
