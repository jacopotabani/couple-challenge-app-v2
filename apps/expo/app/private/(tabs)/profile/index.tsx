'use client'
import { ProfileScreen } from '@my/app/features/profile/screen'
import { Button, useTheme } from '@my/ui'
import { DrawerActions } from '@react-navigation/native'
import { Stack, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Menu } from '@tamagui/lucide-icons'

const Profile = () => {
  const { accentColor } = useTheme()
  const navigation = useNavigation()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
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
        <ProfileScreen />
      </SafeAreaView>
    </>
  )
}

export default Profile
