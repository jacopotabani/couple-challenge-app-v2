'use client'

import { useState } from 'react'
import Image from 'next/image'
import { authClient } from '../../lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignUp() {
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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="first-name">First name</label>

            <input
              id="first-name"
              placeholder="Max"
              required
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
              value={firstName}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="last-name">Last name</label>

            <input
              id="last-name"
              placeholder="Robinson"
              required
              onChange={(e) => {
                setLastName(e.target.value)
              }}
              value={lastName}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            value={email}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Password"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password">Confirm Password</label>

          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
            placeholder="Confirm Password"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="image">Profile Image (optional)</label>

          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                <Image src={imagePreview} alt="Profile preview" layout="fill" objectFit="cover" />
              </div>
            )}

            <div className="flex items-center gap-2 w-full">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              {imagePreview && (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null)

                    setImagePreview(null)
                  }}
                >
                  remove
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full"
          disabled={loading}
          onClick={async () => {
            await authClient.signUp.email({
              email,

              password,

              name: `${firstName} ${lastName}`,

              image: image ? await convertImageToBase64(image) : '',

              callbackURL: '/dashboard',

              fetchOptions: {
                onResponse: () => {
                  setLoading(false)
                },

                onRequest: () => {
                  setLoading(true)
                },

                onError: (ctx) => {
                  console.error(ctx.error.message)
                },

                onSuccess: async () => {
                  router.push('/dashboard')
                },
              },
            })
          }}
        >
          {loading ? 'loading' : 'Create an account'}
        </button>
      </div>
    </div>
  )
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(reader.result as string)

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}
