import { useSearchParams } from 'react-router-dom'

export function useSearchParamUpdater() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateParams = (changes: Record<string, string>, replace = false) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace },
    )

  return { searchParams, setSearchParams, updateParams }
}
