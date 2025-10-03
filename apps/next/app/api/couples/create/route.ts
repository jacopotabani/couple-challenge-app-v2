import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { z } from 'zod'

// Schema for validating couple creation request
const CreateCoupleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Couple name is required' })
    .max(100, { message: 'Couple name must be less than 100 characters' }),
})

// Generate a unique couple code
const generateCoupleCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  let client: any = null

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

    // Get database connection
    // We need to create a new MongoDB connection since Better Auth doesn't expose the db directly
    const { MongoClient } = await import('mongodb')
    client = new MongoClient(process.env.DATABASE_URL!)
    await client.connect()
    const db = client.db(process.env.DB_NAME)

    // Generate unique couple code with retry logic
    let coupleCode = generateCoupleCode()
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      const existingCouple = await db.collection('couples').findOne({
        couple_code: coupleCode,
      })

      if (!existingCouple) {
        isUnique = true
      } else {
        coupleCode = generateCoupleCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique couple code. Please try again.' },
        { status: 500 }
      )
    }

    // Create the couple document
    const newCouple = {
      name: name.trim(),
      couple_code: coupleCode,
      created_by: userId,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const coupleResult = await db.collection('couples').insertOne(newCouple)

    if (!coupleResult.insertedId) {
      return NextResponse.json({ error: 'Failed to create couple' }, { status: 500 })
    }

    // Add the creator as the first member
    const memberDocument = {
      couple_id: coupleResult.insertedId,
      user_id: userId,
      joined_at: new Date(),
      role: 'creator', // Optional: track who created the couple
    }

    const memberResult = await db.collection('couple_members').insertOne(memberDocument)

    if (!memberResult.insertedId) {
      // Rollback couple creation if member insertion fails
      await db.collection('couples').deleteOne({ _id: coupleResult.insertedId })
      return NextResponse.json({ error: 'Failed to add member to couple' }, { status: 500 })
    }

    // Return the created couple (without sensitive data)
    const responseCouple = {
      id: coupleResult.insertedId.toString(),
      name: newCouple.name,
      couple_code: newCouple.couple_code,
      created_at: newCouple.created_at,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    // Always close the MongoDB connection
    if (client) {
      await client.close()
    }
  }
}

// Optional: Add GET method to retrieve couple information
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not supported. Use POST to create a couple.' },
    { status: 405 }
  )
}
