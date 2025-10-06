import { ObjectId } from 'mongodb'

// MongoDB document type for Verification (mapped from better-auth Verification model)
export interface VerificationDocument {
  _id?: ObjectId
  id: string
  identifier: string
  value: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}
