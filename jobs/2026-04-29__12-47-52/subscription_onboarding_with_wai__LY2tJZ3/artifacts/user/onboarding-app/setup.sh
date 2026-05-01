#!/bin/bash

# Setup script for Durable Subscription Onboarding with Waitpoints
# This script sets up the Next.js application with Trigger.dev integration

set -e

echo "🚀 Setting up Durable Subscription Onboarding Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Trigger.dev credentials"
fi

# Type-check trigger config
echo "🔍 Type-checking trigger.config.ts..."
npx tsc --skipLibCheck --noEmit trigger.config.ts

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Trigger.dev credentials"
echo "2. Configure Trigger.dev CLI: mkdir -p ~/.config/trigger && printf \"%s\" \"\$TRIGGER_CREDENTIAL_CONFIG_JSON\" > ~/.config/trigger/config.json"
echo "3. Start the development server: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"