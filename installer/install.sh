#!/usr/bin/env bash
# ==============================================================================
# Lana SDK One-Click Installer & Runtime Bootstrapper
# Enterprise AI Engineering Kit (Node.js / Python / Browser)
# ==============================================================================

set -e

echo "✨ [1/5] Detecting environment and checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is required but not installed. Please install Node.js (>= 18)."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is required but not installed."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js detected: $NODE_VERSION"

echo "📦 [2/5] Installing Lana SDK and dependencies..."
npm install

echo "⚙️ [3/5] Configuring local development environment (.env)..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✓ Created .env from .env.example"
  else
    echo "GEMINI_API_KEY=" > .env
    echo "✓ Created default .env file"
  fi
fi

echo "🔗 [4/5] Registering global CLI command ('lana')..."
npm link --force || true

echo "🚀 [5/5] Starting Lana SDK runtime and developer studio..."
echo ""
echo "========================================================================"
echo "🎉 Lana SDK successfully installed!"
echo "👉 Quick start commands:"
echo "   lana --help            Show CLI commands"
echo "   lana create project    Initialize new enterprise AI project"
echo "   lana run               Start the local runtime engine & event bus"
echo "========================================================================"
echo ""

# Start the runtime server
npm run dev
