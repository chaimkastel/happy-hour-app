# Vercel Environment Variables Configuration

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### 1. Database (Auto-configured by Vercel)
- `STORAGE_URL` - Will be automatically set when you connect the Neon database

### 2. Redis (Auto-configured by Vercel)  
- `KV_URL` - Will be automatically set when you connect the KV database

### 3. NextAuth Configuration
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel app URL (e.g., `https://happy-hour-app.vercel.app`)

### 4. App Configuration
- `NODE_ENV` - Set to `production`
- `NEXT_PUBLIC_APP_URL` - Your Vercel app URL

### 5. Optional APIs
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key (if you have one)
- `QR_API_KEY` - Your QR code API key (if you have one)

## How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable above
4. Make sure to select all environments (Development, Preview, Production)

## Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET` value.
