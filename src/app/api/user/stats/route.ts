import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import ProjectInterest from "@/models/ProjectInterest"
import Match from "@/models/Match"
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

        const userId = user._id.toString()

        // Get total projects the user has seen (swiped on)
        const totalProjects = await ProjectInterest.countDocuments({
            userId
        })

        // Get projects user was interested in (swiped right)
        const interestedCount = await ProjectInterest.countDocuments({
            userId,
            interested: true
        })

        // Get matches count (where user is either user1 or user2)
        const matchesCount = await Match.countDocuments({
            $or: [{ user1Id: userId }, { user2Id: userId }]
        })

        // Additional stats for the profile
        const pendingMatches = await Match.countDocuments({
            $or: [{ user1Id: userId }, { user2Id: userId }],
            status: "pending"
        })

        const activeMatches = await Match.countDocuments({
            $or: [{ user1Id: userId }, { user2Id: userId }],
            status: "active"
        })

        return NextResponse.json({
            totalProjects,
            interestedCount,
            matchesCount,
            pendingMatches,
            activeMatches,
            profileCompleted: user.profileCompleted
        })
    } catch (error) {
        console.error("Error fetching user stats:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
