#!/usr/bin/env bash
set -e
echo "🔧 Setting up Lana SDK Environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Copied .env.example to .env"
fi
echo "✓ Environment setup complete."
