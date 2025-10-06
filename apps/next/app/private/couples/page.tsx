import { getCouplesForUser } from '@my/api/couples/actions'
import { CouplesScreen } from '@my/app/features/couples/couples-screen'
import { authClient } from '@my/auth/client/auth-client'
import { auth } from 'lib/auth'
import { headers } from 'next/headers'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const items = await getCouplesForUser(session.user?.id)
  console.log('items', items)
  return <CouplesScreen items={items} />
}
