import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
import ProjectInterest from "@/models/ProjectInterest"
import User from "@/models/User"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

        // Get project IDs that user has already swiped on
        const swipedProjectIds = await ProjectInterest.find({
            userId: user._id.toString()
        }).distinct("projectId")

        // Get projects that user hasn't swiped on yet
        const projects = await Project.find({
            _id: { $nin: swipedProjectIds },
            isActive: true,
            // Exclude user's own projects if they've created any
            createdBy: { $ne: user._id.toString() }
        })
            .sort({ createdAt: -1 }) // Newest first
            .limit(50) // Limit to prevent performance issues

        return NextResponse.json({
            projects,
            count: projects.length
        })
    } catch (error) {
        console.error("Error fetching projects for user:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
