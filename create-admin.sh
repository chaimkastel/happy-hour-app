#!/bin/bash

# Admin creation script
# Replace SECRET_TOKEN with the value you set in Vercel

SECRET_TOKEN="secure-token-change-this-12345"
URL="https://orderhappyhour.com/api/admin/create-user"

echo "🚀 Creating admin user..."
echo ""

response=$(curl -X POST "$URL" \
  -H "Authorization: Bearer $SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}" \
  -s)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

echo "Response Code: $http_code"
echo "Response: $body"

if [ "$http_code" -eq 200 ]; then
  echo ""
  echo "✅ Admin user created successfully!"
  echo ""
  echo "Login credentials:"
  echo "  Email: admin@happyhour.com"
  echo "  Password: CHAIMrox11!"
  echo ""
  echo "🔐 After logging in, REMOVE the environment variables from Vercel for security!"
else
  echo ""
  echo "❌ Failed to create admin user"
fi

