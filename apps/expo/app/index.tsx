'use client'

import { SignInScreen } from '@my/app/features/auth/SignInScreen'
import { authClient } from '@my/auth/client/auth-client'
import { Text, View } from '@my/ui'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function Index() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending) {
      if (data?.session) {
        // User is authenticated, go to private area
        router.replace('/private/dashboard')
      } else {
        // User is not authenticated, go to auth
        router.replace('/auth/sign-in')
        // router.replace('/private/dashboard')
      }
    }
  }, [data, isPending, router])

  if (isPending) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </View>
    )
  }
  return null
}
