import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
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

        // Get query parameters for pagination and sorting
        const {
            page = "1",
            limit = "20",
            status,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query

        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Build filter query
        const filter: any = {
            createdBy: user._id.toString()
        }

        if (status && status !== "all") {
            filter.status = status
        }

        // Build sort query
        const sortQuery: any = {}
        sortQuery[sortBy as string] = sortOrder === "desc" ? -1 : 1

        // Fetch projects with pagination
        const projects = await Project.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum)
            .lean()

        // Get total count for pagination
        const totalProjects = await Project.countDocuments(filter)

        // Calculate pagination info
        const totalPages = Math.ceil(totalProjects / limitNum)
        const hasNextPage = pageNum < totalPages
        const hasPrevPage = pageNum > 1

        return res.status(200).json({
            projects,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalProjects,
                hasNextPage,
                hasPrevPage,
                limit: limitNum
            }
        })
    } catch (error) {
        console.error("Error fetching user projects:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
