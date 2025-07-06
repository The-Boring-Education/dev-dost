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
    const { id } = req.query

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Project ID is required" })
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

        // Find the project
        const project = await Project.findById(id)
        if (!project) {
            return res.status(404).json({ error: "Project not found" })
        }

        // Check if user owns the project (for modification operations)
        const isOwner = project.createdBy === user._id.toString()

        switch (req.method) {
            case "GET":
                // Anyone can view a project (increment view count if not owner)
                if (!isOwner) {
                    await Project.findByIdAndUpdate(id, { 
                        $inc: { viewCount: 1 } 
                    })
                }

                return res.status(200).json({ project })

            case "PATCH":
                // Only owner can update project
                if (!isOwner) {
                    return res.status(403).json({ error: "Not authorized to update this project" })
                }

                const updateData = req.body
                
                // Validate status if being updated
                if (updateData.status && !["draft", "active", "in-progress", "completed", "archived"].includes(updateData.status)) {
                    return res.status(400).json({ error: "Invalid status value" })
                }

                // Validate other fields if present
                if (updateData.title && (updateData.title.length < 3 || updateData.title.length > 100)) {
                    return res.status(400).json({ error: "Title must be between 3 and 100 characters" })
                }

                if (updateData.description && (updateData.description.length < 50 || updateData.description.length > 1000)) {
                    return res.status(400).json({ error: "Description must be between 50 and 1000 characters" })
                }

                if (updateData.techStack && (!Array.isArray(updateData.techStack) || updateData.techStack.length === 0 || updateData.techStack.length > 15)) {
                    return res.status(400).json({ error: "Tech stack must have 1-15 technologies" })
                }

                if (updateData.teamSize && (updateData.teamSize < 1 || updateData.teamSize > 10)) {
                    return res.status(400).json({ error: "Team size must be between 1 and 10" })
                }

                // Update the project
                const updatedProject = await Project.findByIdAndUpdate(
                    id,
                    { 
                        ...updateData,
                        updatedAt: new Date()
                    },
                    { new: true, runValidators: true }
                )

                return res.status(200).json({
                    message: "Project updated successfully",
                    project: updatedProject
                })

            case "DELETE":
                // Only owner can delete project
                if (!isOwner) {
                    return res.status(403).json({ error: "Not authorized to delete this project" })
                }

                // Delete the project
                await Project.findByIdAndDelete(id)

                // Note: In a production app, you might want to also clean up related data:
                // - Remove project interests
                // - Remove matches related to this project
                // - Notify matched users about project deletion

                return res.status(200).json({
                    message: "Project deleted successfully"
                })

            default:
                return res.status(405).json({ error: "Method not allowed" })
        }

    } catch (error) {
        console.error(`Error handling ${req.method} request for project ${id}:`, error)
        return res.status(500).json({ error: "Internal server error" })
    }
}