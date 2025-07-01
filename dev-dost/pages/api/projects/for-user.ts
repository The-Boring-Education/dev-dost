import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectInterest from "@/models/ProjectInterest";
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

    // Get project IDs that user has already swiped on
    const swipedProjectIds = await ProjectInterest.find({
      userId: user._id.toString(),
    }).distinct("projectId");

    // Get projects that user hasn't swiped on yet
    const projects = await Project.find({
      _id: { $nin: swipedProjectIds },
      isActive: true,
      // Exclude user's own projects if they've created any
      createdBy: { $ne: user._id.toString() },
    })
    .sort({ createdAt: -1 }) // Newest first
    .limit(50); // Limit to prevent performance issues

    return res.status(200).json({
      projects,
      count: projects.length,
    });

  } catch (error) {
    console.error("Error fetching projects for user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}