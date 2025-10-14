#!/bin/bash
set -e

echo "🔨 Building Aviator Server..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
cd apps/server
pnpm prisma generate

# Build TypeScript
echo "⚙️  Compiling TypeScript..."
pnpm run build

echo "✅ Build complete!"
