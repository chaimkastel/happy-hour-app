# Vercel Deployment Guide

## Environment Variables Needed

Your app only needs these environment variables in Vercel:

### Required:
- `DATABASE_URL` - Will be automatically set by Vercel when you connect the Neon database
- `NEXTAUTH_SECRET` - A random secret key for authentication
- `NEXTAUTH_URL` - Your Vercel app URL (will be set automatically)

### Optional:
- `REDIS_URL` - Will be automatically set by Vercel when you connect the Redis database
- `GOOGLE_CLIENT_ID` - For Google OAuth (if you want Google login)
- `GOOGLE_CLIENT_SECRET` - For Google OAuth (if you want Google login)

## Quick Setup Steps:

1. **Connect Neon Database** - Vercel will automatically create `DATABASE_URL`
2. **Connect Redis Database** - Vercel will automatically create `REDIS_URL` 
3. **Add NEXTAUTH_SECRET** - Generate a random string
4. **Deploy** - Your app will work!

## Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

The app is designed to work with minimal configuration and will gracefully handle missing optional services.
