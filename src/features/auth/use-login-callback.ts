import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeLoginCodeOnce, LOGIN_FAILED_PATH, readLoginCallback } from '@/features/auth/login-callback'
import { tokenStore } from '@/lib/token-store'
import type { TokenResponse } from '@/types/api'

function removeLoginCodeFromAddressBar() {
  window.history.replaceState(window.history.state, '', window.location.pathname)
}

function startNewSession(tokens: TokenResponse) {
  tokenStore.clear()
  tokenStore.set(tokens)
}

export function useLoginCallback() {
  const navigate = useNavigate()
  const [initialCallback] = useState(() => readLoginCallback(new URLSearchParams(window.location.search)))

  useEffect(() => {
    removeLoginCodeFromAddressBar()
    if (initialCallback.kind === 'error') {
      navigate(LOGIN_FAILED_PATH, { replace: true })
      return
    }
    if (initialCallback.kind === 'missing') {
      navigate('/login', { replace: true })
      return
    }

    let isCurrent = true
    exchangeLoginCodeOnce(initialCallback.code)
      .then((tokens) => {
        if (!isCurrent) return
        startNewSession(tokens)
        navigate('/', { replace: true })
      })
      .catch(() => {
        if (isCurrent) navigate(LOGIN_FAILED_PATH, { replace: true })
      })
    return () => {
      isCurrent = false
    }
  }, [initialCallback, navigate])
}
