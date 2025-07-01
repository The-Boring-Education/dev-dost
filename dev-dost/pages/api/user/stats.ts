import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import ProjectInterest from "@/models/ProjectInterest";
import Match from "@/models/Match";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectDB();

    // Get current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id.toString();

    // Get total projects the user has seen (swiped on)
    const totalProjects = await ProjectInterest.countDocuments({
      userId,
    });

    // Get projects user was interested in (swiped right)
    const interestedCount = await ProjectInterest.countDocuments({
      userId,
      interested: true,
    });

    // Get matches count (where user is either user1 or user2)
    const matchesCount = await Match.countDocuments({
      $or: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    });

    // Additional stats for the profile
    const pendingMatches = await Match.countDocuments({
      $or: [
        { user1Id: userId },
        { user2Id: userId },
      ],
      status: "pending",
    });

    const activeMatches = await Match.countDocuments({
      $or: [
        { user1Id: userId },
        { user2Id: userId },
      ],
      status: "active",
    });

    return res.status(200).json({
      totalProjects,
      interestedCount,
      matchesCount,
      pendingMatches,
      activeMatches,
      profileCompleted: user.profileCompleted,
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}