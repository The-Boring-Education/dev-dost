import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
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
    async session({ session, user }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user?.email });
        
        if (dbUser && session.user) {
          session.user.id = dbUser._id.toString();
          session.user.profileCompleted = dbUser.profileCompleted;
        }
        
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database",
  },
});

export { handler as GET, handler as POST };