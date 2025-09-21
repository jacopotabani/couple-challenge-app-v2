'use client'

import { GoogleSignIn } from '@my/app/features/auth/components/GoogleSignIn'
import { SignInScreen } from '@my/app/features/auth/SignInScreen'
import { Button } from '@my/ui'
import { Stack } from 'expo-router'
import { IconGoogle } from '@my/app/features/auth/components/IconGoogle'
import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { authClient } from '@my/auth/client/auth-client'

export default function SignIn() {
  const { data } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('EXPO SIGN IN SCREEN - user data:', data)
    if (data?.session) {
      return router.replace('/private/dashboard')
    }
  }, [data])
  // const googleSignIn = async () => {
  //   try {
  //     const data = await authClient.signIn.social({
  //       provider: 'google',
  //       // callbackURL: '/private/dashboard',
  //     })
  //     console.log('data 123', data)
  //   } catch (error) {
  //     console.error('Error during Google sign-in:', error)
  //   }
  // }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'SignIn',
        }}
      />
      {/* <Button variant="outlined" color="$black1" br="$10" onPress={googleSignIn} icon={IconGoogle}>
        Sign in with Google
      </Button> */}
      <SignInScreen />
    </>
  )
}
