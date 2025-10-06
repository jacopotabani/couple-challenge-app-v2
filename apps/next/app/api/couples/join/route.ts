import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { JoinCoupleSchema } from '@my/api/couples/schemas'
import { joinCoupleByCode } from '@my/api/couples/actions'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = JoinCoupleSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { couple_code } = validationResult.data
    const userId = session.user.id

    // Join the couple using the new action
    const result = await joinCoupleByCode(couple_code, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Return the joined couple with members
    const responseCouple = {
      id: result.couple!._id!.toString(),
      name: result.couple!.name,
      couple_code: result.couple!.couple_code,
      created_by: result.couple!.created_by,
      created_at: result.couple!.created_at,
      updated_at: result.couple!.updated_at,
      members: result.couple!.members,
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined couple',
        couple: responseCouple,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error joining couple:', error)

    // Handle specific errors from the action
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not supported. Use POST to join a couple.' },
    { status: 405 }
  )
}
