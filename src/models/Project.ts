import mongoose, { Document, Schema } from "mongoose"

export interface IProject extends Document {
    title: string
    description: string
    techStack: string[]
    category:
        | "fullstack"
        | "frontend"
        | "backend"
        | "mobile"
        | "data-science"
        | "machine-learning"
        | "ai"
        | "blockchain"
        | "devops"
        | "other"
    difficulty: "beginner" | "intermediate" | "advanced"
    estimatedDuration: string // e.g., "2-4 weeks", "1-2 months"
    createdBy: string // "system" for predefined projects or userId for user-created
    isActive: boolean
    isPredefined: boolean
    features: string[]
    learningOutcomes: string[]
    requiredSkills: string[]
    image?: string
    githubRepo?: string
    liveDemo?: string
    
    // New fields for user-created projects
    teamSize: number // How many people needed for the project
    lookingFor: string[] // What kind of developers/skills they're looking for
    communicationPreference: string // Email, Discord, Slack, etc.
    timezone: string // User's timezone for coordination
    commitmentLevel: string // Full-time, Part-time, Weekend, etc.
    status: "draft" | "active" | "in-progress" | "completed" | "archived"
    viewCount: number // How many times the project has been viewed
    interestCount: number // How many people swiped right
    matchCount: number // How many matches this project has generated
    
    createdAt: Date
    updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 1000
        },
        techStack: [
            {
                type: String,
                required: true,
                trim: true
            }
        ],
        category: {
            type: String,
            required: true,
            enum: [
                "fullstack",
                "frontend",
                "backend",
                "mobile",
                "data-science",
                "machine-learning",
                "ai",
                "blockchain",
                "devops",
                "other"
            ]
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["beginner", "intermediate", "advanced"]
        },
        estimatedDuration: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isPredefined: {
            type: Boolean,
            default: false
        },
        features: [
            {
                type: String,
                trim: true
            }
        ],
        learningOutcomes: [
            {
                type: String,
                trim: true
            }
        ],
        requiredSkills: [
            {
                type: String,
                trim: true
            }
        ],
        image: {
            type: String,
            default: ""
        },
        githubRepo: {
            type: String,
            default: ""
        },
        liveDemo: {
            type: String,
            default: ""
        },
        teamSize: {
            type: Number,
            default: 2,
            min: 1,
            max: 10
        },
        lookingFor: [
            {
                type: String,
                trim: true
            }
        ],
        communicationPreference: {
            type: String,
            default: "Email",
            enum: ["Email", "Discord", "Slack", "Telegram", "WhatsApp", "Other"]
        },
        timezone: {
            type: String,
            default: "UTC"
        },
        commitmentLevel: {
            type: String,
            default: "Part-time",
            enum: ["Full-time", "Part-time", "Weekend", "Flexible"]
        },
        status: {
            type: String,
            default: "active",
            enum: ["draft", "active", "in-progress", "completed", "archived"]
        },
        viewCount: {
            type: Number,
            default: 0
        },
        interestCount: {
            type: Number,
            default: 0
        },
        matchCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

// Indexes for better query performance
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ difficulty: 1 })
ProjectSchema.index({ isActive: 1 })
ProjectSchema.index({ isPredefined: 1 })
ProjectSchema.index({ techStack: 1 })
ProjectSchema.index({ createdBy: 1 })
ProjectSchema.index({ status: 1 })
ProjectSchema.index({ viewCount: -1 })
ProjectSchema.index({ interestCount: -1 })
ProjectSchema.index({ matchCount: -1 })
ProjectSchema.index({ createdAt: -1 })
ProjectSchema.index({ teamSize: 1 })
ProjectSchema.index({ commitmentLevel: 1 })

const Project =
    mongoose.models.Project ||
    mongoose.model<IProject>("Project", ProjectSchema)

export default Project
