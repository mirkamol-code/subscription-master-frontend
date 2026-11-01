import { describe, expect, it } from 'vitest'
import {
  THEME_BOOT_SCRIPT,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  resolveTheme,
  toggleTheme,
} from '@/features/theme/resolve-theme'

function runBootScript(stored: string | null) {
  const classes = new Set<string>()
  const meta = { content: '', setAttribute: (_name: string, value: string) => (meta.content = value) }
  const document = {
    documentElement: {
      classList: { toggle: (name: string, force: boolean) => (force ? classes.add(name) : classes.delete(name)) },
    },
    querySelector: () => meta,
  }
  const localStorage = { getItem: (key: string) => (key === THEME_STORAGE_KEY ? stored : null) }
  new Function('document', 'localStorage', THEME_BOOT_SCRIPT)(document, localStorage)
  return { isDark: classes.has('dark'), themeColor: meta.content }
}

describe('resolveTheme', () => {
  it('starts in dark mode when nothing was chosen', () => {
    // given
    const stored = null

    // when
    const theme = resolveTheme(stored)

    // then
    expect(theme).toBe('dark')
  })

  it('keeps the light theme the user chose', () => {
    // given
    const stored = 'light'

    // when
    const theme = resolveTheme(stored)

    // then
    expect(theme).toBe('light')
  })

  it('falls back to dark when the stored value is not a theme', () => {
    // given
    const stored = 'sepia'

    // when
    const theme = resolveTheme(stored)

    // then
    expect(theme).toBe('dark')
  })
})

describe('toggleTheme', () => {
  it('switches dark to light', () => {
    // given
    const theme = 'dark'

    // when
    const toggled = toggleTheme(theme)

    // then
    expect(toggled).toBe('light')
  })

  it('switches light to dark', () => {
    // given
    const theme = 'light'

    // when
    const toggled = toggleTheme(theme)

    // then
    expect(toggled).toBe('dark')
  })
})

describe('THEME_BOOT_SCRIPT', () => {
  it.each([null, 'light', 'dark', 'sepia'])('paints the same theme the app resolves for %s', (stored) => {
    // given
    const expected = resolveTheme(stored)

    // when
    const painted = runBootScript(stored)

    // then
    expect(painted).toEqual({ isDark: expected === 'dark', themeColor: THEME_COLORS[expected] })
  })
})
