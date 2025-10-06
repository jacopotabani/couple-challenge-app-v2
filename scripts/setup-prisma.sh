#!/bin/bash

# Initialize Prisma for MongoDB migration
echo "🔄 Setting up Prisma for MongoDB migration..."

# Set working directory to Prisma package
cd packages/prisma

# Install dependencies first
echo "📦 Installing Prisma dependencies..."
yarn install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
yarn db:generate

# Push schema to database (for MongoDB, this creates collections)
echo "🚀 Pushing schema to MongoDB..."
yarn db:push

# Run seed if needed
echo "🌱 Seeding database..."
yarn db:seed

echo "✅ Prisma setup complete!"
echo ""
echo "🔍 You can view your data with:"
echo "   yarn db:studio"
echo ""
echo "🛠️  Available commands:"
echo "   yarn db:generate  - Regenerate Prisma client"
echo "   yarn db:push      - Push schema changes to DB"
echo "   yarn db:studio    - Open Prisma Studio"
echo "   yarn db:seed      - Seed the database"