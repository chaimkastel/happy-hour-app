# Create Admin User in Production - Step by Step Guide

## Step 1: Set Environment Variables in Vercel

1. **Go to your Vercel dashboard**: https://vercel.com/dashboard
2. **Select your project**: `happy-hour-app`
3. **Go to Settings** → **Environment Variables**
4. **Add these two variables:**

   - **Variable 1:**
     - Name: `ENABLE_ADMIN_CREATE`
     - Value: `true`
     - Environment: Production
     - Click "Save"
   
   - **Variable 2:**
     - Name: `ADMIN_CREATE_SECRET`
     - Value: `your-secret-token-12345` (make this something secure)
     - Environment: Production
     - Click "Save"

## Step 2: Redeploy Your App

After adding the environment variables, you need to trigger a new deployment:

1. In Vercel dashboard, go to **Deployments** tab
2. Find your latest deployment
3. Click the **3 dots (...)** menu
4. Click **"Redeploy"** → **"Use existing Build Cache"** → **"Redeploy"**

OR

1. In your terminal (in the project directory):
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push
   ```

## Step 3: Call the Admin Creation Endpoint

Once the deployment is complete:

1. **Get your Vercel URL**: It should be something like `https://happy-hour-app.vercel.app` or your custom domain
2. **Run this curl command in your terminal** (replace with your secret token from Step 1):

```bash
curl -X POST https://YOUR-VERCEL-URL.vercel.app/api/admin/create-user \
  -H "Authorization: Bearer your-secret-token-12345" \
  -H "Content-Type: application/json"
```

**Example:**
```bash
curl -X POST https://orderhappyhour.com/api/admin/create-user \
  -H "Authorization: Bearer your-secret-token-12345" \
  -H "Content-Type: application/json"
```

You should see a response like:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "email": "admin@orderhappyhour.com",
  "password": "CHAIMrox11!"
}
```

## Step 4: DISABLE the Endpoint (IMPORTANT!)

After creating the admin user, you MUST disable the endpoint for security:

1. **Go back to Vercel** → **Settings** → **Environment Variables**
2. **Find `ENABLE_ADMIN_CREATE`**
3. **Change the value from `true` to `false`**
4. **Save**
5. **Redeploy the app** (same as Step 2)

## Step 5: Test Login

Now try logging in at:
- **URL**: `https://orderhappyhour.com/admin-access` (or your Vercel URL)
- **Email**: `admin@orderhappyhour.com`
- **Password**: `CHAIMrox11!`

## Troubleshooting

If it doesn't work, check:

1. **Is ENABLE_ADMIN_CREATE set to true?** (Check in Vercel dashboard)
2. **Did you redeploy after setting the env vars?** (Environment variables require a redeploy)
3. **Is the secret token correct?** (The one in the curl command must match ADMIN_CREATE_SECRET)
4. **Is the URL correct?** (Make sure you're calling the correct production URL)
5. **Check Vercel logs**: Go to Deployments → Click on latest deployment → View Function Logs

## Common Issues

**Issue**: "This endpoint is disabled"
- **Solution**: Make sure `ENABLE_ADMIN_CREATE=true` is set and you redeployed

**Issue**: "Unauthorized - Invalid secret token"
- **Solution**: Make sure the Bearer token in your curl command matches `ADMIN_CREATE_SECRET`

**Issue**: Database connection error
- **Solution**: Make sure your `DATABASE_URL` is set correctly in Vercel

**Issue**: Admin login still doesn't work
- **Solution**: Clear your browser cookies/cache and try again, or use incognito mode

