"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Heart,
    Users,
    Calendar,
    Code,
    MoreVertical,
    AlertCircle,
    CheckCircle,
    Clock,
    Archive,
    Play,
    Pause
} from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

interface Project {
    _id: string
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
    status: "draft" | "active" | "in-progress" | "completed" | "archived"
    viewCount: number
    interestCount: number
    matchCount: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface ProjectStats {
    total: number
    active: number
    completed: number
    archived: number
    totalViews: number
    totalInterests: number
    totalMatches: number
}

const statusColors = {
    draft: "bg-gray-500",
    active: "bg-green-500",
    "in-progress": "bg-blue-500",
    completed: "bg-purple-500",
    archived: "bg-gray-600"
}

const statusIcons = {
    draft: <Edit className='w-4 h-4' />,
    active: <Play className='w-4 h-4' />,
    "in-progress": <Clock className='w-4 h-4' />,
    completed: <CheckCircle className='w-4 h-4' />,
    archived: <Archive className='w-4 h-4' />
}

export default function ManageProjectsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [stats, setStats] = useState<ProjectStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<
        "all" | "active" | "completed" | "archived"
    >("all")
    const [sortBy, setSortBy] = useState<
        "newest" | "oldest" | "popular" | "matches"
    >("newest")
    const [selectedProject, setSelectedProject] = useState<string | null>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
            return
        }

        if (session && !session.user.profileCompleted) {
            router.push("/profile/setup")
            return
        }

        if (session) {
            fetchProjects()
            fetchStats()
        }
    }, [session, status, router])

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects/my-projects")
            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects)
            } else {
                toast.error("Failed to load projects")
            }
        } catch (error) {
            console.error("Error fetching projects:", error)
            toast.error("Failed to load projects")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/projects/stats")
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
        }
    }

    const updateProjectStatus = async (
        projectId: string,
        newStatus: string
    ) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                toast.success("Project status updated!")
                fetchProjects()
                fetchStats()
            } else {
                toast.error("Failed to update project status")
            }
        } catch (error) {
            console.error("Error updating project:", error)
            toast.error("Failed to update project")
        }
    }

    const deleteProject = async (projectId: string) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this project? This action cannot be undone."
            )
        ) {
            return
        }

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                toast.success("Project deleted successfully!")
                fetchProjects()
                fetchStats()
            } else {
                toast.error("Failed to delete project")
            }
        } catch (error) {
            console.error("Error deleting project:", error)
            toast.error("Failed to delete project")
        }
    }

    const filteredProjects = projects.filter((project) => {
        if (filter === "all") return true
        if (filter === "active") return project.status === "active"
        if (filter === "completed") return project.status === "completed"
        if (filter === "archived") return project.status === "archived"
        return true
    })

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
            case "oldest":
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
            case "popular":
                return b.viewCount - a.viewCount
            case "matches":
                return b.matchCount - a.matchCount
            default:
                return 0
        }
    })

    if (status === "loading" || isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4'></div>
                    <p className='text-white text-lg'>
                        Loading your projects...
                    </p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
            <Header />

            <main className='flex-1 container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-4xl md:text-5xl font-bold text-white mb-4'>
                        My Projects 📁
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-xl text-gray-300 max-w-2xl mx-auto'>
                        Manage your project ideas and track their progress
                    </motion.p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg'>
                                    <Code className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.total}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Total Projects
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg'>
                                    <Play className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.active}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Active Projects
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg'>
                                    <Eye className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.totalViews}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Total Views
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg'>
                                    <Users className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.totalMatches}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Total Matches
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Actions & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='flex flex-col md:flex-row justify-between items-center gap-4 mb-8'>
                    <div className='flex flex-wrap gap-4'>
                        {/* Filter Buttons */}
                        <div className='flex space-x-2'>
                            {[
                                { key: "all", label: "All" },
                                { key: "active", label: "Active" },
                                { key: "completed", label: "Completed" },
                                { key: "archived", label: "Archived" }
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() =>
                                        setFilter(filterOption.key as any)
                                    }
                                    className={`
                                        px-4 py-2 rounded-lg transition-all duration-200
                                        ${
                                            filter === filterOption.key
                                                ? "bg-purple-500 text-white"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }
                                    `}>
                                    {filterOption.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className='bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500'>
                            <option value='newest'>Newest First</option>
                            <option value='oldest'>Oldest First</option>
                            <option value='popular'>Most Popular</option>
                            <option value='matches'>Most Matches</option>
                        </select>
                    </div>

                    {/* Create Project Button */}
                    <Link href='/projects/create'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200'>
                            <Plus className='w-5 h-5' />
                            <span>Create New Project</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <AnimatePresence>
                        {sortedProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ delay: index * 0.1 }}
                                className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200'>
                                {/* Project Header */}
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex-1'>
                                        <h3 className='text-xl font-bold text-white mb-2 line-clamp-2'>
                                            {project.title}
                                        </h3>
                                        <div className='flex items-center space-x-2 mb-2'>
                                            <span
                                                className={`
                                                flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white
                                                ${statusColors[project.status]}
                                            `}>
                                                {statusIcons[project.status]}
                                                <span className='capitalize'>
                                                    {project.status}
                                                </span>
                                            </span>
                                            <span className='text-gray-400 text-sm capitalize'>
                                                {project.category.replace(
                                                    "-",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='relative'>
                                        <button
                                            onClick={() =>
                                                setSelectedProject(
                                                    selectedProject ===
                                                        project._id
                                                        ? null
                                                        : project._id
                                                )
                                            }
                                            className='text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10'>
                                            <MoreVertical className='w-5 h-5' />
                                        </button>

                                        {selectedProject === project._id && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1
                                                }}
                                                className='absolute right-0 top-full mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10 min-w-[200px]'>
                                                <Link
                                                    href={`/projects/${project._id}`}>
                                                    <div className='flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded-t-lg cursor-pointer'>
                                                        <Eye className='w-4 h-4' />
                                                        <span>
                                                            View Details
                                                        </span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={`/projects/${project._id}/edit`}>
                                                    <div className='flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 cursor-pointer'>
                                                        <Edit className='w-4 h-4' />
                                                        <span>
                                                            Edit Project
                                                        </span>
                                                    </div>
                                                </Link>

                                                <div className='border-t border-gray-700'>
                                                    <button
                                                        onClick={() =>
                                                            updateProjectStatus(
                                                                project._id,
                                                                project.status ===
                                                                    "active"
                                                                    ? "archived"
                                                                    : "active"
                                                            )
                                                        }
                                                        className='flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 w-full text-left'>
                                                        {project.status ===
                                                        "active" ? (
                                                            <>
                                                                <Archive className='w-4 h-4' />
                                                                <span>
                                                                    Archive
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play className='w-4 h-4' />
                                                                <span>
                                                                    Activate
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className='border-t border-gray-700'>
                                                    <button
                                                        onClick={() =>
                                                            deleteProject(
                                                                project._id
                                                            )
                                                        }
                                                        className='flex items-center space-x-2 px-4 py-2 hover:bg-red-600 w-full text-left text-red-400 hover:text-white rounded-b-lg'>
                                                        <Trash2 className='w-4 h-4' />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Project Description */}
                                <p className='text-gray-300 text-sm mb-4 line-clamp-3'>
                                    {project.description}
                                </p>

                                {/* Tech Stack */}
                                <div className='mb-4'>
                                    <div className='flex flex-wrap gap-1'>
                                        {project.techStack
                                            .slice(0, 4)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className='bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs'>
                                                    {tech}
                                                </span>
                                            ))}
                                        {project.techStack.length > 4 && (
                                            <span className='bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs'>
                                                +{project.techStack.length - 4}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Project Stats */}
                                <div className='grid grid-cols-3 gap-4 text-center text-sm'>
                                    <div>
                                        <div className='text-white font-semibold'>
                                            {project.viewCount}
                                        </div>
                                        <div className='text-gray-400'>
                                            Views
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-white font-semibold'>
                                            {project.interestCount}
                                        </div>
                                        <div className='text-gray-400'>
                                            Interests
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-white font-semibold'>
                                            {project.matchCount}
                                        </div>
                                        <div className='text-gray-400'>
                                            Matches
                                        </div>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div className='mt-4 pt-4 border-t border-white/10'>
                                    <div className='flex items-center justify-between text-sm text-gray-400'>
                                        <span>
                                            Created{" "}
                                            {new Date(
                                                project.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                        <span>
                                            Team: {project.teamSize} people
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {sortedProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='text-center py-16'>
                        <div className='bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto'>
                            <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-6' />
                            <h2 className='text-2xl font-bold text-white mb-4'>
                                {filter === "all"
                                    ? "No Projects Yet"
                                    : `No ${filter} Projects`}
                            </h2>
                            <p className='text-gray-300 mb-8'>
                                {filter === "all"
                                    ? "Start by creating your first project and find developers to collaborate with."
                                    : `You don't have any ${filter} projects at the moment.`}
                            </p>
                            <Link href='/projects/create'>
                                <button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200'>
                                    Create Your First Project
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    )
}
