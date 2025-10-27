# Create Admin User

## Step 1: Configure Vercel Environment Variables

Go to your Vercel project settings:
1. Navigate to **Settings** → **Environment Variables**
2. Add the following variables:

```bash
ENABLE_ADMIN_CREATE=true
ADMIN_CREATE_SECRET=your-super-secret-token-123
```

3. **Redeploy** your application

## Step 2: Create the Admin User

After redeployment, run one of these commands:

### Using curl:
```bash
curl -X POST https://orderhappyhour.com/api/admin/create-user \
  -H "Authorization: Bearer your-super-secret-token-123"
```

### Using PowerShell (Windows):
```powershell
Invoke-WebRequest -Uri "https://orderhappyhour.com/api/admin/create-user" `
  -Method POST `
  -Headers @{"Authorization"="Bearer your-super-secret-token-123"} `
  -UseBasicParsing
```

### Using a browser or Postman:
- URL: `https://orderhappyhour.com/api/admin/create-user`
- Method: `POST`
- Headers: 
  ```
  Authorization: Bearer your-super-secret-token-123
  ```

## Step 3: Login with Admin Credentials

After creating the user, login at: **https://orderhappyhour.com/admin-access**

- **Email**: `admin@happyhour.com`
- **Password**: `CHAIMrox11!`

## Step 4: Security - Disable the Endpoint

After successful login, **immediately**:
1. Go back to Vercel Settings → Environment Variables
2. **DELETE** or set `ENABLE_ADMIN_CREATE=false`
3. **DELETE** `ADMIN_CREATE_SECRET`
4. Redeploy

This disables the admin creation endpoint for security.

