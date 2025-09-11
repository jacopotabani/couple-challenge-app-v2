import { XStack, YStack } from '@my/ui'

import { OnboardingScreen } from './onboarding-screen'

export type AuthLayoutProps = {
  children?: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <XStack flex={1}>
      <YStack flex={2} flexBasis={0} justifyContent="center">
        <YStack paddingHorizontal="$4">{children}</YStack>
      </YStack>

      <YStack $md={{ display: 'none' }} flex={3} flexBasis={0}>
        <OnboardingScreen />
      </YStack>
    </XStack>
  )
}
