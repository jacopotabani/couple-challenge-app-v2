import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { getCouplesForUser, getCoupleByIdWithPopulatedMembers } from '@my/api/couples/actions'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const userId = session.user.id

    // Get couples where user is a member
    const couples = await getCouplesForUser(userId)

    // Transform couples data for the frontend
    const transformedCouples = couples.map((couple) => ({
      id: couple._id!.toString(),
      name: couple.name,
      couple_code: couple.couple_code,
      created_at: couple.created_at,
      updated_at: couple.updated_at,
      member_count: couple.members?.length || 0,
      members: couple.members || [],
    }))

    return NextResponse.json(transformedCouples, { status: 200 })
  } catch (error) {
    console.error('Error fetching user couples:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
