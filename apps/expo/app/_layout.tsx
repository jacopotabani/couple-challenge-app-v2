import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from '@my/app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthStateChangeHandler } from '@my/app/provider/auth/AuthStateChangeHandler'

export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'index',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Landing/Home Page */}
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />

            {/* Auth Stack - Public Routes */}
            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
                presentation: 'modal', // Optional: makes auth feel like a modal
              }}
            />

            {/* Private Stack - Protected Routes */}
            <Stack.Screen
              name="private"
              options={{
                headerShown: false,
              }}
            />

            {/* Legacy drawer route - can be removed after migration */}
            <Stack.Screen
              name="(drawer)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <NativeToast />
        </ThemeProvider>
        <AuthStateChangeHandler />
      </Provider>
    </GestureHandlerRootView>
  )
}
