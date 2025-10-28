#!/bin/bash

# Create Admin User on Production
# This script creates the admin user on your production Vercel deployment

# Set these variables
VERCEL_URL="https://orderhappyhour.com"  # Change this to your actual URL
ADMIN_SECRET="create-admin-now-12345"     # Change this to something secure

echo "🚀 Creating admin user on production..."
echo ""

# Step 1: Set environment variables
echo "📝 Step 1: Please set these environment variables in Vercel:"
echo "   - ENABLE_ADMIN_CREATE = true"
echo "   - ADMIN_CREATE_SECRET = $ADMIN_SECRET"
echo ""
echo "Press ENTER after you've set these variables and redeployed..."
read

# Step 2: Call the API
echo "🔄 Step 2: Creating admin user..."
RESPONSE=$(curl -X POST "$VERCEL_URL/api/admin/create-user" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -w "\nHTTP_CODE:%{http_code}")

echo "$RESPONSE"

# Check if it worked
if [[ "$RESPONSE" == *"success"* ]] || [[ "$RESPONSE" == *"created"* ]]; then
  echo ""
  echo "✅ SUCCESS! Admin user created!"
  echo ""
  echo "Login credentials:"
  echo "  Email: admin@orderhappyhour.com"
  echo "  Password: CHAIMrox11!"
  echo ""
  echo "🔒 IMPORTANT: Now disable the endpoint!"
  echo "   - Go to Vercel → Settings → Environment Variables"
  echo "   - Set ENABLE_ADMIN_CREATE = false"
  echo "   - Redeploy"
else
  echo ""
  echo "❌ Failed to create admin user"
  echo "Check the error above and try again"
fi

