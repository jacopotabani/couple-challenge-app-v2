import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import * as SecureStore from 'expo-secure-store'

export const authClient = createAuthClient({
  baseURL: 'http://192.168.178.146:3000',
  plugins: [
    expoClient({
      scheme: 'couple-challenge',
      storagePrefix: 'couple-challenge',
      storage: SecureStore,
    }),
  ],
})
