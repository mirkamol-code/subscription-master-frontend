import axios from 'axios'

export function isForbiddenOrMissing(error: unknown) {
  if (!axios.isAxiosError(error)) return false
  const status = error.response?.status
  return status === 403 || status === 404
}
