#!/bin/bash

echo "🚀 Creating admin user on production..."
echo ""
echo "⚠️  Make sure your site is deployed to Vercel first!"
echo ""
read -p "What is your production URL? (e.g., orderhappyhour.com): " URL

if [ -z "$URL" ]; then
  URL="orderhappyhour.com"
fi

echo ""
echo "📞 Calling: https://$URL/api/admin/setup-admin"
echo ""

RESPONSE=$(curl -s -X POST "https://$URL/api/admin/setup-admin" \
  -H "Content-Type: application/json")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo ""

if [[ "$RESPONSE" == *"success"* ]]; then
  echo "✅ SUCCESS! Admin user created!"
  echo ""
  echo "🔑 Login credentials:"
  echo "   URL: https://$URL/admin-access"
  echo "   Email: admin@orderhappyhour.com"
  echo "   Password: CHAIMrox11!"
  echo ""
else
  echo "❌ Failed. Check the error above."
fi

