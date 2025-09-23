import { auth } from 'lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
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

  if (session.session) {
    return redirect('/private')
  } else {
    return redirect('/auth/sign-in')
  }
}
