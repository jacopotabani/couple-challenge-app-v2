import { betterAuth } from 'better-auth'
import { expo } from '@better-auth/expo'
import { MongoClient } from 'mongodb'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

export const createAuth = (databaseUrl: string) => {
  const client = new MongoClient(databaseUrl)
  const db = client.db(process.env.DB_NAME)

  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    plugins: [expo()],
    trustedOrigins: [
      'expo://',
      'mobile://',
      'exp://',
      'couple-challenge://',
      'http://localhost:3000',
      'http://192.168.1.169:3000',
      'http://192.168.178.146:3000',
    ],
  })
}
