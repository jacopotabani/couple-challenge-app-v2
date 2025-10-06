import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  SwitchRouterButton,
  SwitchThemeButton,
  useToastController,
  XStack,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { use, useState } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
// import { authClient } from '../lib/auth/auth-client'

export function DashboardScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkProps = useLink({
    href: `/private/dashboard`,
  })
  const signUplinkTarget = '/auth/sign-up'
  const signUplinkProps = useLink({
    href: `${signUplinkTarget}/`,
  })

  const privateHomeScreen = useLink({
    href: `/private/`,
  })
  const coupleScreen = useLink({
    href: `/private/couples`,
  })

  return (
    <YStack flex={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      {/* <XStack
        position="absolute"
        width="100%"
        t="$6"
        gap="$6"
        jc="center"
        flexWrap="wrap"
        $sm={{ position: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && (
          <>
            <SwitchRouterButton pagesMode={pagesMode} />
            <SwitchThemeButton />
          </>
        )}
      </XStack> */}

      <YStack gap="$4">
        <H1 ta="center" color="$color12">
          Dashboard
        </H1>
      </YStack>

      {/* <Button onPress={handleGoogleLogin}>Google logi</Button> */}
      <Button {...privateHomeScreen}>Link to Private home screen</Button>
      <Button {...coupleScreen}>Link to couples screen</Button>
      {/* <Button {...signUplinkProps}>Link to sign-up</Button> */}

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$green1"
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph ta="center">Made by</Paragraph>
            <Anchor color="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
