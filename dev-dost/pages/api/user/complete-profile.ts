import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      bio,
      skills,
      location,
      experience,
      interests,
      contactPreferences,
      githubProfile,
      portfolioUrl,
    } = req.body;

    // Validate required fields
    if (!bio || !skills || !location || !experience || !interests || !contactPreferences?.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (bio.length < 10) {
      return res.status(400).json({ error: "Bio must be at least 10 characters long" });
    }

    if (skills.length < 2) {
      return res.status(400).json({ error: "Please select at least 2 skills" });
    }

    if (interests.length < 1) {
      return res.status(400).json({ error: "Please select at least 1 interest" });
    }

    await connectDB();

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        bio,
        skills,
        location,
        experience,
        interests,
        contactPreferences: {
          email: contactPreferences.email,
          whatsapp: contactPreferences.whatsapp || "",
          telegram: contactPreferences.telegram || "",
        },
        githubProfile: githubProfile || "",
        portfolioUrl: portfolioUrl || "",
        profileCompleted: true,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile completed successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileCompleted: updatedUser.profileCompleted,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        location: updatedUser.location,
        experience: updatedUser.experience,
        interests: updatedUser.interests,
      },
    });

  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}