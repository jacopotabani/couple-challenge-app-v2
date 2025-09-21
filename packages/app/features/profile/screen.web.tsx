import { Avatar, Paragraph, XStack, YStack, getTokens } from '@my/ui'
import {
  Box,
  Cog,
  Milestone,
  MoreHorizontal,
  ShoppingCart,
  User,
  Users,
} from '@tamagui/lucide-icons'
import { SolitoImage } from 'solito/image'
import { useLink } from 'solito/link'
import { authClient } from '@my/auth/web/auth-client'
import { Settings } from '@my/ui/src/components/Settings'

export function ProfileScreen(props) {
  const { data } = authClient.useSession()
  const name = data?.user?.name

  return (
    <YStack maw={600} mx="auto" w="100%" f={1} mih="100%" py="$4" pb="$2">
      <Settings>
        <Settings.Items>
          <Settings.Group>
            <Settings.Item icon={User} {...useLink({ href: '/profile/edit' })} accentTheme="pink">
              Edit profile
            </Settings.Item>
            <Settings.Item icon={Box} accentTheme="green">
              My Items
            </Settings.Item>
            <Settings.Item icon={Users} accentTheme="orange">
              Refer Your Friends
            </Settings.Item>
            <Settings.Item icon={Milestone} accentTheme="gray">
              Address Info
            </Settings.Item>
            <Settings.Item icon={ShoppingCart} accentTheme="blue">
              Purchase History
            </Settings.Item>
            <Settings.Item {...useLink({ href: '/settings' })} icon={Cog}>
              Settings
            </Settings.Item>
          </Settings.Group>
        </Settings.Items>
      </Settings>

      <XStack gap="$4" mb="$7" mt="auto" ai="center" px="$4">
        <Avatar circular size="$3">
          {/* @ts-ignore */}
          <SolitoImage
            src={data?.user?.image as unknown as string}
            alt="your avatar"
            width={getTokens().size['3'].val}
            height={getTokens().size['3'].val}
          />
        </Avatar>
        <Paragraph ta="center" ml="$-1.5">
          {name ?? 'No Name'}
        </Paragraph>
        <MoreHorizontal marginLeft="auto" size={24} color="$gray9" />
      </XStack>
    </YStack>
  )
}
