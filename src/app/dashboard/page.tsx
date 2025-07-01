"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProjectCard } from "@/components/ProjectCard"
import { Heart, RefreshCw, Sparkles, Users, TrendingUp } from "lucide-react"
import toast from "react-hot-toast"

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
    image?: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalProjects: 0,
        interestedCount: 0,
        matchesCount: 0
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
            return
        }

        if (session?.user && !session.user.profileCompleted) {
            router.push("/profile/setup")
            return
        }
    }, [session, status, router])

    useEffect(() => {
        if (session?.user?.id) {
            loadProjects()
            loadStats()
        }
    }, [session?.user?.id])

    const loadProjects = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/projects/for-user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects || [])
                setCurrentIndex(0)
            } else {
                toast.error("Failed to load projects")
            }
        } catch (error) {
            console.error("Error loading projects:", error)
            toast.error("Error loading projects")
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const response = await fetch("/api/user/stats", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Error loading stats:", error)
        }
    }

    const handleSwipe = async (
        projectId: string,
        direction: "left" | "right"
    ) => {
        try {
            const response = await fetch("/api/projects/swipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    projectId,
                    interested: direction === "right"
                })
            })

            if (response.ok) {
                const data = await response.json()

                if (direction === "right") {
                    toast.success("Marked as interested! 💖")

                    if (data.match) {
                        toast.success(
                            `🎉 It's a match! You and ${data.match.otherUserName} both want to build this project!`,
                            {
                                duration: 5000
                            }
                        )
                    }
                }

                // Update stats
                loadStats()
            } else {
                toast.error("Failed to record swipe")
            }
        } catch (error) {
            console.error("Error recording swipe:", error)
            toast.error("Error recording swipe")
        }
    }

    const handleCardRemove = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1)
    }

    const resetCards = async () => {
        await loadProjects()
        toast.success("Projects refreshed! 🔄")
    }

    if (status === "loading" || loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4'></div>
                    <p className='text-white text-lg'>
                        Loading amazing projects for you...
                    </p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    const currentProjects = projects.slice(currentIndex, currentIndex + 3)
    const hasNoMoreProjects = currentIndex >= projects.length

    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
            <Header />

            <main className='flex-1 container mx-auto px-4 py-8'>
                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <div className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-white/80 text-sm'>
                                    Projects Seen
                                </p>
                                <p className='text-white text-2xl font-bold'>
                                    {stats.totalProjects}
                                </p>
                            </div>
                            <TrendingUp className='w-8 h-8 text-purple-400' />
                        </div>
                    </div>
                    <div className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-white/80 text-sm'>
                                    Interested In
                                </p>
                                <p className='text-white text-2xl font-bold'>
                                    {stats.interestedCount}
                                </p>
                            </div>
                            <Heart className='w-8 h-8 text-pink-400' />
                        </div>
                    </div>
                    <div className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-white/80 text-sm'>Matches</p>
                                <p className='text-white text-2xl font-bold'>
                                    {stats.matchesCount}
                                </p>
                            </div>
                            <Users className='w-8 h-8 text-green-400' />
                        </div>
                    </div>
                </motion.div>

                {/* Main Swipe Interface */}
                <div className='max-w-md mx-auto'>
                    {hasNoMoreProjects ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20'>
                            <Sparkles className='w-16 h-16 text-purple-400 mx-auto mb-4' />
                            <h2 className='text-2xl font-bold text-white mb-4'>
                                You've seen all projects!
                            </h2>
                            <p className='text-white/80 mb-6'>
                                Great job exploring! Check back later for new
                                projects or create your own.
                            </p>
                            <div className='space-y-3'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetCards}
                                    className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2'>
                                    <RefreshCw className='w-5 h-5' />
                                    <span>Refresh Projects</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        router.push("/create-project")
                                    }
                                    className='w-full border-2 border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200'>
                                    Create Your Own Project
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className='relative h-[600px]'>
                            <AnimatePresence>
                                {currentProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onSwipe={handleSwipe}
                                        onCardRemove={handleCardRemove}
                                        isTopCard={index === 0}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Instructions */}
                            {currentIndex === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className='absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center'>
                                    <p className='text-white/80 text-sm'>
                                        💡 Swipe right if interested, left to
                                        skip
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className='mt-8 flex justify-center space-x-4'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/matches")}
                            className='bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2'>
                            <Users className='w-5 h-5' />
                            <span>View Matches</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/create-project")}
                            className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2'>
                            <Sparkles className='w-5 h-5' />
                            <span>Create Project</span>
                        </motion.button>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
