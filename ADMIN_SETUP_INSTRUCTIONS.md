# 🔧 Setup Admin User on Live Site - SIMPLE METHOD

## ⚡ Quick Setup (2 Steps)

### Option A: Via Browser (Easiest)

1. **Go to this URL in your browser** (after deploying):
   ```
   https://orderhappyhour.com/api/admin/setup-admin
   ```

2. **Send a POST request using any browser extension** (like "Postman" or "REST Client"):
   - Method: POST
   - URL: https://orderhappyhour.com/api/admin/setup-admin
   - Headers: Leave empty
   - Body: Leave empty

3. **Or use your browser console:**
   ```javascript
   fetch('https://orderhappyhour.com/api/admin/setup-admin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' }
   }).then(r => r.json()).then(console.log)
   ```

### Option B: Via Terminal

Run this command in your terminal:

```bash
curl -X POST https://orderhappyhour.com/api/admin/setup-admin \
  -H "Content-Type: application/json"
```

## ✅ Expected Response

You should see:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "email": "admin@orderhappyhour.com",
  "password": "CHAIMrox11!"
}
```

## 🔑 Login Credentials

After running the setup:
- **URL**: https://orderhappyhour.com/admin-access
- **Email**: admin@orderhappyhour.com
- **Password**: CHAIMrox11!

## 🗑️ IMPORTANT: Delete After Use!

After creating your admin user, **DELETE** this endpoint for security:

1. Go to: `app/api/admin/setup-admin/route.ts`
2. Delete the file
3. Commit and push:
   ```bash
   git rm app/api/admin/setup-admin/route.ts
   git commit -m "security: remove admin setup endpoint"
   git push
   ```

## 🔒 If You Want Extra Security

Add a simple password to the endpoint:

1. In Vercel, add environment variable: `SETUP_SECRET = your-password-here`
2. Call with header: `x-setup-secret: your-password-here`

But for now, it will work without it.

