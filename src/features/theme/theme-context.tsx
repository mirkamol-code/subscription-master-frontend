import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  THEME_COLORS,
  THEME_STORAGE_KEY,
  resolveTheme,
  toggleTheme,
  type Theme,
} from '@/features/theme/resolve-theme'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    return resolveTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return resolveTheme(null)
  }
}

function tryStoreTheme(theme: Theme): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    return true
  } catch {
    return false
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggle: () => {
        const next = toggleTheme(theme)
        setTheme(next)
        tryStoreTheme(next)
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook intentionally share one context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
