import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { CreateCoupleSchema } from '@my/api/couples/schemas'
import { createCouple } from '@my/api/couples/actions'

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
    const validationResult = CreateCoupleSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { name } = validationResult.data
    const userId = session.user.id

    // Create the couple using the new action
    const result = await createCouple(name, userId)

    // Return the created couple (without sensitive data)
    const responseCouple = {
      id: result.coupleId.toString(),
      name: name.trim(),
      couple_code: result.coupleCode,
      created_at: new Date(),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Couple created successfully',
        couple: responseCouple,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating couple:', error)

    // Handle specific errors from the action
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Optional: Add GET method to retrieve couple information
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not supported. Use POST to create a couple.' },
    { status: 405 }
  )
}
