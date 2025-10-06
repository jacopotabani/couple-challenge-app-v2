import { ObjectId } from 'mongodb'

// Embedded member type (no longer a separate document)
export interface CoupleMember {
  user_ref: ObjectId // Reference to User._id for population
  joined_at: Date
  role?: 'creator' | 'member'
}

// Database document types for couples (with embedded members)
export interface CoupleDocument {
  _id?: ObjectId
  name: string
  couple_code: string
  created_by: ObjectId // Reference to User._id for population
  members: CoupleMember[] // Embedded array of members
  created_at: Date
  updated_at: Date
}

// API response types (additional to schema types)
export interface CoupleApiResponse {
  id: string
  name: string
  couple_code: string
  created_at: Date
  members?: CoupleMemberApiResponse[]
}

export interface CoupleMemberApiResponse {
  user_ref: string // Will be populated user data or user ID as string
  joined_at: Date
  role?: string
}
