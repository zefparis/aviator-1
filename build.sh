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

# Build server (includes prisma generate)
echo "⚙️  Building server..."
cd apps/server
pnpm run build

echo "✅ Build complete!"
