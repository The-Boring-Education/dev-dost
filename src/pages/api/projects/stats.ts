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
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session?.user?.email) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        await connectDB()

        // Get current user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const userId = user._id.toString()

        // Get project counts by status
        const [
            totalProjects,
            activeProjects,
            completedProjects,
            archivedProjects,
            inProgressProjects,
            draftProjects
        ] = await Promise.all([
            Project.countDocuments({ createdBy: userId }),
            Project.countDocuments({ createdBy: userId, status: "active" }),
            Project.countDocuments({ createdBy: userId, status: "completed" }),
            Project.countDocuments({ createdBy: userId, status: "archived" }),
            Project.countDocuments({ createdBy: userId, status: "in-progress" }),
            Project.countDocuments({ createdBy: userId, status: "draft" })
        ])

        // Get aggregated stats for user's projects
        const projectStats = await Project.aggregate([
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$viewCount" },
                    totalInterests: { $sum: "$interestCount" },
                    totalMatches: { $sum: "$matchCount" }
                }
            }
        ])

        const stats = projectStats[0] || {
            totalViews: 0,
            totalInterests: 0,
            totalMatches: 0
        }

        // Get most popular projects (top 5)
        const popularProjects = await Project.find({ createdBy: userId })
            .sort({ viewCount: -1 })
            .limit(5)
            .select("title viewCount interestCount matchCount")
            .lean()

        // Get recent activity (projects with recent interests)
        const recentActivity = await ProjectInterest.find({
            projectId: { 
                $in: await Project.find({ createdBy: userId }).distinct("_id") 
            },
            interested: true
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
                path: "projectId",
                select: "title"
            })
            .populate({
                path: "userId",
                select: "name email"
            })
            .lean()

        // Get conversion rates
        const conversionRates = {
            viewToInterest: stats.totalViews > 0 ? (stats.totalInterests / stats.totalViews * 100).toFixed(1) : "0",
            interestToMatch: stats.totalInterests > 0 ? (stats.totalMatches / stats.totalInterests * 100).toFixed(1) : "0"
        }

        return res.status(200).json({
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
            archived: archivedProjects,
            inProgress: inProgressProjects,
            draft: draftProjects,
            totalViews: stats.totalViews,
            totalInterests: stats.totalInterests,
            totalMatches: stats.totalMatches,
            popularProjects,
            recentActivity,
            conversionRates
        })

    } catch (error) {
        console.error("Error fetching project stats:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}