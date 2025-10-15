#!/bin/bash
set -e

echo "🔨 Building Aviator Server..."

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
cd apps/server
pnpm prisma generate

# Build TypeScript
echo "⚙️  Compiling TypeScript..."
pnpm run build

echo "✅ Build complete!"
