import {
  CustomToast,
  TamaguiProvider,
  type TamaguiProviderProps,
  ToastProvider,
  config,
  isWeb,
} from '@my/ui'
import { useColorScheme } from 'react-native'
import { ToastViewport } from './ToastViewport'
import { SafeAreaProvider } from './safe-area'
import { UniversalThemeProvider } from './theme'

export function Provider({
  children,
  defaultTheme = 'light',
  ...rest
}: Omit<TamaguiProviderProps, 'config'> & { defaultTheme?: string }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme} {...rest}>
      <SafeAreaProvider>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={isWeb ? [] : ['mobile']}>
          {children}
          <CustomToast />

          <ToastViewport />
        </ToastProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
    // <Providers>{children}</Providers>
  )
}
