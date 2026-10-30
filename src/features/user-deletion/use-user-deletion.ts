import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { userApi } from '@/api/endpoints/user'
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
    mutationFn: userApi.disconnectGmail,
    onSuccess: ({ googleAccessRevoked }) => {
      endSession()
      toast.success('Gmail disconnected and your data deleted')
      warnIfGoogleAccessRemains(googleAccessRevoked)
    },
  })
}

export function useDeleteUser() {
  const endSession = useEndSession()
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      endSession()
      toast.success('Your account was deleted')
    },
  })
}
