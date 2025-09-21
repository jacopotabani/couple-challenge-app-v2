import { PrivateLayout } from '@my/app/features/private/layout.web'
// import { authClient } from 'lib/auth-client'

export default function PrivateLayoutWrapper({ children }: { children: React.ReactNode }) {
  // const [session, activeSessions] = await Promise.all([
  //   auth.api.getSession({
  //     headers: await headers(),
  //   }),
  //   auth.api.listSessions({
  //     headers: await headers(),
  //   }),
  // ]).catch((e) => {
  //   console.log(e)
  //   throw redirect('/auth/sign-in')
  // })

  // console.log('SESSION', session)
  // console.log('ACTIVE SESSIONS', activeSessions)

  return <PrivateLayout>{children}</PrivateLayout>
}
