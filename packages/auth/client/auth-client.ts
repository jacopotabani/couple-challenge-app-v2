import { expoClient } from '@better-auth/expo/client'
import { createAuthClient } from '@my/auth/better-auth-client'
import * as SecureStore from 'expo-secure-store'

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [
    expoClient({
      scheme: 'couple-challenge',
      storagePrefix: 'couple-challenge',
      storage: SecureStore,
    }),
  ],
})
