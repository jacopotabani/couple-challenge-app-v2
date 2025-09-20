'use client'

import { SignInScreen } from 'app/features/auth/SignInScreen'
import { Stack } from 'expo-router'

export default function SignIn() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'SignIn',
        }}
      />
      <SignInScreen />
    </>
  )
}
