'use client'
import {
  Button,
  H3,
  H4,
  Spinner,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
  Card,
  useToastController,
} from '@my/ui'
import { Plus, Users, UserPlus } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { useLink } from 'solito/navigation'
import { authClient } from '@my/auth/client/auth-client'
import { CoupleApiResponse, CoupleDocument } from '@my/api/couples/types'
import { Link } from 'solito/link'
// interface CoupleData {
//   id: string
//   name: string
//   couple_code: string
//   created_at: string
//   updated_at: string
//   member_count: number
//   members: Array<{
//     user_ref: string
//     joined_at: string
//     role?: string
//   }>
// }

async function fetchUserCouples(): Promise<CoupleDocument[]> {
  const response = await fetch('/api/couples/user', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch couples')
  }

  return response.json()
}

export function CouplesScreen({ items }: { items?: CoupleDocument[] }) {
  const [couples, setCouples] = useState<CoupleDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const { data: session, isPending: userLoading } = authClient.useSession()
  const toast = useToastController()

  const createCoupleLink = useLink({ href: '/private/couples/create' })
  const joinCoupleLink = useLink({ href: '/private/couples/join' })
  const coupleDetailsLink = useLink({ href: '/private/couples/[id]' })

  // Fetch couples when component mounts
  useEffect(() => {
    if (session?.user && !userLoading) {
      fetchUserCouples()
        .then((data) => {
          setCouples(data)
          setIsError(false)
        })
        .catch((error) => {
          console.error('Error fetching couples:', error)
          setIsError(true)
          toast.show('Error loading couples.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (!userLoading && !session?.user) {
      setIsLoading(false)
    }
  }, [session?.user, userLoading, toast])

  if (userLoading || isLoading) {
    return (
      <View flex={1} ai="center" jc="center">
        <Spinner size="large" />
      </View>
    )
  }

  if (!session?.user) return null

  return (
    <ScrollView flex={1}>
      <YStack gap="$6" p="$4" pb="$10">
        <XStack ai="center" jc="space-between" $sm={{ fd: 'column', ai: 'stretch', gap: '$4' }}>
          <YStack gap="$2">
            <H3>My Couples</H3>
            <Text theme="alt1" fontSize="$4">
              Manage your couple relationships
            </Text>
          </YStack>
          <XStack gap="$3" $sm={{ jc: 'center' }}>
            <Button variant="outlined" icon={UserPlus} {...joinCoupleLink} f={1} $sm={{ maw: 150 }}>
              Join Couple
            </Button>
            <Button icon={Plus} {...createCoupleLink} f={1} $sm={{ maw: 150 }}>
              Create Couple
            </Button>
          </XStack>
        </XStack>

        {items?.length ? (
          <YStack gap="$4">
            <XStack ai="center" jc="space-between">
              <H4 theme="alt1" fow="400">
                {items.length} Couple{items.length !== 1 ? 's' : ''}
              </H4>
              <Button size="$3" variant="outlined" icon={UserPlus} {...joinCoupleLink}>
                Join Another
              </Button>
            </XStack>
            <XStack fw="wrap" gap="$4">
              {items.map((coupleData, index) => (
                <Card
                  key={`${coupleData?._id}-${index}`}
                  f={1}
                  miw={300}
                  $gtMd={{ miw: 350, maw: 400 }}
                  p="$4"
                  gap="$3"
                  pressStyle={{ scale: 0.975 }}
                  hoverStyle={{ borderColor: '$borderColorHover' }}
                >
                  <YStack gap="$2">
                    <H4>{coupleData?.name}</H4>
                    {/* <Text theme="alt1" fontSize="$3">
                      {coupleData?.member_count || 0} member
                      {coupleData?.member_count !== 1 ? 's' : ''}
                    </Text> */}
                    <Text theme="alt2" fontSize="$2">
                      Created: {new Date(coupleData?.created_at).toLocaleDateString()}
                    </Text>
                    <Text theme="alt2" fontSize="$2">
                      Code: {coupleData?.couple_code}
                    </Text>
                    <Text theme="alt2" fontSize="$2">
                      ID: {coupleData?._id}
                    </Text>
                  </YStack>
                  <Link href={`/private/couples/${coupleData._id}`}>View Details</Link>
                  {/* <Button
                    size="$3"
                    theme="blue"
                    {...useLink({ href: `/private/couples/${coupleData._id}` })}
                    mt="$2"
                  >
                    View Details
                  </Button> */}
                </Card>
              ))}
            </XStack>
          </YStack>
        ) : (
          <View
            height={400}
            ai="center"
            jc="center"
            backgroundColor="$gray1"
            borderRadius="$5"
            gap="$4"
          >
            <Users size="$4" color="$color9" />
            <YStack ai="center" gap="$2">
              <H4>No couples yet</H4>
              <Text theme="alt1" ta="center">
                Create your first couple or join an existing one to start taking on challenges
                together.
              </Text>
            </YStack>
            <XStack gap="$3" $sm={{ fd: 'column', ai: 'stretch', w: '100%', maw: 300 }}>
              <Button size="$4" variant="outlined" icon={UserPlus} {...joinCoupleLink} f={1}>
                Join Couple
              </Button>
              <Button size="$4" icon={Plus} theme="blue" {...createCoupleLink} f={1}>
                Create Couple
              </Button>
            </XStack>
          </View>
        )}
      </YStack>
    </ScrollView>
  )
}
