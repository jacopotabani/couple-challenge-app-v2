import { ObjectId } from 'mongodb'

// MongoDB document type for Account (mapped from better-auth Account model)
export interface AccountDocument {
  _id?: ObjectId
  id: string
  accountId: string
  providerId: string
  userId: string // Reference to User.id
  accessToken?: string
  refreshToken?: string
  idToken?: string
  accessTokenExpiresAt?: Date
  refreshTokenExpiresAt?: Date
  scope?: string
  password?: string
  createdAt: Date
  updatedAt: Date
}
