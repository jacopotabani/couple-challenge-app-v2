'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authClient } from 'lib/auth-client'
import { SignInScreen } from '@my/app/features/auth/SignInScreen'

export default function SignIn() {
  const [firstName, setFirstName] = useState('')

  const [lastName, setLastName] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [image, setImage] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setImage(file)

      const reader = new FileReader()

      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  const googleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: 'google',
      })
    } catch (error) {
      console.error('Error during Google sign-in:', error)
    }
  }
  return <SignInScreen />
}
