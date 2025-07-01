# Authentication Troubleshooting Guide 🔐

This guide helps you resolve common authentication issues in DevDost.

## 🚨 Common Error: OAuthAccountNotLinked

### What causes this error?

The "OAuthAccountNotLinked" error occurs when:

1. Multiple authentication providers are trying to link to the same email
2. A user tries to sign in with Google when they previously used a different method
3. Database session conflicts between different authentication attempts
4. MongoDB adapter conflicts with custom user creation logic

### 🛠️ Solutions

#### Solution 1: Use JWT Strategy (Recommended for Development)

Replace your current NextAuth route with the JWT version:

```bash
# Backup current auth route
mv src/app/api/auth/[...nextauth]/route.ts src/app/api/auth/[...nextauth]/route-database.ts

# Use JWT strategy
mv src/app/api/auth/[...nextauth]/route-jwt.ts src/app/api/auth/[...nextauth]/route.ts
```

#### Solution 2: Clear Browser Data

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all cookies for localhost:3000
4. Clear Local Storage and Session Storage
5. Try signing in again

#### Solution 3: Reset Database Collections

```bash
# Connect to MongoDB and drop auth collections
mongosh
use devdost
db.accounts.drop()
db.sessions.drop()
db.users.drop()  # Note: This will remove all user data
```

#### Solution 4: Environment Variables Check

Ensure your `.env.local` has correct values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
GOOGLE_CLIENT_ID=183084025505-e5k0j4hnjivmncjgttllad7iicqou82t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
MONGODB_URI=mongodb://localhost:27017/devdost
```

## 🔍 Debugging Steps

### 1. Enable Debug Mode

Set `debug: true` in NextAuth config (already enabled in development)

### 2. Check Server Logs

Look for these logs in your terminal:

-   `✅ Auth Success` - Authentication working
-   `🔥 Auth Error` - Error details
-   `🚨 Missing environment variables` - Config issues

### 3. Check Browser Network Tab

1. Open DevTools → Network
2. Try signing in
3. Look for failed requests to `/api/auth/*`
4. Check response status and error messages

### 4. Verify MongoDB Connection

```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/devdost
db.runCommand({ ping: 1 })
```

## 🚀 Quick Fixes

### Reset Everything (Nuclear Option)

```bash
# Stop dev server
# Clear all browser data for localhost:3000
# Reset database
mongosh
use devdost
db.dropDatabase()

# Restart dev server
npm run dev

# Seed database
npm run seed
```

### Switch to JWT Strategy Permanently

If database strategy keeps causing issues:

1. Copy `route-jwt.ts` content to `route.ts`
2. Update session strategy to `jwt`
3. Remove MongoDB adapter import
4. Restart development server

## 📋 Pre-deployment Checklist

-   [ ] Environment variables are set correctly
-   [ ] Google OAuth app is configured properly
-   [ ] MongoDB is accessible
-   [ ] NextAuth secret is set
-   [ ] Callback URLs are whitelisted in Google Console

## 🆘 Still Having Issues?

### Common Environment Issues

1. **NEXTAUTH_SECRET not set**: Generate one with `openssl rand -base64 32`
2. **Wrong NEXTAUTH_URL**: Should match your domain exactly
3. **Google OAuth misconfigured**: Check authorized redirect URIs
4. **MongoDB connection issues**: Verify connection string

### Debug Commands

```bash
# Check if all services are running
npm run dev

# Test database connection
node -e "require('./src/lib/mongodb.ts').default()"

# Verify environment variables
node -e "console.log(process.env.NEXTAUTH_URL, process.env.GOOGLE_CLIENT_ID)"
```

### Contact Support

If none of these solutions work:

1. Check GitHub issues for similar problems
2. Create a new issue with:
    - Error message
    - Browser console logs
    - Server terminal logs
    - Steps to reproduce

## 🔒 Security Notes

-   Never commit `.env.local` to version control
-   Use different OAuth apps for development and production
-   Rotate secrets regularly in production
-   Monitor authentication logs for suspicious activity

---

**Remember**: Authentication issues are often environment-related. When in doubt, start fresh with a clean database and browser session.
