import { HomeScreen } from '@my/app/features/home/screen'
import { Button, useTheme } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Stack, useNavigation, usePathname } from 'expo-router'
import { Home, LayoutDashboard, Menu, Plus, User, User2 } from '@tamagui/lucide-icons'

export default function Screen() {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  const pathname = usePathname()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
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
          // headerRight: () => (
          //   <Button
          //     borderStyle="unset"
          //     borderWidth={0}
          //     marginRight="$-1"
          //     backgroundColor="transparent"
          //     onPress={() => {
          //       router.navigate('create')
          //     }}
          //   >
          //     <Plus size={24} />
          //   </Button>
          // ),
        }}
      />
      <HomeScreen />
    </>
  )
}
