import { DrawerMenu } from 'app/features/drawer-menu'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <DrawerMenu />
    </>
  )
}
