import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

type InputProps = Omit<Parameters<typeof Input>[0], 'value' | 'onChange'>

interface DebouncedInputProps extends InputProps {
  value: string
  onCommit: (value: string) => void
  delayMs?: number
}

/** Holds keystrokes locally and commits once the user pauses typing. */
export function DebouncedInput({ value, onCommit, delayMs = 350, ...props }: DebouncedInputProps) {
  const [draft, setDraft] = useState(value)
  const [committed, setCommitted] = useState(value)
  const [lastSeen, setLastSeen] = useState(value)

  // Adopt outside changes (e.g. "Clear filters", back navigation) without clobbering typing.
  if (value !== lastSeen) {
    setLastSeen(value)
    if (value !== committed) {
      setDraft(value)
      setCommitted(value)
    }
  }

  useEffect(() => {
    if (draft === committed) return
    const timer = setTimeout(() => {
      setCommitted(draft)
      onCommit(draft)
    }, delayMs)
    return () => clearTimeout(timer)
  }, [draft, committed, delayMs, onCommit])

  return <Input value={draft} onChange={(event) => setDraft(event.target.value)} {...props} />
}
