import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { logAuthError, logAuthSuccess, checkEnvVars } from "@/lib/auth-debug"

// Check environment variables on startup
checkEnvVars()

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                logAuthSuccess("signIn callback", {
                    userEmail: user.email,
                    provider: account?.provider,
                    accountId: account?.providerAccountId
                })

                // Always return true to let NextAuth handle account linking
                return true
            } catch (error) {
                logAuthError(error, "signIn callback")
                return false
            }
        },
        async session({ session, user }) {
            try {
                await connectDB()

                if (session.user?.email) {
                    // Check if user exists in our custom User model
                    let dbUser = await User.findOne({
                        email: session.user.email
                    })

                    if (!dbUser) {
                        logAuthSuccess("Creating new user", {
                            email: session.user.email
                        })
                        // Create user in our User model if it doesn't exist
                        dbUser = await User.create({
                            email: session.user.email,
                            name: session.user.name || "",
                            image: session.user.image || "",
                            contactPreferences: {
                                email: session.user.email
                            },
                            profileCompleted: false
                        })
                    }

                    // Add custom fields to session
                    session.user.id = dbUser._id.toString()
                    session.user.profileCompleted = dbUser.profileCompleted

                    logAuthSuccess("session callback", {
                        userId: session.user.id,
                        profileCompleted: session.user.profileCompleted
                    })
                }

                return session
            } catch (error) {
                logAuthError(error, "session callback")
                return session
            }
        }
    },
    events: {
        async signIn(message) {
            logAuthSuccess("signIn event", message)
        },
        async signOut(message) {
            logAuthSuccess("signOut event", message)
        },
        async createUser(message) {
            logAuthSuccess("createUser event", message)
        },
        async linkAccount(message) {
            logAuthSuccess("linkAccount event", message)
        }
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error"
    },
    session: {
        strategy: "database"
    },
    debug: process.env.NODE_ENV === "development"
})

export { handler as GET, handler as POST }
