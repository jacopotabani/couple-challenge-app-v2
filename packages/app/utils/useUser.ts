import { createAuthClient } from '@my/auth/better-auth-client'
import { authClient } from '@my/auth/web/auth-client'

export const useUser = () => {
  const { useSession } = createAuthClient()
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession()

  return {
    session: session?.session,
    user: session?.user,
    updateProfile: () => refetch(),
    isPending,
    error,
  }
}
