"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
    Heart,
    Users,
    Mail,
    Phone,
    MessageCircle,
    Github,
    Globe,
    MapPin,
    Clock,
    Code,
    Star,
    Filter,
    Search,
    ExternalLink,
    Calendar,
    CheckCircle,
    X,
    AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

interface Match {
    _id: string
    projectId: {
        _id: string
        title: string
        description: string
        techStack: string[]
        category: string
        difficulty: string
        estimatedDuration: string
    }
    otherUser: {
        _id: string
        name: string
        email: string
        image?: string
        bio?: string
        skills: string[]
        location?: string
        experience: string
        contactPreferences: {
            whatsapp?: string
            telegram?: string
            email: string
        }
        githubProfile?: string
        portfolioUrl?: string
    }
    status: "pending" | "active" | "completed" | "cancelled"
    matchedAt: string
    conversationStarted: boolean
    notes?: string
}

interface MatchStats {
    total: number
    pending: number
    active: number
    completed: number
    cancelled: number
}

const statusColors = {
    pending: "bg-yellow-500",
    active: "bg-green-500",
    completed: "bg-purple-500",
    cancelled: "bg-red-500"
}

const experienceColors = {
    beginner: "bg-green-500/20 text-green-200",
    intermediate: "bg-yellow-500/20 text-yellow-200",
    advanced: "bg-red-500/20 text-red-200"
}

