# Prisma Migration Guide

This document explains how to migrate from MongoDB driver to Prisma + MongoDB in your monorepo.

## What Changed

### 1. New Prisma Package (`packages/prisma/`)
- **Schema**: `packages/prisma/prisma/schema.prisma` - Defines your data models
- **Client**: `packages/prisma/src/client.ts` - Prisma client instance
- **Seed**: `packages/prisma/src/seed.ts` - Database seeding script

### 2. Updated Better Auth Configuration
- Replaced `mongodbAdapter` with `prismaAdapter`
- Removed direct MongoDB client dependency
- Now uses `@my/prisma/client` for database operations

### 3. Environment Variables
Your existing `DATABASE_URL` remains the same. Prisma will use the same MongoDB connection string.

## Data Models

The schema includes:
- **Better Auth models**: `User`, `Account`, `Session`, `VerificationToken`
- **App-specific models**: `Couple`, `Challenge`, `ChallengeCompletion`

### User Model
```prisma
model User {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  email         String   @unique
  name          String?
  image         String?
  emailVerified Boolean  @default(false)
  // ... relations to accounts, sessions
}
```

### App Models
```prisma
model Couple {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String?
  user1Id   String   @db.ObjectId
  user2Id   String   @db.ObjectId
  // ... relations to challenges
}

model Challenge {
  title       String
  description String
  category    String
  difficulty  String // easy, medium, hard
  // ... relations to completions
}
```

## Migration Steps

### 1. Install Dependencies
```bash
yarn install
```

### 2. Generate Prisma Client
```bash
yarn db:generate
```

### 3. Push Schema to Database
```bash
yarn db:push
```

### 4. Seed Database (Optional)
```bash
yarn db:seed
```

### 5. Automated Setup
Run the complete setup script:
```bash
./scripts/setup-prisma.sh
```

## Available Commands

### Root Level Commands
- `yarn db:generate` - Generate Prisma client
- `yarn db:push` - Push schema to database
- `yarn db:studio` - Open Prisma Studio
- `yarn db:seed` - Seed database

### Package Level Commands (in `packages/prisma/`)
- `yarn db:migrate` - Create and apply migrations
- `yarn db:migrate:reset` - Reset database and migrations

## Usage in Your App

### Import Prisma Client
```typescript
import { prisma } from '@my/prisma/client'

// Example: Get all users
const users = await prisma.user.findMany()

// Example: Create a couple
const couple = await prisma.couple.create({
  data: {
    name: 'John & Jane',
    user1Id: 'user1_id',
    user2Id: 'user2_id'
  }
})
```

### Better Auth Integration
The auth configuration automatically uses Prisma:
```typescript
// packages/auth/better-auth.ts
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@my/prisma/client'

export const createAuth = () => {
  return betterAuth({
    database: prismaAdapter(prisma),
    // ... other config
  })
}
```

## Database Studio
View and edit your data with Prisma Studio:
```bash
yarn db:studio
```

Opens at `http://localhost:5555`

## Data Migration Notes

Since you're using the same MongoDB database:
1. Existing user data should remain intact
2. Better Auth collections map to Prisma models
3. You may need to adjust field names if they differ from the schema

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run `yarn db:generate` to create the Prisma client.

### Database Connection Issues
Ensure your `DATABASE_URL` is correct and the database is accessible.

### Schema Changes
After modifying `schema.prisma`:
1. Run `yarn db:generate` to update the client
2. Run `yarn db:push` to update the database schema