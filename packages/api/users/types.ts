import { ObjectId } from 'mongodb'

// MongoDB document type for User (mapped from better-auth User model)
export interface UserDocument {
  _id?: ObjectId
  id: string // Better-auth requires string id
  name: string
  email: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
}

// API response type
export interface UserApiResponse {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  createdAt: Date
}
