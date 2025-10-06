import { ObjectId } from 'mongodb'

// MongoDB document type for Session (mapped from better-auth Session model)
export interface SessionDocument {
  _id?: ObjectId
  id: string
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress?: string
  userAgent?: string
  userId: string // Reference to User.id
}
