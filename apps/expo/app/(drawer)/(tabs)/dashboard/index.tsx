'use client'
import { DashboardScreen } from '@my/app/features/dashboard/screen'
import { Button, useTheme } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Menu } from '@tamagui/lucide-icons'
import { Stack, useNavigation, usePathname } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  const pathname = usePathname()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerShown: true,
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
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <DashboardScreen />
      </SafeAreaView>
    </>
  )
}

export default Dashboard
