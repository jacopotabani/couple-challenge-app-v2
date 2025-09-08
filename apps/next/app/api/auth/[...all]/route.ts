import { auth } from '../../../../lib/auth'
import { toNextJsHandler } from '@my/auth/better-auth-client'

export const { POST, GET } = toNextJsHandler(auth)
