import { ObjectId } from 'mongodb'
import { getAuthDatabase } from '../db/mongoclient'
import type { CoupleDocument, CoupleMemberDocument } from './types'

// Get the couples collection with proper typing
export const getCouplesCollection = async () => {
  const database = await getAuthDatabase()
  return database.collection<Omit<CoupleDocument, '_id'> & { _id?: ObjectId }>('couples')
}

// Get the couple members collection with proper typing
export const getCoupleMembersCollection = async () => {
  const database = await getAuthDatabase()
  return database.collection<Omit<CoupleMemberDocument, '_id'> & { _id?: ObjectId }>(
    'couple_members'
  )
}

// Generate a unique couple code
export const generateCoupleCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Check if a couple code is unique
export const isCoupleCodeUnique = async (coupleCode: string): Promise<boolean> => {
  const couplesCollection = await getCouplesCollection()
  const existingCouple = await couplesCollection.findOne({
    couple_code: coupleCode,
  })
  return !existingCouple
}

// Generate a unique couple code with retry logic
export const generateUniqueCoupleCode = async (maxAttempts: number = 10): Promise<string> => {
  let coupleCode = generateCoupleCode()
  let attempts = 0

  while (attempts < maxAttempts) {
    const isUnique = await isCoupleCodeUnique(coupleCode)
    if (isUnique) {
      return coupleCode
    }
    coupleCode = generateCoupleCode()
    attempts++
  }

  throw new Error('Unable to generate unique couple code after maximum attempts')
}

// Create a new couple
export const createCouple = async (
  name: string,
  createdBy: string
): Promise<{ coupleId: ObjectId; coupleCode: string }> => {
  const couplesCollection = await getCouplesCollection()
  const membersCollection = await getCoupleMembersCollection()

  // Generate unique couple code
  const coupleCode = await generateUniqueCoupleCode()

  // Create the couple document
  const newCouple: Omit<CoupleDocument, '_id'> = {
    name: name.trim(),
    couple_code: coupleCode,
    created_by: createdBy,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const coupleResult = await couplesCollection.insertOne(newCouple)

  if (!coupleResult.insertedId) {
    throw new Error('Failed to create couple')
  }

  // Add the creator as the first member
  const memberDocument: Omit<CoupleMemberDocument, '_id'> = {
    couple_id: coupleResult.insertedId,
    user_id: createdBy,
    joined_at: new Date(),
    role: 'creator',
  }

  const memberResult = await membersCollection.insertOne(memberDocument)

  if (!memberResult.insertedId) {
    // Rollback couple creation if member insertion fails
    await couplesCollection.deleteOne({ _id: coupleResult.insertedId })
    throw new Error('Failed to add member to couple')
  }

  return {
    coupleId: coupleResult.insertedId,
    coupleCode,
  }
}

// Get couple by ID
export const getCoupleById = async (coupleId: string): Promise<CoupleDocument | null> => {
  const couplesCollection = await getCouplesCollection()
  return await couplesCollection.findOne({ _id: new ObjectId(coupleId) })
}

// Get couple by code
export const getCoupleByCode = async (coupleCode: string): Promise<CoupleDocument | null> => {
  const couplesCollection = await getCouplesCollection()
  return await couplesCollection.findOne({ couple_code: coupleCode })
}

// Get couples for a user
export const getCouplesForUser = async (userId: string): Promise<CoupleDocument[]> => {
  const membersCollection = await getCoupleMembersCollection()
  const couplesCollection = await getCouplesCollection()

  // Find all couples where the user is a member
  const memberships = await membersCollection.find({ user_id: userId }).toArray()
  const coupleIds = memberships.map((membership) => membership.couple_id)

  if (coupleIds.length === 0) {
    return []
  }

  return await couplesCollection.find({ _id: { $in: coupleIds } }).toArray()
}

// Join a couple by code
export const joinCoupleByCode = async (
  coupleCode: string,
  userId: string
): Promise<{ success: boolean; coupleId?: ObjectId; error?: string }> => {
  const couplesCollection = await getCouplesCollection()
  const membersCollection = await getCoupleMembersCollection()

  // Find the couple
  const couple = await couplesCollection.findOne({ couple_code: coupleCode })
  if (!couple) {
    return { success: false, error: 'Couple not found' }
  }

  // Check if user is already a member
  const existingMembership = await membersCollection.findOne({
    couple_id: couple._id,
    user_id: userId,
  })

  if (existingMembership) {
    return { success: false, error: 'User is already a member of this couple' }
  }

  // Add the user as a member
  const memberDocument: Omit<CoupleMemberDocument, '_id'> = {
    couple_id: couple._id!,
    user_id: userId,
    joined_at: new Date(),
    role: 'member',
  }

  const memberResult = await membersCollection.insertOne(memberDocument)

  if (!memberResult.insertedId) {
    return { success: false, error: 'Failed to join couple' }
  }

  return { success: true, coupleId: couple._id }
}

// Get members of a couple
export const getCoupleMembers = async (coupleId: string): Promise<CoupleMemberDocument[]> => {
  const membersCollection = await getCoupleMembersCollection()
  return await membersCollection.find({ couple_id: new ObjectId(coupleId) }).toArray()
}
