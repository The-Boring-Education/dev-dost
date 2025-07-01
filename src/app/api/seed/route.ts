import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"
import { predefinedProjects } from "@/lib/seedData"

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        // Check if predefined projects already exist
        const existingProjects = await Project.countDocuments({
            isPredefined: true
        })

        if (existingProjects > 0) {
            return NextResponse.json({
                message: "Predefined projects already exist",
                count: existingProjects
            })
        }

        // Insert predefined projects
        const insertedProjects = await Project.insertMany(
            predefinedProjects.map((project) => ({
                ...project,
                isActive: true
            }))
        )

        return NextResponse.json({
            message: "Database seeded successfully",
            count: insertedProjects.length,
            projects: insertedProjects.map((p) => ({
                id: p._id,
                title: p.title
            }))
        })
    } catch (error) {
        console.error("Error seeding database:", error)
        return NextResponse.json(
            { error: "Failed to seed database" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        await connectDB()

        const predefinedCount = await Project.countDocuments({
            isPredefined: true
        })
        const userCount = await Project.countDocuments({ isPredefined: false })

        return NextResponse.json({
            predefinedProjects: predefinedCount,
            userProjects: userCount,
            total: predefinedCount + userCount
        })
    } catch (error) {
        console.error("Error fetching project counts:", error)
        return NextResponse.json(
            { error: "Failed to fetch project counts" },
            { status: 500 }
        )
    }
}
