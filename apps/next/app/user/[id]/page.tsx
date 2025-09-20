'use client'

import { UserDetailScreen } from '@my/app/features/user/detail-screen'
import { useParams } from 'solito/navigation'

export default function Page() {
  const { id } = useParams()
  return (
    <>
      <UserDetailScreen id={id as string} />
      <p>This is app router</p>
    </>
  )
}
