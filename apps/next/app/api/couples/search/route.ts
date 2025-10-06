import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { z } from 'zod'
import { getCoupleByCode } from '@my/api/couples/actions'

const SearchCoupleSchema = z.object({
  couple_code: z.string().min(6).max(6),
})

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
    const validationResult = SearchCoupleSchema.safeParse(body)

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

    // Search for the couple using the new action
    const couple = await getCoupleByCode(couple_code)

    if (!couple) {
      return NextResponse.json({ error: 'Couple not found' }, { status: 404 })
    }

    // Return the found couple with members (but don't populate user details for privacy)
    const responseCouple = {
      id: couple._id!.toString(),
      name: couple.name,
      couple_code: couple.couple_code,
      created_by: couple.created_by,
      created_at: couple.created_at,
      updated_at: couple.updated_at,
      members: couple.members,
    }

    return NextResponse.json(
      {
        success: true,
        couple: responseCouple,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error searching couple:', error)

    // Handle specific errors from the action
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not supported. Use POST to search for a couple.' },
    { status: 405 }
  )
}
