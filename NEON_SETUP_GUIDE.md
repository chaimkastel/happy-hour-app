# 🚀 Neon Database Setup Guide

## Quick Setup Options

### Option 1: Automated Setup Script (Recommended)
```bash
./setup-neon-database.sh
```
This script will:
- Backup your current `.env.local`
- Update the DATABASE_URL with your Neon connection string
- Run database migrations
- Generate Prisma client
- Test the connection

### Option 2: Manual Setup

1. **Update your `.env.local` file:**
   ```bash
   # Replace the DATABASE_URL line with your Neon connection string
   sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require"|' .env.local
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

### Option 3: Direct Environment Update

If you have your Neon connection string ready, you can update it directly:

```bash
# Example: Replace with your actual Neon URL
export NEON_URL="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$NEON_URL\"|" .env.local
```

## Your Neon Connection String Format

Your Neon database connection string should look like this:
```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require
```

## Verification Steps

After setup, verify everything is working:

1. **Check the updated .env.local:**
   ```bash
   grep "DATABASE_URL" .env.local
   ```

2. **Test database connection:**
   ```bash
   npx prisma db pull --print
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues:

1. **Connection refused:** Make sure your Neon database is active and the URL is correct
2. **SSL errors:** Ensure `?sslmode=require` is included in your connection string
3. **Migration errors:** Run `npx prisma migrate reset` if needed (⚠️ This will delete all data)

### Getting Your Neon Connection String:

1. Go to your Neon dashboard
2. Select your project
3. Go to "Connection Details"
4. Copy the connection string
5. Make sure to include `?sslmode=require` at the end

## Next Steps After Setup

1. **Update other environment variables** in `.env.local` as needed:
   - `NEXTAUTH_SECRET` (generate a secure random string)
   - `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` (for payments)
   - `GOOGLE_MAPS_API_KEY` (for maps)
   - `RESEND_API_KEY` (for emails)

2. **Test the application:**
   - Visit `http://localhost:3000`
   - Try creating a user account
   - Test merchant registration
   - Verify deal creation

3. **Seed the database** (optional):
   ```bash
   npx prisma db seed
   ```

## Support

If you encounter any issues:
1. Check the Neon dashboard for database status
2. Verify your connection string format
3. Ensure all required environment variables are set
4. Check the application logs for specific error messages

Your Happy Hour app is now ready to connect to Neon! 🎉