export default function MatchesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [matches, setMatches] = useState<Match[]>([])
    const [stats, setStats] = useState<MatchStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<
        "all" | "pending" | "active" | "completed"
    >("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

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
            fetchMatches()
            fetchStats()
        }
    }, [session, status, router])

    const fetchMatches = async () => {
        try {
            const response = await fetch("/api/matches")
            if (response.ok) {
                const data = await response.json()
                setMatches(data.matches)
            } else {
                toast.error("Failed to load matches")
            }
        } catch (error) {
            console.error("Error fetching matches:", error)
            toast.error("Failed to load matches")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/matches/stats")
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Error fetching match stats:", error)
        }
    }

    const updateMatchStatus = async (matchId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/matches/${matchId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                toast.success("Match status updated!")
                fetchMatches()
                fetchStats()
            } else {
                toast.error("Failed to update match status")
            }
        } catch (error) {
            console.error("Error updating match:", error)
            toast.error("Failed to update match")
        }
    }

    const markConversationStarted = async (matchId: string) => {
        try {
            const response = await fetch(`/api/matches/${matchId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ conversationStarted: true })
            })

            if (response.ok) {
                toast.success("Great! Marked as contacted.")
                fetchMatches()
            } else {
                toast.error("Failed to update match")
            }
        } catch (error) {
            console.error("Error updating match:", error)
            toast.error("Failed to update match")
        }
    }

    const filteredMatches = matches.filter((match) => {
        const matchesFilter = filter === "all" || match.status === filter
        const matchesSearch =
            !searchTerm ||
            match.projectId.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            match.otherUser.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            match.projectId.techStack.some((tech) =>
                tech.toLowerCase().includes(searchTerm.toLowerCase())
            )

        return matchesFilter && matchesSearch
    })

    const sortedMatches = [...filteredMatches].sort((a, b) => {
        return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime()
    })

    if (status === "loading" || isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4'></div>
                    <p className='text-white text-lg'>
                        Loading your matches...
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
                        My Matches 💫
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-xl text-gray-300 max-w-2xl mx-auto'>
                        Connect with developers who share your project interests
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
                                    <Heart className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.total}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Total Matches
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg'>
                                    <CheckCircle className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.active}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Active Matches
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg'>
                                    <Clock className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.pending}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Pending
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg'>
                                    <Star className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats.completed}
                                    </div>
                                    <div className='text-gray-300 text-sm'>
                                        Completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Filters & Search */}
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
                                { key: "pending", label: "Pending" },
                                { key: "active", label: "Active" },
                                { key: "completed", label: "Completed" }
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
                    </div>

                    {/* Search */}
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Search by project, developer, or tech...'
                            className='pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full md:w-80'
                        />
                    </div>
                </motion.div>

                {/* Matches Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <AnimatePresence>
                        {sortedMatches.map((match, index) => (
                            <motion.div
                                key={match._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ delay: index * 0.1 }}
                                className='bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200'>
                                {/* Match Header */}
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex items-center space-x-3'>
                                        <img
                                            src={
                                                match.otherUser.image ||
                                                "/default-avatar.png"
                                            }
                                            alt={match.otherUser.name}
                                            className='w-12 h-12 rounded-full border-2 border-white/20'
                                        />
                                        <div>
                                            <h3 className='text-lg font-bold text-white'>
                                                {match.otherUser.name}
                                            </h3>
                                            <p className='text-gray-300 text-sm capitalize'>
                                                {match.otherUser.experience}{" "}
                                                Developer
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                        px-3 py-1 rounded-full text-xs font-medium text-white
                                        ${statusColors[match.status]}
                                    `}>
                                        {match.status}
                                    </span>
                                </div>

                                {/* Project Info */}
                                <div className='mb-4 p-4 bg-white/5 rounded-lg'>
                                    <h4 className='text-white font-semibold mb-2'>
                                        📁 {match.projectId.title}
                                    </h4>
                                    <p className='text-gray-300 text-sm mb-3 line-clamp-2'>
                                        {match.projectId.description}
                                    </p>
                                    <div className='flex flex-wrap gap-1'>
                                        {match.projectId.techStack
                                            .slice(0, 4)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className='bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs'>
                                                    {tech}
                                                </span>
                                            ))}
                                        {match.projectId.techStack.length >
                                            4 && (
                                            <span className='bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs'>
                                                +
                                                {match.projectId.techStack
                                                    .length - 4}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Developer Info */}
                                <div className='mb-4'>
                                    <div className='flex items-center space-x-4 text-sm text-gray-300 mb-2'>
                                        {match.otherUser.location && (
                                            <div className='flex items-center space-x-1'>
                                                <MapPin className='w-4 h-4' />
                                                <span>
                                                    {match.otherUser.location}
                                                </span>
                                            </div>
                                        )}
                                        <div className='flex items-center space-x-1'>
                                            <Calendar className='w-4 h-4' />
                                            <span>
                                                Matched{" "}
                                                {new Date(
                                                    match.matchedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {match.otherUser.bio && (
                                        <p className='text-gray-300 text-sm line-clamp-2 mb-3'>
                                            {match.otherUser.bio}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    <div className='flex flex-wrap gap-1 mb-3'>
                                        {match.otherUser.skills
                                            .slice(0, 5)
                                            .map((skill) => (
                                                <span
                                                    key={skill}
                                                    className='bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs'>
                                                    {skill}
                                                </span>
                                            ))}
                                        {match.otherUser.skills.length > 5 && (
                                            <span className='bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs'>
                                                +
                                                {match.otherUser.skills.length -
                                                    5}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className='border-t border-white/10 pt-4'>
                                    <h5 className='text-white font-medium mb-3'>
                                        Contact Information:
                                    </h5>
                                    <div className='space-y-2'>
                                        <div className='flex items-center space-x-2 text-sm'>
                                            <Mail className='w-4 h-4 text-gray-400' />
                                            <a
                                                href={`mailto:${match.otherUser.contactPreferences.email}`}
                                                className='text-blue-300 hover:text-blue-200 transition-colors'>
                                                {
                                                    match.otherUser
                                                        .contactPreferences
                                                        .email
                                                }
                                            </a>
                                        </div>

                                        {match.otherUser.contactPreferences
                                            .whatsapp && (
                                            <div className='flex items-center space-x-2 text-sm'>
                                                <Phone className='w-4 h-4 text-gray-400' />
                                                <a
                                                    href={`https://wa.me/${match.otherUser.contactPreferences.whatsapp}`}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-green-300 hover:text-green-200 transition-colors flex items-center space-x-1'>
                                                    <span>
                                                        {
                                                            match.otherUser
                                                                .contactPreferences
                                                                .whatsapp
                                                        }
                                                    </span>
                                                    <ExternalLink className='w-3 h-3' />
                                                </a>
                                            </div>
                                        )}

                                        {match.otherUser.contactPreferences
                                            .telegram && (
                                            <div className='flex items-center space-x-2 text-sm'>
                                                <MessageCircle className='w-4 h-4 text-gray-400' />
                                                <a
                                                    href={`https://t.me/${match.otherUser.contactPreferences.telegram}`}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-300 hover:text-blue-200 transition-colors flex items-center space-x-1'>
                                                    <span>
                                                        {
                                                            match.otherUser
                                                                .contactPreferences
                                                                .telegram
                                                        }
                                                    </span>
                                                    <ExternalLink className='w-3 h-3' />
                                                </a>
                                            </div>
                                        )}

                                        {match.otherUser.githubProfile && (
                                            <div className='flex items-center space-x-2 text-sm'>
                                                <Github className='w-4 h-4 text-gray-400' />
                                                <a
                                                    href={
                                                        match.otherUser
                                                            .githubProfile
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-purple-300 hover:text-purple-200 transition-colors flex items-center space-x-1'>
                                                    <span>GitHub Profile</span>
                                                    <ExternalLink className='w-3 h-3' />
                                                </a>
                                            </div>
                                        )}

                                        {match.otherUser.portfolioUrl && (
                                            <div className='flex items-center space-x-2 text-sm'>
                                                <Globe className='w-4 h-4 text-gray-400' />
                                                <a
                                                    href={
                                                        match.otherUser
                                                            .portfolioUrl
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-yellow-300 hover:text-yellow-200 transition-colors flex items-center space-x-1'>
                                                    <span>Portfolio</span>
                                                    <ExternalLink className='w-3 h-3' />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-wrap gap-2 mt-4'>
                                    {!match.conversationStarted &&
                                        match.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    markConversationStarted(
                                                        match._id
                                                    )
                                                }
                                                className='flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors'>
                                                <CheckCircle className='w-4 h-4' />
                                                <span>Mark as Contacted</span>
                                            </button>
                                        )}

                                    {match.status === "pending" && (
                                        <button
                                            onClick={() =>
                                                updateMatchStatus(
                                                    match._id,
                                                    "active"
                                                )
                                            }
                                            className='flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors'>
                                            <Users className='w-4 h-4' />
                                            <span>Start Collaboration</span>
                                        </button>
                                    )}

                                    {match.status === "active" && (
                                        <button
                                            onClick={() =>
                                                updateMatchStatus(
                                                    match._id,
                                                    "completed"
                                                )
                                            }
                                            className='flex items-center space-x-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors'>
                                            <Star className='w-4 h-4' />
                                            <span>Mark Complete</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {sortedMatches.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='text-center py-16'>
                        <div className='bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto'>
                            <Heart className='w-16 h-16 text-gray-400 mx-auto mb-6' />
                            <h2 className='text-2xl font-bold text-white mb-4'>
                                {filter === "all"
                                    ? "No Matches Yet"
                                    : `No ${filter} Matches`}
                            </h2>
                            <p className='text-gray-300 mb-8'>
                                {filter === "all"
                                    ? "Start swiping on projects to find your perfect development partners!"
                                    : `You don't have any ${filter} matches at the moment.`}
                            </p>
                            <Link href='/dashboard'>
                                <button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200'>
                                    Find Matches
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
