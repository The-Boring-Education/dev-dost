"use client"

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useState } from "react"
import { Heart, X, Clock, Users, Star, Code2, MapPin } from "lucide-react"

interface ProjectCardProps {
    project: {
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
    onSwipe: (projectId: string, direction: "left" | "right") => void
    onCardRemove: () => void
    isTopCard: boolean
}

const difficultyColors = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-red-500"
}

const categoryEmojis: Record<string, string> = {
    fullstack: "🌐",
    frontend: "🎨",
    backend: "⚙️",
    mobile: "📱",
    "data-science": "📊",
    "machine-learning": "🤖",
    ai: "🧠",
    blockchain: "🔗",
    devops: "🚀",
    other: "🔧"
}

export function ProjectCard({
    project,
    onSwipe,
    onCardRemove,
    isTopCard
}: ProjectCardProps) {
    const [exitX, setExitX] = useState(0)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotate = useTransform(x, [-150, 150], [-30, 30])
    const opacity = useTransform(x, [-150, -50, 0, 50, 150], [0, 1, 1, 1, 0])

    // Color indicators for swipe direction
    const likeOpacity = useTransform(x, [10, 150], [0, 1])
    const rejectOpacity = useTransform(x, [-150, -10], [1, 0])

    const handleDragEnd = (event: any, info: PanInfo) => {
        const threshold = 100

        if (info.offset.x > threshold) {
            // Swipe right (like)
            setExitX(200)
            onSwipe(project._id, "right")
            setTimeout(onCardRemove, 300)
        } else if (info.offset.x < -threshold) {
            // Swipe left (reject)
            setExitX(-200)
            onSwipe(project._id, "left")
            setTimeout(onCardRemove, 300)
        }
    }

    const handleButtonSwipe = (direction: "left" | "right") => {
        setExitX(direction === "right" ? 200 : -200)
        onSwipe(project._id, direction)
        setTimeout(onCardRemove, 300)
    }

    return (
        <motion.div
            className='absolute inset-0 cursor-grab active:cursor-grabbing'
            style={{
                x,
                y,
                rotate,
                opacity,
                zIndex: isTopCard ? 10 : 1
            }}
            drag={isTopCard}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={exitX !== 0 ? { x: exitX } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileTap={isTopCard ? { scale: 1.05 } : {}}>
            <div className='relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200'>
                {/* Swipe Indicators */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className='absolute top-8 right-8 z-20 bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg transform rotate-12'>
                    <Heart className='w-6 h-6 inline mr-2' />
                    INTERESTED
                </motion.div>

                <motion.div
                    style={{ opacity: rejectOpacity }}
                    className='absolute top-8 left-8 z-20 bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg transform -rotate-12'>
                    <X className='w-6 h-6 inline mr-2' />
                    SKIP
                </motion.div>

                {/* Project Image/Header */}
                <div className='relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
                    <div className='text-center text-white'>
                        <div className='text-6xl mb-2'>
                            {categoryEmojis[project.category] || "🔧"}
                        </div>
                        <div className='text-sm font-medium opacity-90 uppercase tracking-wider'>
                            {project.category.replace("-", " ")}
                        </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div
                        className={`absolute top-4 left-4 ${
                            difficultyColors[
                                project.difficulty as keyof typeof difficultyColors
                            ]
                        } text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {project.difficulty}
                    </div>
                </div>

                {/* Project Content */}
                <div className='p-6 h-[calc(100%-12rem)] overflow-y-auto'>
                    <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2 leading-tight'>
                                {project.title}
                            </h2>
                            <div className='flex items-center text-gray-600 text-sm space-x-4 mb-3'>
                                <div className='flex items-center'>
                                    <Clock className='w-4 h-4 mr-1' />
                                    {project.estimatedDuration}
                                </div>
                                <div className='flex items-center'>
                                    <Users className='w-4 h-4 mr-1' />2
                                    developers
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-gray-700 leading-relaxed mb-6'>
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className='mb-6'>
                        <h3 className='font-semibold text-gray-900 mb-3 flex items-center'>
                            <Code2 className='w-4 h-4 mr-2' />
                            Tech Stack
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {project.techStack
                                .slice(0, 6)
                                .map((tech, index) => (
                                    <span
                                        key={index}
                                        className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
                                        {tech}
                                    </span>
                                ))}
                            {project.techStack.length > 6 && (
                                <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm'>
                                    +{project.techStack.length - 6} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className='mb-6'>
                        <h3 className='font-semibold text-gray-900 mb-3 flex items-center'>
                            <Star className='w-4 h-4 mr-2' />
                            Key Features
                        </h3>
                        <div className='space-y-2'>
                            {project.features
                                .slice(0, 4)
                                .map((feature, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center text-gray-700 text-sm'>
                                        <div className='w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0'></div>
                                        {feature}
                                    </div>
                                ))}
                            {project.features.length > 4 && (
                                <div className='text-gray-500 text-sm'>
                                    +{project.features.length - 4} more features
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className='mb-8'>
                        <h3 className='font-semibold text-gray-900 mb-3'>
                            Required Skills
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {project.requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium'>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {isTopCard && (
                    <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4'>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleButtonSwipe("left")}
                            className='bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200'>
                            <X className='w-6 h-6' />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleButtonSwipe("right")}
                            className='bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200'>
                            <Heart className='w-6 h-6' />
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
