'use client'
import {
  Avatar,
  Button,
  H3,
  H4,
  H5,
  Spinner,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
  Card,
  useToastController,
} from '@my/ui'
import { Calendar, Heart, Settings, Users, Copy, Share, UserPlus } from '@tamagui/lucide-icons'
import { authClient } from '@my/auth/client/auth-client'
import { useEffect, useState } from 'react'
import { useLink } from 'solito/navigation'

type CoupleDetailScreenProps = {
  coupleId: string
}

export function CoupleDetailScreen({ coupleId }: CoupleDetailScreenProps) {
  const { data: session, isPending: userLoading } = authClient.useSession()
  const [coupleData, setCoupleData] = useState<any>(null)
  const [coupleMembers, setCoupleMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const toast = useToastController()
  const [showInviteCode, setShowInviteCode] = useState(false)

  const challengesLink = useLink({ href: '/challenges' })
  const settingsLink = useLink({ href: `/couples/${coupleId}/settings` })

  // Fetch couple details using our new MongoDB API
  useEffect(() => {
    const fetchCoupleDetails = async () => {
      if (!session?.user || userLoading) return

      setIsLoading(true)
      setIsError(false)

      try {
        // Fetch user's couples to find the specific one
        const couplesResponse = await fetch('/api/couples/user')
        if (!couplesResponse.ok) {
          throw new Error('Failed to fetch couples')
        }

        const couples = await couplesResponse.json()
        const foundCouple = couples?.find((c: any) => c.id === coupleId)

        if (!foundCouple) {
          setIsError(true)
          toast.show('Couple not found')
          return
        }

        setCoupleData(foundCouple)

        // For now, extract members from the couple data
        // TODO: Implement proper member population in the API
        setCoupleMembers(foundCouple.members || [])
      } catch (error) {
        console.error('Error fetching couple details:', error)
        setIsError(true)
        toast.show('Error loading couple details.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoupleDetails()
  }, [session?.user, userLoading, coupleId, toast])
  if (userLoading || isLoading) {
    return (
      <View flex={1} ai="center" jc="center">
        <Spinner size="large" />
      </View>
    )
  }

  if (!session?.user || !coupleData) {
    return (
      <View flex={1} ai="center" jc="center" gap="$4">
        <Text>{!session?.user ? 'Please sign in' : 'Couple not found'}</Text>
        <Button href="/couples">Back to Couples</Button>
      </View>
    )
  }

  // const activeChallenges = coupleChallenges?.filter((cc) => cc.status === 'in_progress') || []
  // const completedChallenges = coupleChallenges?.filter((cc) => cc.status === 'completed') || []

  const couple = coupleData

  const copyInviteCode = async () => {
    if (!couple?.couple_code) return

    try {
      await navigator.clipboard.writeText(couple.couple_code)
      toast.show('Couple code copied to clipboard!')
    } catch {
      // Fallback for browsers that don't support clipboard API
      toast.show(`Couple code: ${couple.couple_code}`)
    }
  }

  const shareInvite = async () => {
    if (!couple?.couple_code) return

    const shareText = `Join my couple "${couple.name}" on our relationship challenge app! Use code: ${couple.couple_code}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Couple',
          text: shareText,
          url: window.location.origin + '/couples/join',
        })
      } catch {
        // User cancelled or sharing failed
        copyInviteCode()
      }
    } else {
      copyInviteCode()
    }
  }

  return (
    <ScrollView f={1}>
      <YStack gap="$6" p="$4" pb="$10">
        {/* Couple Header */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$4">
            <View w="$6" h="$6" br="$10" bg="$pink4" ai="center" jc="center">
              <Heart size="$2" color="$pink11" />
            </View>
            <YStack gap="$1">
              <H3>{coupleData?.name || 'My Couple'}</H3>
              <XStack ai="center" gap="$2">
                <Calendar size="$0.75" color="$color10" />
                <Text theme="alt1" fontSize="$3">
                  Created {new Date(coupleData.created_at).toLocaleDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
          <Button icon={Settings} {...settingsLink} size="$3" chromeless>
            Settings
          </Button>
        </XStack>

        {/* Invitation Section */}
        {couple?.couple_code && (
          <YStack gap="$4">
            <XStack ai="center" jc="space-between">
              <H4 theme="alt1" fow="400">
                Invite Partner
              </H4>
              <Button
                size="$3"
                chromeless
                onPress={() => setShowInviteCode(!showInviteCode)}
                icon={showInviteCode ? Heart : UserPlus}
              >
                {showInviteCode ? 'Hide Code' : 'Show Code'}
              </Button>
            </XStack>

            {showInviteCode && (
              <View p="$4" bg="$pink2" br="$4" gap="$4" borderWidth={1} borderColor="$pink6">
                <YStack gap="$2">
                  <Text fow="500" color="$pink11">
                    Share this code with your partner:
                  </Text>
                  <XStack ai="center" gap="$3">
                    <View p="$3" bg="$pink1" br="$3" f={1}>
                      <Text fontSize="$6" fow="600" ta="center" color="$pink11" ls={2}>
                        {couple.couple_code}
                      </Text>
                    </View>
                    <Button size="$3" icon={Copy} onPress={copyInviteCode} theme="pink">
                      Copy
                    </Button>
                  </XStack>
                </YStack>

                <XStack gap="$3">
                  <Button f={1} icon={Share} onPress={shareInvite} theme="pink" size="$3">
                    Share Invite
                  </Button>
                  <Button f={1} href="/couples/join" size="$3" chromeless>
                    Join Instructions
                  </Button>
                </XStack>

                <Text theme="alt2" fontSize="$2" ta="center">
                  Your partner can use this code at /couples/join to join your couple
                </Text>
              </View>
            )}
          </YStack>
        )}

        {/* Members Section */}
        <YStack gap="$4">
          <H4 theme="alt1" fow="400">
            Members ({coupleMembers?.length || 0})
          </H4>
          {/* Simplified member display until CoupleMemberList is updated */}
          {coupleMembers?.map((member, index) => (
            <Card key={index} p="$3">
              <XStack ai="center" gap="$3">
                <Avatar size="$3" circular>
                  <Avatar.Fallback bg="$blue4">
                    <Users size="$1" color="$blue11" />
                  </Avatar.Fallback>
                </Avatar>
                <YStack f={1}>
                  <Text fow="500">Member {index + 1}</Text>
                  <Text theme="alt1" fontSize="$2">
                    Role: {member.role || 'member'}
                  </Text>
                  <Text theme="alt1" fontSize="$2">
                    Joined: {new Date(member.joined_at).toLocaleDateString()}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ))}

          {/* Show invitation placeholder if less than 2 members */}
          {(coupleMembers?.length || 0) < 2 && (
            <View p="$4" bg="$color2" br="$4" ai="center" gap="$3">
              <Avatar size="$3" circular>
                <Avatar.Fallback bg="$pink4">
                  <Heart size="$1" color="$pink11" />
                </Avatar.Fallback>
              </Avatar>
              <YStack ai="center" gap="$2">
                <Text fow="500">Invite Your Partner</Text>
                <Text theme="alt1" fontSize="$2" ta="center">
                  Share your couple code above to invite your partner to join
                </Text>
              </YStack>
            </View>
          )}
        </YStack>

        {/* Active Challenges */}
        {/* {activeChallenges.length > 0 && (
            <YStack gap="$4">
              <H4 theme="alt1" fow="400">
                Active Challenges ({activeChallenges.length})
              </H4>
              <XStack fw="wrap" gap="$4">
                {activeChallenges.map((coupleChallenge, index) => {
                  const challenge = allChallenges?.find(
                    (c) => c.id === coupleChallenge.challenge_id
                  )
                  return (
                    <ChallengeCard
                      key={`${coupleChallenge.id}-${index}`}
                      title={challenge?.title}
                      description={challenge?.description}
                      category={challenge?.categories?.name}
                      status={coupleChallenge.status}
                      intensity={challenge?.intensity_level}
                      estimatedTime={challenge?.estimated_time_minutes}
                      startedAt={coupleChallenge.started_at}
                      action={{
                        text: 'Continue',
                        href: `/challenges/${coupleChallenge.id}`,
                      }}
                      f={1}
                      miw={300}
                      $gtMd={{ miw: 350, maw: 400 }}
                    />
                  )
                })}
              </XStack>
            </YStack>
          )} */}

        {/* Completed Challenges */}
        {/* {completedChallenges.length > 0 && (
            <YStack gap="$4">
              <H4 theme="alt1" fow="400">
                Completed Challenges ({completedChallenges.length})
              </H4>
              <XStack fw="wrap" gap="$4">
                {completedChallenges.slice(0, 6).map((coupleChallenge, index) => {
                  const challenge = allChallenges?.find(
                    (c) => c.id === coupleChallenge.challenge_id
                  )
                  return (
                    <ChallengeCard
                      key={`${coupleChallenge.id}-${index}`}
                      title={challenge?.title}
                      description={challenge?.description}
                      category={challenge?.categories?.name}
                      status={coupleChallenge.status}
                      intensity={challenge?.intensity_level}
                      estimatedTime={challenge?.estimated_time_minutes}
                      startedAt={coupleChallenge.started_at}
                      action={{
                        text: 'View Results',
                        href: `/challenges/${coupleChallenge.id}`,
                      }}
                      f={1}
                      miw={300}
                      $gtMd={{ miw: 350, maw: 400 }}
                    />
                  )
                })}
              </XStack>
              {completedChallenges.length > 6 && (
                <Button als="center" size="$3" theme="alt2">
                  View All Completed Challenges
                </Button>
              )}
            </YStack>
          )} */}

        {/* Empty State */}
        {/* {activeChallenges.length === 0 && completedChallenges.length === 0 && (
            <View
              height={300}
              ai="center"
              jc="center"
              backgroundColor="$gray1"
              borderRadius="$5"
              gap="$4"
            >
              <Heart size="$4" color="$color9" />
              <YStack ai="center" gap="$2">
                <H5>No challenges yet</H5>
                <Text theme="alt1" ta="center">
                  Start your first challenge together to strengthen your relationship.
                </Text>
              </YStack>
              <Button size="$4" theme="blue" {...challengesLink}>
                Browse Challenges
              </Button>
            </View>
          )} */}
      </YStack>
    </ScrollView>
  )
}
