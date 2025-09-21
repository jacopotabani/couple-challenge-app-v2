import { Button } from '@my/ui'
// import { useSupabase } from 'app/utils/supabase/useSupabase'

import { IconGoogle } from './IconGoogle'
import { authClient } from '@my/auth/client/auth-client'
// import { authClient } from '@my/auth/web/auth-client'

export function GoogleSignIn({ onGoogleSignIn }: { onGoogleSignIn?: () => void }) {
  // const supabase = useSupabase()
  // const handleOAuthSignIn = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       // your options
  //       redirectTo: process.env.NEXT_PUBLIC_URL,
  //     },
  //   })
  //   if (error) {
  //     // handle error
  //   }
  //   router.replace('/')
  // }

  const googleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/private/dashboard',
      })
      console.log('data 123', data)
    } catch (error) {
      console.error('Error during Google sign-in:', error)
    }
  }
  return (
    <Button variant="outlined" color="$black1" br="$10" onPress={googleSignIn} icon={IconGoogle}>
      Sign in with Google
    </Button>
  )
}
