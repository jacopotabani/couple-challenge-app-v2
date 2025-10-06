export {
  default as clientPromise,
  getDatabase,
  getAuthDatabase,
  getAuthDatabaseSync,
} from './mongoclient'

// Generic collection helper function
export const getCollection = async <T extends Document>(collectionName: string) => {
  const { getAuthDatabase } = await import('./mongoclient')
  const database = await getAuthDatabase()
  return database.collection<T>(collectionName)
}

// Re-export MongoDB types for convenience
export { ObjectId } from 'mongodb'
export type { Document } from 'mongodb'
