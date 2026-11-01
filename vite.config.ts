import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { THEME_BOOT_SCRIPT, THEME_COLORS } from './src/features/theme/resolve-theme.ts'

function themeBootPlugin(): Plugin {
  return {
    name: 'theme-boot',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { name: 'theme-color', content: THEME_COLORS.dark }, injectTo: 'head' },
      { tag: 'script', children: THEME_BOOT_SCRIPT, injectTo: 'head' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const proxyTarget = env.VITE_API_PROXY_TARGET?.replace(/\/$/, '').replace(/\/api$/, '')

  const proxy = proxyTarget
    ? {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      }
    : undefined

  return {
    plugins: [react(), tailwindcss(), themeBootPlugin()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: proxy ? { proxy } : undefined,
    preview: proxy ? { proxy } : undefined,
  }
})
