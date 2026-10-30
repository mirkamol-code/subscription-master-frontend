import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { accountApi } from '@/api/endpoints/account'
import { useAuth } from '@/features/auth/auth-context'

const GOOGLE_PERMISSIONS_URL = 'https://myaccount.google.com/permissions'

function useEndSession() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return () => {
    logout()
    navigate('/login', { replace: true })
  }
}

function warnIfGoogleAccessRemains(googleAccessRevoked: boolean) {
  if (googleAccessRevoked) return
  toast.warning('Google access couldn’t be removed', {
    description: `Remove Subscription Master at ${GOOGLE_PERMISSIONS_URL}.`,
    duration: 15_000,
  })
}

export function useDisconnectGmail() {
  const endSession = useEndSession()
  return useMutation({
    mutationFn: accountApi.disconnectGmail,
    onSuccess: ({ googleAccessRevoked }) => {
      endSession()
      toast.success('Gmail disconnected and your data deleted')
      warnIfGoogleAccessRemains(googleAccessRevoked)
    },
  })
}

export function useDeleteAccount() {
  const endSession = useEndSession()
  return useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: () => {
      endSession()
      toast.success('Your account was deleted')
    },
  })
}
