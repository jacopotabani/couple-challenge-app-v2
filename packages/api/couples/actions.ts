import { ObjectId } from 'mongodb'
import { getAuthDatabase } from '../db/mongoclient'
import type { CoupleDocument, CoupleMember } from './types'
import type { UserDocument } from '../users/types'

// Get the couples collection with proper typing
export const getCouplesCollection = async () => {
  const database = await getAuthDatabase()
  return database.collection<Omit<CoupleDocument, '_id'> & { _id?: ObjectId }>('couples')
}

// Get the users collection for population
export const getUsersCollection = async () => {
  const database = await getAuthDatabase()
  return database.collection<Omit<UserDocument, '_id'> & { _id?: ObjectId }>('user')
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

// Create a new couple with embedded creator member
export const createCouple = async (
  name: string,
  createdBy: string
): Promise<{ coupleId: ObjectId; coupleCode: string }> => {
  const couplesCollection = await getCouplesCollection()

  // Generate unique couple code
  const coupleCode = await generateUniqueCoupleCode()

  // Create the creator member
  const creatorMember: CoupleMember = {
    user_ref: new ObjectId(createdBy),
    joined_at: new Date(),
    role: 'creator',
  }

  // Create the couple document with embedded creator
  const newCouple: Omit<CoupleDocument, '_id'> = {
    name: name.trim(),
    couple_code: coupleCode,
    created_by: new ObjectId(createdBy),
    members: [creatorMember], // Embedded array with creator as first member
    created_at: new Date(),
    updated_at: new Date(),
  }

  const coupleResult = await couplesCollection.insertOne(newCouple)

  if (!coupleResult.insertedId) {
    throw new Error('Failed to create couple')
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

// Get couple by ID with populated members
export const getCoupleByIdWithPopulatedMembers = async (coupleId: string) => {
  const couplesCollection = await getCouplesCollection()
  const usersCollection = await getUsersCollection()

  const couple = await couplesCollection.findOne({ _id: new ObjectId(coupleId) })
  if (!couple) return null

  // Populate members with user data
  const populatedMembers = await Promise.all(
    couple.members.map(async (member) => {
      const user = await usersCollection.findOne({ _id: member.user_ref })
      return {
        ...member,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }
          : null,
      }
    })
  )

  return {
    ...couple,
    members: populatedMembers,
  }
}

// Get couple by code
export const getCoupleByCode = async (coupleCode: string): Promise<CoupleDocument | null> => {
  const couplesCollection = await getCouplesCollection()
  return await couplesCollection.findOne({ couple_code: coupleCode })
}

// Get couples for a user (using embedded members)
export const getCouplesForUser = async (userId: string): Promise<CoupleDocument[]> => {
  const couplesCollection = await getCouplesCollection()
  console.log('couplesCollection:', couplesCollection)
  // Find all couples where the user is a member in the embedded members array
  return await couplesCollection
    .find({
      'members.user_ref': new ObjectId(userId),
    })
    .toArray()
}

// Join a couple by code (add member to embedded array)
export const joinCoupleByCode = async (
  coupleCode: string,
  userId: string
): Promise<{ success: boolean; couple?: CoupleDocument; error?: string }> => {
  const couplesCollection = await getCouplesCollection()

  // Find the couple
  const couple = await couplesCollection.findOne({ couple_code: coupleCode })
  if (!couple) {
    return { success: false, error: 'Couple not found' }
  }

  // Check if user is already a member
  const existingMember = couple.members?.find((member) => member.user_ref.toString() === userId)
  if (existingMember) {
    return { success: false, error: 'User is already a member of this couple' }
  }

  // Create new member
  const newMember: CoupleMember = {
    user_ref: new ObjectId(userId),
    joined_at: new Date(),
    role: 'member',
  }

  // Add the user to the members array using $push
  const updateResult = await couplesCollection.updateOne(
    { _id: couple._id },
    {
      $push: { members: newMember },
      $set: { updated_at: new Date() },
    }
  )

  if (updateResult.modifiedCount === 0) {
    return { success: false, error: 'Failed to join couple' }
  }

  // Get the updated couple
  const updatedCouple = await getCoupleById(couple._id!.toString())

  return { success: true, couple: updatedCouple! }
}

// Remove member from couple (remove from embedded array)
export const removeMemberFromCouple = async (
  coupleId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  const couplesCollection = await getCouplesCollection()

  const updateResult = await couplesCollection.updateOne(
    { _id: new ObjectId(coupleId) },
    {
      $pull: { members: { user_ref: new ObjectId(userId) } },
      $set: { updated_at: new Date() },
    }
  )

  if (updateResult.modifiedCount === 0) {
    return { success: false, error: 'Failed to remove member from couple' }
  }

  return { success: true }
}

// Update member role in couple
export const updateMemberRole = async (
  coupleId: string,
  userId: string,
  newRole: 'creator' | 'member'
): Promise<{ success: boolean; error?: string }> => {
  const couplesCollection = await getCouplesCollection()

  const updateResult = await couplesCollection.updateOne(
    {
      _id: new ObjectId(coupleId),
      'members.user_ref': new ObjectId(userId),
    },
    {
      $set: {
        'members.$.role': newRole,
        updated_at: new Date(),
      },
    }
  )

  if (updateResult.modifiedCount === 0) {
    return { success: false, error: 'Failed to update member role' }
  }

  return { success: true }
}

// Get member from couple
export const getMemberFromCouple = async (
  coupleId: string,
  userId: string
): Promise<CoupleMember | null> => {
  const couple = await getCoupleById(coupleId)
  if (!couple) {
    return null
  }

  return couple.members?.find((member) => member.user_ref.toString() === userId) || null
}

// Check if user is member of couple
export const isUserMemberOfCouple = async (coupleId: string, userId: string): Promise<boolean> => {
  const member = await getMemberFromCouple(coupleId, userId)
  return !!member
}
