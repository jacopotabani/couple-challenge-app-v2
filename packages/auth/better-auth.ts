import { betterAuth } from 'better-auth'
import { expo } from '@better-auth/expo'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'
// import prisma from '../../packages/db/src'
// import { prisma } from '@my/prisma/client'
const prisma = new PrismaClient()
export const createAuth = (databaseUrl?: string) => {
  return betterAuth({
    advanced: {
      database: {
        generateId: false,
      },
    },
    database: prismaAdapter(prisma, {
      provider: 'mongodb',
    }),
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
      'http://192.168.2.12:3000',
    ],
  })
}
