#!/bin/bash

SECRET_TOKEN="CHAIMrox11!"
URL="https://orderhappyhour.com/api/admin/create-user"

echo "🚀 Creating admin user..."
echo ""

response=$(curl -X POST "$URL" \
  -H "Authorization: Bearer $SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}" \
  2>/dev/null)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo "Response:"
echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"

echo ""
echo ""

if [[ "$http_code" -eq 200 ]]; then
  echo "✅ Admin user created successfully!"
  echo ""
  echo "Login credentials:"
  echo "  Email: admin@happyhour.com"
  echo "  Password: CHAIMrox11!"
  echo ""
  echo "🔗 Login at: https://orderhappyhour.com/admin-access"
else
  echo "⚠️  Waiting for deployment to complete. Please try again in a minute."
  echo "You can also check Vercel dashboard to see deployment status."
fi

