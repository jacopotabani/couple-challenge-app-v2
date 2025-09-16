import { AnimatePresence, Button, H1, isWeb, Label, Paragraph, Text, Spinner, View, ScrollView } from 'tamagui'
import { useState } from 'react'
import { Eye, EyeOff, Info } from '@tamagui/lucide-icons'
import { FormCard } from './components/layoutParts'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native'
import { Input } from './inputs/components/inputsParts'
import { SocialLogin } from './components/SocialLogin'
import { useLink } from 'solito/navigation'
import { Link } from 'solito/link'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import {
  H2,
  Theme,
  YStack,
} from '@my/ui'
import { FormWrapper } from '@my/ui/src/components'

const schema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmedPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Passwords do not match',
    path: ['confirmedPassword'],
  })

export function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof schema>>()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmedPassword: '',
    },
  })
  const onSubmit = (data: z.infer<typeof schema>) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <ScrollView>

    <FormCard
      flexDirection="column"
      gap="$5"
      tag="form"
      $sm={{
        paddingHorizontal: '$4',
        paddingVertical: '$6',
      }}
    >
      <H1
        alignSelf="center"
        size="$8"
        $xs={{
          size: '$7',
        }}
      >
        Create an account
      </H1>
      <View gap="$5">
        <View
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-between"
          columnGap="$4"
          rowGap="$5"
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                {...(errors.firstName && {
                  theme: 'red',
                })}
                onBlur={onBlur}
                f={1}
                minWidth="100%"
                $gtSm={{ flexBasis: 150 }}
                animation="quick"
                size="$4"
              >
                <Input.Label>First Name</Input.Label>
                <Input.Box>
                  <Input.Area placeholder="First name" onChangeText={onChange} value={value} />
                </Input.Box>
                <AnimatePresence>
                  {errors.firstName && (
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
                      <Input.Info>{errors.firstName.message}</Input.Info>
                    </View>
                  )}
                </AnimatePresence>
              </Input>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                {...(errors.lastName && {
                  theme: 'red',
                })}
                onBlur={onBlur}
                f={1}
                minWidth="100%"
                $gtSm={{ flexBasis: 150 }}
                animation="quick"
                size="$4"
              >
                <Input.Label>Last Name</Input.Label>
                <Input.Box>
                  <Input.Area placeholder="Last name" onChangeText={onChange} value={value} />
                </Input.Box>
                <AnimatePresence>
                  {errors.lastName && (
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
                      <Input.Info>{errors.lastName.message}</Input.Info>
                    </View>
                  )}
                </AnimatePresence>
              </Input>
            )}
          />
        </View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.email && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label>Email</Input.Label>
              <Input.Box>
                <Input.Area placeholder="email@example.com" onChangeText={onChange} value={value} />
              </Input.Box>
              <AnimatePresence>
                {errors.email && (
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
                    <Input.Info>{errors.email.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.password && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label htmlFor={'password-t1'}>Password</Input.Label>
              <Input.Box>
                <Input.Area
                  id={'password-t1'}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  onChangeText={onChange}
                  value={value}
                />
                <Input.Icon cursor="pointer" onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.password && (
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
                    <Input.Info>{errors.password.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />

        <Controller
          control={control}
          name="confirmedPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              {...(errors.confirmedPassword && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <Input.Label htmlFor={'confirmed password'}>Confirm Password</Input.Label>
              <Input.Box>
                <Input.Area
                  id={'confirmed password'}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm password"
                  onChangeText={onChange}
                  value={value}
                />
                <Input.Icon
                  cursor="pointer"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye color="$gray11" /> : <EyeOff color="$gray11" />}
                </Input.Icon>
              </Input.Box>
              <AnimatePresence>
                {errors.confirmedPassword && (
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
                    <Input.Info>{errors.confirmedPassword.message}</Input.Info>
                  </View>
                )}
              </AnimatePresence>
            </Input>
          )}
        />
        <Button
          themeInverse
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          cursor={loading ? 'progress' : 'pointer'}
          alignSelf="flex-end"
          w="100%"
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
          Sign Up
        </Button>
        <SocialLogin />
      </View>
      <SignInLink />
      {!isWeb && <SafeAreaView />}
    </FormCard>
    </ScrollView>
  )
}

const SignInLink = () => {
  const signUplinkProps = useLink({
    href: '/auth/sign-in',
  })
  return (
    <Link {...signUplinkProps}>
      <Paragraph textAlign="center">
        Already have an account?{' '}
        <Text
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign in
        </Text>
      </Paragraph>
    </Link>
  )
}
