import { useTheme, Button } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Home, LayoutDashboard, Menu, Plus, User, User2 } from '@tamagui/lucide-icons'
// import { IconGearFill, IconGear, IconHouse, IconHouseFill } from '@tamagui-icons/icon-ph'
import { router, Stack, Tabs, useNavigation, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout() {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  if (__DEV__) {
    console.log('pathname', pathname)
  }
  return (
    <>
      {/* <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
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
      />
      <Stack.Screen
        options={{
          title: 'dashboard',
          headerShown: false,
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
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          headerTintColor: accentColor.val,
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: insets.bottom + 20, // edit this with safe area insets
            height: 60,
            alignContent: 'center',
            justifyContent: 'center',
          },
          tabBarItemStyle: {
            paddingBottom: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          key="index"
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ size, color, focused }) => (
              <Home color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          key="profile"
          options={{
            headerShown: false,
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ size, color, focused }) => (
              <User2 color={focused ? '$color12' : '$color10'} size={size} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard/index"
          key="dashboard"
          options={{
            title: 'Dashboard',
            headerShown: true,
            tabBarIcon: ({ size, color, focused }) => (
              <LayoutDashboard
                color={focused ? '$color12' : '$color10'}
                size={size}
                strokeWidth={2}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
