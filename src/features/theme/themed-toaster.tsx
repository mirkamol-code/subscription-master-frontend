import { Toaster } from 'sonner'
import { useTheme } from '@/features/theme/theme-context'

export function ThemedToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      toastOptions={{ className: 'rounded-xl! font-sans! text-sm!' }}
    />
  )
}
