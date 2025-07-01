import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
import ProjectInterest from "@/models/ProjectInterest"
import Match from "@/models/Match"
import User from "@/models/User"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { projectId, interested } = await request.json()

        if (!projectId) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            )
        }

        await connectDB()

        // Get current user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Verify project exists
        const project = await Project.findById(projectId)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
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

        return NextResponse.json({
            success: true,
            match: matchData,
            message: interested
                ? "Interest recorded!"
                : "Marked as not interested"
        })
    } catch (error) {
        console.error("Error handling swipe:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
