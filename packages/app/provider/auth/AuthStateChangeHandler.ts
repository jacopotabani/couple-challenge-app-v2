import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { authClient } from '@my/auth/web/auth-client'

const useRedirectAfterSignOut = () => {
  const { data } = authClient.useSession()
  console.log('AuthStateChangeHandler - user data:', data)
  // const supabase = useSupabase()
  const router = useRouter()
  useEffect(() => {
    if (!data) {
      router.replace('/auth/sign-in')
    }
  }, [data, router])
}

export const AuthStateChangeHandler = () => {
  useRedirectAfterSignOut()
  return null
}
