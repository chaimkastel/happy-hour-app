#!/bin/bash

# 🚀 Split Deployment Script
# Usage: ./scripts/deploy.sh [type] [message]
# Types: fix, feature, core, ui

TYPE=${1:-"fix"}
MESSAGE=${2:-"Update"}

case $TYPE in
  "fix")
    EMOJI="🔧"
    PREFIX="Fix"
    ;;
  "feature")
    EMOJI="✨"
    PREFIX="Feature"
    ;;
  "core")
    EMOJI="🏗️"
    PREFIX="Core"
    ;;
  "ui")
    EMOJI="🎨"
    PREFIX="UI"
    ;;
  *)
    EMOJI="📝"
    PREFIX="Update"
    ;;
esac

echo "🚀 Preparing deployment..."
echo "Type: $TYPE"
echo "Message: $MESSAGE"

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "❌ No changes to commit"
    exit 1
fi

# Show what will be committed
echo "📋 Files to be committed:"
git status --porcelain

# Count files
FILE_COUNT=$(git status --porcelain | wc -l)
echo "📊 Total files: $FILE_COUNT"

# Warn if too many files
if [ $FILE_COUNT -gt 5 ]; then
    echo "⚠️  WARNING: More than 5 files detected. Consider splitting into smaller commits."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Commit and push
git add .
git commit -m "$EMOJI $PREFIX: $MESSAGE"
git push origin main

echo "✅ Deployment triggered!"
echo "🔗 Check status at: https://vercel.com/dashboard"