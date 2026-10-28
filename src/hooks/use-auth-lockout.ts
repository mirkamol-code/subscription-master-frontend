import { useEffect, useState } from 'react'

const LOCKOUT_STORAGE_KEY = 'subscription-master.auth-lockout'
const MAX_ATTEMPTS = 3
const DEFAULT_LOCKOUT_SECONDS = 60

interface LockoutState {
  failedAttempts: number
  lockedUntil: number | null
}

function getStoredLockout(): LockoutState {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY)
    if (!raw) return { failedAttempts: 0, lockedUntil: null }
    const parsed = JSON.parse(raw) as LockoutState

    if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
      localStorage.removeItem(LOCKOUT_STORAGE_KEY)
      return { failedAttempts: 0, lockedUntil: null }
    }

    return parsed
  } catch {
    return { failedAttempts: 0, lockedUntil: null }
  }
}

function saveLockout(state: LockoutState) {
  try {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function useAuthLockout() {
  const [state, setState] = useState<LockoutState>(getStoredLockout)
  const [now, setNow] = useState<number>(() => Date.now())

  const secondsRemaining = state.lockedUntil && state.lockedUntil > now
    ? Math.ceil((state.lockedUntil - now) / 1000)
    : 0

  const isLocked = secondsRemaining > 0

  useEffect(() => {
    if (!state.lockedUntil || state.lockedUntil <= Date.now()) {
      return
    }

    const interval = setInterval(() => {
      const current = Date.now()
      setNow(current)

      if (state.lockedUntil && current >= state.lockedUntil) {
        localStorage.removeItem(LOCKOUT_STORAGE_KEY)
        setState({ failedAttempts: 0, lockedUntil: null })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state.lockedUntil])

  const lockWithDuration = (seconds = DEFAULT_LOCKOUT_SECONDS) => {
    const nextState: LockoutState = {
      failedAttempts: MAX_ATTEMPTS,
      lockedUntil: Date.now() + seconds * 1000,
    }
    saveLockout(nextState)
    setState(nextState)
    setNow(Date.now())
  }

  const recordFailedAttempt = () => {
    const failedAttempts = getStoredLockout().failedAttempts + 1
    if (failedAttempts >= MAX_ATTEMPTS) {
      lockWithDuration()
      return
    }
    const nextState: LockoutState = { failedAttempts, lockedUntil: null }
    saveLockout(nextState)
    setState(nextState)
  }

  const recordSuccessfulAttempt = () => {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY)
    setState({ failedAttempts: 0, lockedUntil: null })
    setNow(Date.now())
  }

  const formattedTime = `${String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:${String(
    secondsRemaining % 60,
  ).padStart(2, '0')}`

  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - state.failedAttempts)

  return {
    isLocked,
    secondsRemaining,
    formattedTime,
    failedAttempts: state.failedAttempts,
    attemptsRemaining,
    recordFailedAttempt,
    lockWithDuration,
    recordSuccessfulAttempt,
  }
}
