import { ObjectId } from 'mongodb'

// Database document types for couples
export interface CoupleDocument {
  _id?: ObjectId
  name: string
  couple_code: string
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface CoupleMemberDocument {
  _id?: ObjectId
  couple_id: ObjectId
  user_id: string
  joined_at: Date
  role?: string
}

// API response types (additional to schema types)
export interface CoupleApiResponse {
  id: string
  name: string
  couple_code: string
  created_at: Date
}
