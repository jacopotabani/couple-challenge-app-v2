import { PrivateLayout } from '@my/app/features/private/layout.web'
import { auth } from 'lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
// import { authClient } from 'lib/auth-client'

export default async function PrivateLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [session, activeSessions] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.listSessions({
      headers: await headers(),
    }),
  ]).catch((e) => {
    console.log(e)
    throw redirect('/auth/sign-in')
  })

  console.log('SESSION', session)
  console.log('ACTIVE SESSIONS', activeSessions)

  return <PrivateLayout>{children}</PrivateLayout>
}
