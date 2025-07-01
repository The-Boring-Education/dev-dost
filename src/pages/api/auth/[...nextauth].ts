import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { logAuthError, logAuthSuccess, checkEnvVars } from "@/lib/auth-debug"

// Check environment variables on startup
checkEnvVars()

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB()

                    logAuthSuccess("signIn callback", {
                        userEmail: user.email,
                        provider: account?.provider,
                        accountId: account?.providerAccountId
                    })

                    // Check if user exists in our User model
                    let existingUser = await User.findOne({ email: user.email })

                    if (!existingUser) {
                        // Create user in our User model
                        existingUser = await User.create({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            contactPreferences: {
                                email: user.email!
                            },
                            profileCompleted: false
                        })

                        logAuthSuccess("Creating new user", {
                            email: user.email
                        })
                    }

                    return true
                } catch (error) {
                    logAuthError(error, "signIn callback")
                    return false
                }
            }
            return true
        },
        async jwt({ token, user }) {
            // Persist user info in the token
            if (user) {
                try {
                    await connectDB()
                    const dbUser = await User.findOne({ email: user.email })

                    if (dbUser) {
                        token.id = dbUser._id.toString()
                        token.profileCompleted = dbUser.profileCompleted
                    }
                } catch (error) {
                    logAuthError(error, "JWT callback")
                }
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.profileCompleted =
                    token.profileCompleted as boolean

                logAuthSuccess("session callback", {
                    userId: session.user.id,
                    profileCompleted: session.user.profileCompleted
                })
            }
            return session
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
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === "development"
}

export default NextAuth(authOptions)
