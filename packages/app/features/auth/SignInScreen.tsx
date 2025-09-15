import { Facebook, Github } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import {
  Anchor,
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Separator,
  Spinner,
  Text,
  Theme,
  View,
} from 'tamagui'
import { Input } from './inputs/components/inputsParts'
import { useLink } from 'solito/navigation'
import { Link } from '@my/ui/src/components'
import { SocialLogin } from './components/SocialLogin'

/** simulate signin */
function useSignIn() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  return {
    status: status,
    signIn: () => {
      setStatus('loading')
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    },
  }
}

export function SignInScreen() {
  const uniqueId = useId()
  const { signIn, status } = useSignIn()

  return (
    <View
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch"
      flexBasis={0}
      flexGrow={1}
      flexShrink={1}
      gap="$6"
      marginHorizontal="auto"
      $gtXs={{
        paddingHorizontal: '$12',
        maxWidth: 600,
        paddingVertical: '$8',
      }}
    >
      <H1
        alignSelf="center"
        size="$8"
        $xs={{
          size: '$7',
        }}
      >
        Sign in to your account
      </H1>
      <View flexDirection="column" gap="$3" minWidth="100%">
        <View flexDirection="column" gap="$1">
          <Input size="$4" minWidth="100%">
            <Input.Label htmlFor={uniqueId + 'email'}>Email</Input.Label>
            <Input.Box>
              <Input.Area id={uniqueId + 'email'} placeholder="email@example.com" />
            </Input.Box>
          </Input>
        </View>
        <View flexDirection="column" gap="$1">
          <Input size="$4">
            <View flexDirection="row" alignItems="center" justifyContent="space-between">
              <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
            </View>
            <Input.Box>
              <Input.Area
                textContentType="password"
                secureTextEntry
                id={uniqueId + 'password'}
                placeholder="Enter password"
              />
            </Input.Box>
            <ForgotPasswordLink />
          </Input>
        </View>
        <Theme inverse>
          <Button
            disabled={status === 'loading'}
            onPress={signIn}
            width="100%"
            mb={0}
            iconAfter={
              <AnimatePresence>
                {status === 'loading' && (
                  <Spinner
                    color="$color"
                    key="loading-spinner"
                    opacity={1}
                    scale={1}
                    position="absolute"
                    left="70%"
                    // $gtXs={{
                    //   left: '60%',
                    // }}
                    animation="quick"
                    enterStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            Continue
          </Button>
          <SocialLogin />
        </Theme>
      </View>
      <SignUpLink />
    </View>
  )
}

const SignUpLink = () => {
  const signUplinkProps = useLink({
    href: '/auth/sign-up',
  })
  return (
    <Link alignSelf="center" {...signUplinkProps}>
      <Paragraph textAlign="center">
        Don&apos;t have an account?{' '}
        <Text
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </Text>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  const forgotPasswordLinkProps = useLink({
    href: '/auth/forgot-password',
  })
  return (
    <Link alignSelf="flex-end" {...forgotPasswordLinkProps}>
      <Paragraph
        color="$black10"
        hoverStyle={{
          color: '$green2',
        }}
        size="$1"
        marginTop="$1"
      >
        Forgot your password?
      </Paragraph>
    </Link>
  )
}
