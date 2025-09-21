import { createAuth } from '@my/auth/better-auth'

export const auth = createAuth(process.env.DATABASE_URL || '')
