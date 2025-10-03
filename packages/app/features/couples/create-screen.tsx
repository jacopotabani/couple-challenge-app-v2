'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@my/auth/client/auth-client'
import {
  AnimatePresence,
  Button,
  H3,
  H4,
  ScrollView,
  Spinner,
  Text,
  Theme,
  View,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { Heart, Info, Users } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../auth/inputs/components/inputsParts'
import ScrollToTopTabBarContainer from '../../utils/NativeScreenContainer'
import { useRouter } from 'solito/navigation'

const CoupleSchema = z.object({
  name: z.string().min(1, { message: 'Couple name is required' }),
})

export function CreateCoupleScreen() {
  const { data: session } = authClient.useSession()

  if (!session?.user) {
    return (
      <ScrollView f={1}>
        <ScrollToTopTabBarContainer>
          <YStack gap="$6" p="$4" pb="$10" ai="center">
            <Text>You must be logged in to create a couple.</Text>
          </YStack>
        </ScrollToTopTabBarContainer>
      </ScrollView>
    )
  }

  return <CreateCoupleForm userId={session?.user.id} />
}

const CreateCoupleForm = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false)
  const toast = useToastController()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CoupleSchema),
    defaultValues: {
      name: '',
    },
  })

  const generateCoupleCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const onSubmit = async (data: z.infer<typeof CoupleSchema>) => {
    setLoading(true)
    console.log('data', data)
    try {
      // Placeholder promise - simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            name: data.name.trim(),
            couple_code: generateCoupleCode(),
          })
        }, 2000)
      })

      toast.show('Couple created successfully!')
      // In real implementation, this would be the actual couple ID
      router.push('/couples/placeholder-id')
    } catch (error) {
      console.error('Error creating couple:', error)
      toast.show('Failed to create couple. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView f={1}>
      <ScrollToTopTabBarContainer>
        <YStack gap="$6" p="$4" pb="$10">
          {/* Header */}
          <YStack gap="$3" ai="center">
            <View w="$8" h="$8" br="$10" bg="$pink4" ai="center" jc="center" mb="$2">
              <Heart size="$2" color="$pink11" />
            </View>
            <H3 ta="center">Create a New Couple</H3>
            <Text theme="alt1" ta="center" maw={400}>
              Start your relationship journey together. Create a couple and invite your partner to
              join.
            </Text>
          </YStack>

          {/* Form */}
          <YStack gap="$5">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  {...(errors.name && {
                    theme: 'red',
                  })}
                  onBlur={onBlur}
                  size="$4"
                >
                  <Input.Label>Couple Name</Input.Label>
                  <Input.Box>
                    <Input.Area
                      placeholder="e.g., John & Sarah"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input.Box>
                  <AnimatePresence>
                    {errors.name && (
                      <View
                        bottom="$-5"
                        left={0}
                        position="absolute"
                        gap="$2"
                        flexDirection="row"
                        animation="bouncy"
                        scaleY={1}
                        enterStyle={{
                          opacity: 0,
                          y: -10,
                          scaleY: 0.5,
                        }}
                        exitStyle={{
                          opacity: 0,
                          y: -10,
                          scaleY: 0.5,
                        }}
                      >
                        <Input.Icon padding={0}>
                          <Info />
                        </Input.Icon>
                        <Input.Info>{errors.name.message}</Input.Info>
                      </View>
                    )}
                  </AnimatePresence>
                </Input>
              )}
            />

            <Text theme="alt2" fontSize="$2" ta="center">
              Choose a name that represents both of you
            </Text>

            {/* Info Section */}
            <View p="$4" bg="$blue2" br="$4" gap="$3">
              <XStack ai="center" gap="$3">
                <Users size="$1" color="$blue11" />
                <H4 color="$blue11">How it works</H4>
              </XStack>
              <YStack gap="$2">
                <Text fontSize="$3">• You&apos;ll be automatically added as the first member</Text>
                <Text fontSize="$3">• A unique couple code will be generated for invitations</Text>
                <Text fontSize="$3">• Share the code with your partner to join</Text>
              </YStack>
            </View>

            <Theme inverse>
              <Button
                onPress={handleSubmit(onSubmit)}
                icon={Heart}
                disabled={loading}
                cursor={loading ? 'progress' : 'pointer'}
                iconAfter={
                  <AnimatePresence>
                    {loading && (
                      <Spinner
                        size="small"
                        color="$color"
                        key="loading-spinner"
                        opacity={1}
                        position="absolute"
                        scale={0.5}
                        left={110}
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
                {loading ? 'Creating...' : 'Create Couple'}
              </Button>
            </Theme>
          </YStack>
        </YStack>
      </ScrollToTopTabBarContainer>
    </ScrollView>
  )
}
