import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
import ProjectInterest from "@/models/ProjectInterest"
import Match from "@/models/Match"
import User from "@/models/User"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session?.user?.email) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { projectId, interested } = req.body

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" })
        }

        await connectDB()

        // Get current user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // Verify project exists
        const project = await Project.findById(projectId)
        if (!project) {
            return res.status(404).json({ error: "Project not found" })
        }

        // Record the user's interest (or lack thereof)
        const existingInterest = await ProjectInterest.findOne({
            userId: user._id.toString(),
            projectId
        })

        if (existingInterest) {
            // Update existing interest
            existingInterest.interested = interested
            await existingInterest.save()
        } else {
            // Create new interest record
            await ProjectInterest.create({
                userId: user._id.toString(),
                projectId,
                interested
            })
        }

        let matchData = null

        // If user swiped right, check for potential matches
        if (interested) {
            // Find other users who also swiped right on this project
            const otherInterestedUsers = await ProjectInterest.find({
                projectId,
                userId: { $ne: user._id.toString() },
                interested: true
            })

            for (const otherInterest of otherInterestedUsers) {
                // Check if a match already exists
                const existingMatch = await Match.findOne({
                    projectId,
                    $or: [
                        {
                            user1Id: user._id.toString(),
                            user2Id: otherInterest.userId
                        },
                        {
                            user1Id: otherInterest.userId,
                            user2Id: user._id.toString()
                        }
                    ]
                })

                if (!existingMatch) {
                    // Create a new match
                    const newMatch = await Match.create({
                        projectId,
                        user1Id: user._id.toString(),
                        user2Id: otherInterest.userId,
                        status: "pending"
                    })

                    // Get the other user's information
                    const otherUser = await User.findById(otherInterest.userId)

                    matchData = {
                        matchId: newMatch._id,
                        projectTitle: project.title,
                        otherUserName: otherUser?.name || "Another developer",
                        otherUserEmail: otherUser?.email
                    }

                    // For now, we'll only return the first match found
                    break
                }
            }
        }

        return res.status(200).json({
            success: true,
            match: matchData,
            message: interested
                ? "Interest recorded!"
                : "Marked as not interested"
        })
    } catch (error) {
        console.error("Error handling swipe:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
