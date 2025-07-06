import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
import User from "@/models/User"
import { authOptions } from "../auth/[...nextauth]"

interface CreateProjectRequest {
    title: string
    description: string
    techStack: string[]
    category: string
    difficulty: string
    estimatedDuration: string
    features: string[]
    learningOutcomes: string[]
    requiredSkills: string[]
    teamSize: number
    githubRepo?: string
    liveDemo?: string
    lookingFor: string[]
    communicationPreference: string
    timezone: string
    commitmentLevel: string
}

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

        const {
            title,
            description,
            techStack,
            category,
            difficulty,
            estimatedDuration,
            features,
            learningOutcomes,
            requiredSkills,
            teamSize,
            githubRepo,
            liveDemo,
            lookingFor,
            communicationPreference,
            timezone,
            commitmentLevel
        }: CreateProjectRequest = req.body

        // Validate required fields
        if (!title || !description || !techStack || !category || !difficulty) {
            return res.status(400).json({
                error: "Missing required fields: title, description, techStack, category, difficulty"
            })
        }

        if (title.length < 3 || title.length > 100) {
            return res.status(400).json({
                error: "Title must be between 3 and 100 characters"
            })
        }

        if (description.length < 50 || description.length > 1000) {
            return res.status(400).json({
                error: "Description must be between 50 and 1000 characters"
            })
        }

        if (!techStack.length || techStack.length > 15) {
            return res.status(400).json({
                error: "Tech stack must have 1-15 technologies"
            })
        }

        if (!features.length || features.length > 20) {
            return res.status(400).json({
                error: "Features must have 1-20 items"
            })
        }

        if (!requiredSkills.length || requiredSkills.length > 10) {
            return res.status(400).json({
                error: "Required skills must have 1-10 items"
            })
        }

        await connectDB()

        // Get current user
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // Check if user has reached project limit (e.g., 5 active projects)
        const activeProjectsCount = await Project.countDocuments({
            createdBy: user._id.toString(),
            isActive: true
        })

        if (activeProjectsCount >= 5) {
            return res.status(400).json({
                error: "You have reached the maximum limit of 5 active projects"
            })
        }

        // Create the project
        const newProject = await Project.create({
            title: title.trim(),
            description: description.trim(),
            techStack: techStack.map(tech => tech.trim()),
            category,
            difficulty,
            estimatedDuration: estimatedDuration || "2-4 weeks",
            features: features.map(feature => feature.trim()),
            learningOutcomes: learningOutcomes?.map(outcome => outcome.trim()) || [],
            requiredSkills: requiredSkills.map(skill => skill.trim()),
            teamSize: teamSize || 2,
            githubRepo: githubRepo?.trim() || "",
            liveDemo: liveDemo?.trim() || "",
            lookingFor: lookingFor || [],
            communicationPreference: communicationPreference || "Email",
            timezone: timezone || "UTC",
            commitmentLevel: commitmentLevel || "Part-time",
            createdBy: user._id.toString(),
            isActive: true,
            isPredefined: false
        })

        return res.status(201).json({
            message: "Project created successfully",
            project: {
                id: newProject._id,
                title: newProject.title,
                description: newProject.description,
                techStack: newProject.techStack,
                category: newProject.category,
                difficulty: newProject.difficulty,
                createdAt: newProject.createdAt
            }
        })

    } catch (error) {
        console.error("Error creating project:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}