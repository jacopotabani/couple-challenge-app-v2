import { Button } from '@my/ui'

import { IconApple } from './IconApple'

export function AppleSignIn({ onAppleSignIn }: { onAppleSignIn?: () => void }) {
  // const supabase = useSupabase()
  // const handleOAuthSignIn = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'apple',
  //     options: {
  //       // your options
  //     },
  //   })
  //   if (error) {
  //     // handle error
  //     return
  //   }
  //   router.replace('/')
  // }

  return (
    <Button
      variant="outlined"
      color="$black1"
      br="$10"
      onPress={() => console.log('Apple Sign In')}
      icon={IconApple}
    >
      Sign in with Apple
    </Button>
  )
}
