import { PrivateLayout } from '@my/app/features/private/layout.web'
import { ProfileScreen } from '@my/app/features/profile/screen'
import { authClient } from '@my/auth/client/auth-client'
import { Text, View } from '@my/ui'
import { useRouter } from 'expo-router'
import Drawer from 'expo-router/drawer'
import { useEffect } from 'react'
// import { authClient } from 'lib/auth-client'

export default function PrivateLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !data?.session) {
      // Not authenticated, redirect to auth
      router.replace('/auth/sign-in')
    }
  }, [data, isPending, router])

  // Show loading while checking auth
  if (isPending) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </View>
    )
  }

  // Not authenticated, don't render anything (redirect is happening)
  if (!data?.session) {
    return null
  }

  // return <PrivateLayout>{children}</PrivateLayout>
  return (
    <Drawer
      drawerContent={ProfileScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="dashboard" />
      <Drawer.Screen name="profile" />
    </Drawer>
  )
}
