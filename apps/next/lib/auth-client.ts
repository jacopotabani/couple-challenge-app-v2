import { createAuthClient } from '@my/auth/better-auth-client'

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: 'http://192.168.1.169:3000',
})
