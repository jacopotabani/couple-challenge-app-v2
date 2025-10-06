'use client'
import { CouplesScreen } from '@my/app/features/couples/couples-screen'
import { Button } from '@my/ui'
import { Menu } from '@tamagui/lucide-icons'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Couples = async () => {
  // const { accentColor } = useTheme()
  // const navigation = useNavigation()
  // const pathname = usePathname()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Couples',
          headerShown: true,
          headerLeft: () => (
            <Button
              borderStyle="unset"
              borderWidth={0}
              backgroundColor="transparent"
              marginLeft="$-1"
              paddingHorizontal="$4"
              // onPress={() => {
              //   navigation.dispatch(DrawerActions.openDrawer())
              // }}
            >
              <Menu size={24} />
            </Button>
          ),
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <CouplesScreen />
      </SafeAreaView>
    </>
  )
}

export default Couples
