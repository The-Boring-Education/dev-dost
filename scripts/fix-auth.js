#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔧 DevDost Authentication Fix Script")
console.log("====================================\n")

async function fixAuthentication() {
    try {
        // 1. Switch to JWT strategy
        console.log("1. Switching to JWT authentication strategy...")

        const authRouteDir = "src/app/api/auth/[...nextauth]"
        const currentRoute = path.join(authRouteDir, "route.ts")
        const jwtRoute = path.join(authRouteDir, "route-jwt.ts")
        const backupRoute = path.join(authRouteDir, "route-database-backup.ts")

        // Backup current route
        if (fs.existsSync(currentRoute)) {
            fs.copyFileSync(currentRoute, backupRoute)
            console.log("   ✅ Backed up current auth route")
        }

        // Replace with JWT route
        if (fs.existsSync(jwtRoute)) {
            fs.copyFileSync(jwtRoute, currentRoute)
            console.log("   ✅ Switched to JWT strategy")
        } else {
            console.log("   ⚠️  JWT route file not found, skipping...")
        }

        // 2. Check environment variables
        console.log("\n2. Checking environment variables...")

        const envPath = ".env.local"
        const requiredVars = [
            "NEXTAUTH_URL",
            "NEXTAUTH_SECRET",
            "GOOGLE_CLIENT_ID",
            "GOOGLE_CLIENT_SECRET",
            "MONGODB_URI"
        ]

        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, "utf8")
            const missingVars = requiredVars.filter(
                (varName) => !envContent.includes(varName + "=")
            )

            if (missingVars.length === 0) {
                console.log("   ✅ All environment variables are set")
            } else {
                console.log("   ⚠️  Missing variables:", missingVars.join(", "))
            }
        } else {
            console.log("   ❌ .env.local file not found")
            console.log("   📝 Creating .env.local template...")

            const envTemplate = `# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=183084025505-e5k0j4hnjivmncjgttllad7iicqou82t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# MongoDB
MONGODB_URI=mongodb://localhost:27017/devdost

# App Configuration
APP_URL=http://localhost:3000`

            fs.writeFileSync(envPath, envTemplate)
            console.log("   ✅ Created .env.local template")
        }

        // 3. Generate NextAuth secret if needed
        console.log("\n3. Checking NextAuth secret...")

        try {
            const newSecret = execSync("openssl rand -base64 32", {
                encoding: "utf8"
            }).trim()
            console.log(
                "   💡 Generated new secret (update .env.local if needed):"
            )
            console.log(`   NEXTAUTH_SECRET=${newSecret}`)
        } catch (error) {
            console.log("   ⚠️  OpenSSL not available, using fallback method")
            const fallbackSecret = require("crypto")
                .randomBytes(32)
                .toString("base64")
            console.log("   💡 Generated fallback secret:")
            console.log(`   NEXTAUTH_SECRET=${fallbackSecret}`)
        }

        // 4. Instructions for database reset
        console.log("\n4. Database cleanup (manual step required):")
        console.log("   If you still have issues, run these MongoDB commands:")
        console.log("   ```")
        console.log("   mongosh")
        console.log("   use devdost")
        console.log("   db.accounts.drop()")
        console.log("   db.sessions.drop()")
        console.log("   db.verification_tokens.drop()")
        console.log("   exit")
        console.log("   ```")

        // 5. Browser cleanup instructions
        console.log("\n5. Browser cleanup (manual step required):")
        console.log("   1. Open DevTools (F12)")
        console.log("   2. Go to Application/Storage tab")
        console.log("   3. Clear all cookies for localhost:3000")
        console.log("   4. Clear Local Storage and Session Storage")

        console.log("\n🎉 Authentication fix completed!")
        console.log("\nNext steps:")
        console.log("1. Restart your development server: npm run dev")
        console.log("2. Clear browser data as instructed above")
        console.log("3. Try signing in again")
        console.log("\nIf issues persist, check docs/AUTH_TROUBLESHOOTING.md")
    } catch (error) {
        console.error("❌ Error fixing authentication:", error.message)
        process.exit(1)
    }
}

fixAuthentication()
