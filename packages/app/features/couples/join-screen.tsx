'use client'
import {
  Button,
  H3,
  H4,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { Heart, Users, UserPlus } from '@tamagui/lucide-icons'
import { authClient } from '@my/auth/client/auth-client'
import { useState } from 'react'
import { useRouter } from 'solito/navigation'

export function JoinCoupleScreen() {
  const { data: session, isPending: userLoading } = authClient.useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [coupleCode, setCoupleCode] = useState('')
  const [foundCouple, setFoundCouple] = useState<{
    id: string
    name: string
    created_at: string
    couple_code: string
  } | null>(null)
  const toast = useToastController()
  const router = useRouter()

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <View f={1} ai="center" jc="center">
        <Text>Loading...</Text>
      </View>
    )
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return (
      <View f={1} ai="center" jc="center" p="$4">
        <Text>Please sign in to join a couple.</Text>
      </View>
    )
  }

  const handleSearchCouple = async () => {
    if (!coupleCode.trim()) {
      toast.show('Please enter a couple code.')
      return
    }

    if (!session?.user) {
      toast.show('Please sign in to search for couples.')
      return
    }

    setIsLoading(true)

    try {
      // Search for couple by code using our MongoDB API
      const response = await fetch(`/api/couples/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couple_code: coupleCode.trim().toUpperCase() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.show(errorData.error || 'Couple not found. Please check the code and try again.')
        setFoundCouple(null)
        return
      }

      const { couple } = await response.json()

      // Check if user is already a member
      const userAlreadyMember = couple.members?.some(
        (member: any) => member.user_ref === session.user.id
      )

      if (userAlreadyMember) {
        toast.show('You are already a member of this couple.')
        // router.push('/couples')
        return
      }

      setFoundCouple({
        id: couple.id,
        name: couple.name,
        created_at: couple.created_at,
        couple_code: couple.couple_code,
      })
      toast.show('Couple found! Click Join to become a member.')
    } catch (error) {
      console.error('Error searching couple:', error)
      toast.show('Failed to search for couple. Please try again.')
      setFoundCouple(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinCouple = async () => {
    if (!session?.user || !foundCouple) return

    setIsLoading(true)

    try {
      // Join the couple using our MongoDB API
      const response = await fetch('/api/couples/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couple_code: foundCouple.couple_code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.show(errorData.error || 'Failed to join couple. Please try again.')
        return
      }

      const { couple } = await response.json()
      toast.show(`Successfully joined ${couple.name}!`)
      router.push('/couples')
    } catch (error) {
      console.error('Error joining couple:', error)
      toast.show('Failed to join couple. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView f={1}>
      <YStack gap="$6" p="$4" pb="$10">
        {/* Header */}
        <YStack gap="$3" ai="center">
          <View w="$8" h="$8" br="$10" bg="$blue4" ai="center" jc="center" mb="$2">
            <UserPlus size="$2" color="$blue11" />
          </View>
          <H3 ta="center">Join a Couple</H3>
          <Text theme="alt1" ta="center" maw={400}>
            Enter the couple code shared by your partner to join their couple.
          </Text>
        </YStack>

        {/* Form */}
        <YStack gap="$6" maw={500} als="center" w="100%">
          <YStack gap="$4">
            <YStack gap="$2">
              <Text fow="500">Couple Code</Text>
              <XStack gap="$3">
                <Input
                  placeholder="e.g., R3VF8D"
                  value={coupleCode}
                  onChangeText={(text) => setCoupleCode(text.toUpperCase())}
                  size="$4"
                  borderRadius="$3"
                  f={1}
                  maxLength={6}
                  autoCapitalize="characters"
                />
                <Button
                  size="$4"
                  onPress={handleSearchCouple}
                  disabled={isLoading || !coupleCode.trim()}
                  theme="blue"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </XStack>
              <Text theme="alt2" fontSize="$2">
                The 6-character code provided by your partner
              </Text>
            </YStack>

            {/* Found Couple Display */}
            {foundCouple && (
              <View p="$4" bg="$green2" br="$4" gap="$3" borderWidth={1} borderColor="$green6">
                <XStack ai="center" gap="$3">
                  <Heart size="$1.5" color="$green11" />
                  <YStack f={1}>
                    <H4 color="$green11">{foundCouple.name}</H4>
                    <Text theme="alt1" fontSize="$3">
                      Created{' '}
                      {foundCouple.created_at
                        ? new Date(foundCouple.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </Text>
                  </YStack>
                </XStack>
                <Button
                  size="$4"
                  theme="green"
                  onPress={handleJoinCouple}
                  disabled={isLoading}
                  icon={Heart}
                >
                  {isLoading ? 'Joining...' : 'Join This Couple'}
                </Button>
              </View>
            )}

            {/* Info Section */}
            <View p="$4" bg="$blue2" br="$4" gap="$3">
              <XStack ai="center" gap="$3">
                <Users size="$1" color="$blue11" />
                <H4 color="$blue11">How it works</H4>
              </XStack>
              <YStack gap="$2">
                <Text fontSize="$3">• Ask your partner for their couple code</Text>
                <Text fontSize="$3">• Enter the code to find their couple</Text>
                <Text fontSize="$3">• Join and start taking challenges together</Text>
              </YStack>
            </View>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
