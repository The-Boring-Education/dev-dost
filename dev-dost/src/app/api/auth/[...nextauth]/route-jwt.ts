import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          
          // Check if user exists in our User model
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create user in our User model
            existingUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              contactPreferences: {
                email: user.email!,
              },
              profileCompleted: false,
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Persist user info in the token
      if (user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.profileCompleted = dbUser.profileCompleted;
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.profileCompleted = token.profileCompleted as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };