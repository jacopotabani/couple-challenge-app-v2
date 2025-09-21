import { Button } from '@my/ui'
// import { HomeScreen } from '@my/app/features/home/screen'
import { Stack } from 'expo-router'
import { HomeScreen } from '@my/app/features/home/screen'
// import { authClient } from '../lib/auth/auth-client'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      {/* <HomeScreen /> */}
    </>
  )
}
