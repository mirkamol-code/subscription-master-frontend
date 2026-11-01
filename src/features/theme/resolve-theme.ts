export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'subscription-master.theme'

export const THEME_COLORS: Record<Theme, string> = { dark: '#09090b', light: '#fafafa' }

export function resolveTheme(stored: string | null): Theme {
  return stored === 'light' ? 'light' : 'dark'
}

export function toggleTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

export const THEME_BOOT_SCRIPT = `(function () {
  var theme = 'dark';
  try {
    if (localStorage.getItem('${THEME_STORAGE_KEY}') === 'light') theme = 'light';
  } catch (error) {}
  document.documentElement.classList.toggle('dark', theme === 'dark');
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '${THEME_COLORS.dark}' : '${THEME_COLORS.light}');
})();`
