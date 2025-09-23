import { DrawerMenu } from '@my/app/features/drawer-menu'
import { authClient } from '@my/auth/client/auth-client'
import { Button, Text, useTheme, View } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Stack, useNavigation, useRouter } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useEffect } from 'react'
import { Home, LayoutDashboard, Menu, Plus, User, User2 } from '@tamagui/lucide-icons'

export default function Layout() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  const navigation = useNavigation()

  const { accentColor } = useTheme()

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
  return (
    <>
      {/* <Stack.Screen
        options={{
          title: 'Drawer',
          headerShown: true,
          // headerShown: pathname == '/private/(tabs)/index' ? true : false,
          headerTintColor: accentColor.val,
          headerLeft: () => (
            <Button
              borderStyle="unset"
              borderWidth={0}
              backgroundColor="transparent"
              marginLeft="$-1"
              paddingHorizontal="$4"
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer())
              }}
            >
              <Menu size={24} />
            </Button>
          ),
        }}
      /> */}
      <Drawer drawerContent={DrawerMenu} />
    </>
  )
}
