"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
    Plus,
    X,
    ArrowRight,
    ArrowLeft,
    Check,
    Code,
    Users,
    Clock,
    Globe,
    MessageCircle,
    Target,
    Lightbulb,
    Settings
} from "lucide-react"
import toast from "react-hot-toast"
import {
    techStackOptions,
    categoryOptions,
    difficultyOptions
} from "@/lib/seedData"

interface ProjectForm {
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
    githubRepo: string
    liveDemo: string
    lookingFor: string[]
    communicationPreference: string
    timezone: string
    commitmentLevel: string
}

const STEPS = [
    {
        id: 1,
        title: "Project Basics",
        description: "Title, description & category",
        icon: <Code className='w-5 h-5' />
    },
    {
        id: 2,
        title: "Technical Details",
        description: "Tech stack & difficulty",
        icon: <Settings className='w-5 h-5' />
    },
    {
        id: 3,
        title: "Features & Goals",
        description: "What you'll build",
        icon: <Target className='w-5 h-5' />
    },
    {
        id: 4,
        title: "Team & Collaboration",
        description: "Who you need",
        icon: <Users className='w-5 h-5' />
    }
]

const timezones = [
    "UTC",
    "EST",
    "PST",
    "GMT",
    "CET",
    "JST",
    "IST",
    "AEST",
    "CST"
]

const lookingForOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "QA Tester",
    "Technical Writer"
]

export default function CreateProjectPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [customTech, setCustomTech] = useState("")
    const [customFeature, setCustomFeature] = useState("")
    const [customOutcome, setCustomOutcome] = useState("")
    const [customSkill, setCustomSkill] = useState("")
    const [customLookingFor, setCustomLookingFor] = useState("")

    const [formData, setFormData] = useState<ProjectForm>({
        title: "",
        description: "",
        techStack: [],
        category: "",
        difficulty: "",
        estimatedDuration: "2-4 weeks",
        features: [],
        learningOutcomes: [],
        requiredSkills: [],
        teamSize: 2,
        githubRepo: "",
        liveDemo: "",
        lookingFor: [],
        communicationPreference: "Email",
        timezone: "UTC",
        commitmentLevel: "Part-time"
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
            return
        }

        if (session && !session.user.profileCompleted) {
            router.push("/profile/setup")
            return
        }
    }, [session, status, router])

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: ProjectForm) => ({
            ...prev,
            [field]: value
        }))
    }

    const addToArray = (field: string, value: string) => {
        if (value && !formData[field as keyof ProjectForm].includes(value)) {
            setFormData((prev: ProjectForm) => ({
                ...prev,
                [field]: [
                    ...(prev[field as keyof ProjectForm] as string[]),
                    value
                ]
            }))
        }
    }

    const removeFromArray = (field: string, valueToRemove: string) => {
        setFormData((prev: ProjectForm) => ({
            ...prev,
            [field]: (prev[field as keyof ProjectForm] as string[]).filter(
                (item) => item !== valueToRemove
            )
        }))
    }

    const addCustomItem = (
        field: string,
        customValue: string,
        setCustomValue: (value: string) => void
    ) => {
        if (customValue.trim()) {
            addToArray(field, customValue.trim())
            setCustomValue("")
        }
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return (
                    formData.title.length >= 3 &&
                    formData.description.length >= 50 &&
                    formData.category !== ""
                )
            case 2:
                return (
                    formData.techStack.length >= 1 && formData.difficulty !== ""
                )
            case 3:
                return (
                    formData.features.length >= 1 &&
                    formData.requiredSkills.length >= 1
                )
            case 4:
                return formData.lookingFor.length >= 1
            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev: number) => Math.min(prev + 1, STEPS.length))
        } else {
            toast.error("Please complete all required fields")
        }
    }

    const prevStep = () => {
        setCurrentStep((prev: number) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(4)) {
            toast.error("Please complete all required fields")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/projects/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const data = await response.json()
                toast.success("🎉 Project created successfully!")
                router.push("/projects/manage")
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to create project")
            }
        } catch (error) {
            console.error("Error creating project:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4'></div>
                    <p className='text-white text-lg'>Loading...</p>
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
                        Create Your Project 🚀
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-xl text-gray-300 max-w-2xl mx-auto'>
                        Share your project idea and find the perfect developers
                        to build it with you
                    </motion.p>
                </div>

                {/* Progress Bar */}
                <div className='max-w-4xl mx-auto mb-8'>
                    <div className='flex justify-between items-center mb-4'>
                        {STEPS.map((step, index) => (
                            <div key={step.id} className='flex items-center'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`
                                        relative w-12 h-12 rounded-full flex items-center justify-center font-semibold
                                        ${
                                            currentStep >= step.id
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                : "bg-white/20 text-gray-400"
                                        }
                                    `}>
                                    {currentStep > step.id ? (
                                        <Check className='w-5 h-5' />
                                    ) : (
                                        step.icon
                                    )}
                                </motion.div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`
                                            w-16 lg:w-24 h-1 mx-2
                                            ${
                                                currentStep > step.id
                                                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                                    : "bg-white/20"
                                            }
                                        `}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold text-white mb-2'>
                            {STEPS[currentStep - 1].title}
                        </h2>
                        <p className='text-gray-300'>
                            {STEPS[currentStep - 1].description}
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className='max-w-4xl mx-auto'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20'>
                        <AnimatePresence mode='wait'>
                            {/* Step 1: Project Basics */}
                            {currentStep === 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Project Title *
                                        </label>
                                        <input
                                            type='text'
                                            value={formData.title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder='e.g., AI-Powered Task Manager'
                                            className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            maxLength={100}
                                        />
                                        <p className='text-gray-400 text-sm mt-1'>
                                            {formData.title.length}/100
                                            characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Project Description *
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder='Describe your project idea, what problem it solves, and what makes it exciting...'
                                            className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none h-40 focus:outline-none focus:border-purple-500'
                                            maxLength={1000}
                                        />
                                        <p className='text-gray-400 text-sm mt-1'>
                                            {formData.description.length}/1000
                                            characters (minimum 50)
                                        </p>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Project Category *
                                        </label>
                                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                                            {categoryOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() =>
                                                        handleInputChange(
                                                            "category",
                                                            option.value
                                                        )
                                                    }
                                                    className={`
                                                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                                                        ${
                                                            formData.category ===
                                                            option.value
                                                                ? "border-purple-500 bg-purple-500/20"
                                                                : "border-white/20 hover:border-white/40"
                                                        }
                                                    `}>
                                                    <div className='text-2xl mb-2'>
                                                        {option.emoji}
                                                    </div>
                                                    <div className='text-white font-medium'>
                                                        {option.label}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Clock className='w-5 h-5 inline mr-2' />
                                                Estimated Duration
                                            </label>
                                            <select
                                                value={
                                                    formData.estimatedDuration
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "estimatedDuration",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500'>
                                                <option value='1-2 weeks'>
                                                    1-2 weeks
                                                </option>
                                                <option value='2-4 weeks'>
                                                    2-4 weeks
                                                </option>
                                                <option value='1-2 months'>
                                                    1-2 months
                                                </option>
                                                <option value='2-4 months'>
                                                    2-4 months
                                                </option>
                                                <option value='4+ months'>
                                                    4+ months
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                Difficulty Level *
                                            </label>
                                            <div className='space-y-2'>
                                                {difficultyOptions.map(
                                                    (option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() =>
                                                                handleInputChange(
                                                                    "difficulty",
                                                                    option.value
                                                                )
                                                            }
                                                            className={`
                                                            w-full p-3 rounded-xl border-2 transition-all duration-200 text-left
                                                            ${
                                                                formData.difficulty ===
                                                                option.value
                                                                    ? "border-purple-500 bg-purple-500/20"
                                                                    : "border-white/20 hover:border-white/40"
                                                            }
                                                        `}>
                                                            <div className='text-white font-medium'>
                                                                {option.label}
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Technical Details */}
                            {currentStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <Code className='w-5 h-5 inline mr-2' />
                                            Tech Stack * (Select technologies
                                            you'll use)
                                        </label>

                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customTech}
                                                    onChange={(e) =>
                                                        setCustomTech(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='Add custom technology...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomItem(
                                                            "techStack",
                                                            customTech,
                                                            setCustomTech
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        addCustomItem(
                                                            "techStack",
                                                            customTech,
                                                            setCustomTech
                                                        )
                                                    }
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4'>
                                            {techStackOptions
                                                .slice(0, 16)
                                                .map((tech) => (
                                                    <button
                                                        key={tech}
                                                        onClick={() =>
                                                            addToArray(
                                                                "techStack",
                                                                tech
                                                            )
                                                        }
                                                        disabled={formData.techStack.includes(
                                                            tech
                                                        )}
                                                        className={`
                                                        p-2 rounded-lg text-sm transition-all duration-200
                                                        ${
                                                            formData.techStack.includes(
                                                                tech
                                                            )
                                                                ? "bg-purple-500/50 text-purple-200 cursor-not-allowed"
                                                                : "bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40"
                                                        }
                                                    `}>
                                                        {tech}
                                                    </button>
                                                ))}
                                        </div>

                                        {formData.techStack.length > 0 && (
                                            <div>
                                                <p className='text-gray-300 text-sm mb-2'>
                                                    Selected Technologies:
                                                </p>
                                                <div className='flex flex-wrap gap-2'>
                                                    {formData.techStack.map(
                                                        (tech) => (
                                                            <span
                                                                key={tech}
                                                                className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                                <span>
                                                                    {tech}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeFromArray(
                                                                            "techStack",
                                                                            tech
                                                                        )
                                                                    }
                                                                    className='hover:bg-white/20 rounded-full p-0.5'>
                                                                    <X className='w-3 h-3' />
                                                                </button>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Features & Goals */}
                            {currentStep === 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <Target className='w-5 h-5 inline mr-2' />
                                            Key Features * (What will your
                                            project include?)
                                        </label>

                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customFeature}
                                                    onChange={(e) =>
                                                        setCustomFeature(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='e.g., User authentication, Real-time chat...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomItem(
                                                            "features",
                                                            customFeature,
                                                            setCustomFeature
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        addCustomItem(
                                                            "features",
                                                            customFeature,
                                                            setCustomFeature
                                                        )
                                                    }
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        {formData.features.length > 0 && (
                                            <div>
                                                <p className='text-gray-300 text-sm mb-2'>
                                                    Project Features:
                                                </p>
                                                <div className='space-y-2'>
                                                    {formData.features.map(
                                                        (feature, index) => (
                                                            <div
                                                                key={index}
                                                                className='flex items-center justify-between bg-white/5 rounded-lg p-3'>
                                                                <span className='text-white'>
                                                                    {feature}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeFromArray(
                                                                            "features",
                                                                            feature
                                                                        )
                                                                    }
                                                                    className='text-red-400 hover:text-red-300'>
                                                                    <X className='w-4 h-4' />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <Lightbulb className='w-5 h-5 inline mr-2' />
                                            Learning Outcomes (What will team
                                            members learn?)
                                        </label>

                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customOutcome}
                                                    onChange={(e) =>
                                                        setCustomOutcome(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='e.g., API development, React hooks...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomItem(
                                                            "learningOutcomes",
                                                            customOutcome,
                                                            setCustomOutcome
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        addCustomItem(
                                                            "learningOutcomes",
                                                            customOutcome,
                                                            setCustomOutcome
                                                        )
                                                    }
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        {formData.learningOutcomes.length >
                                            0 && (
                                            <div className='flex flex-wrap gap-2'>
                                                {formData.learningOutcomes.map(
                                                    (outcome) => (
                                                        <span
                                                            key={outcome}
                                                            className='bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                            <span>
                                                                {outcome}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    removeFromArray(
                                                                        "learningOutcomes",
                                                                        outcome
                                                                    )
                                                                }
                                                                className='hover:bg-white/20 rounded-full p-0.5'>
                                                                <X className='w-3 h-3' />
                                                            </button>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Required Skills * (What skills do
                                            team members need?)
                                        </label>

                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customSkill}
                                                    onChange={(e) =>
                                                        setCustomSkill(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='e.g., React, Node.js, MongoDB...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomItem(
                                                            "requiredSkills",
                                                            customSkill,
                                                            setCustomSkill
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        addCustomItem(
                                                            "requiredSkills",
                                                            customSkill,
                                                            setCustomSkill
                                                        )
                                                    }
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        {formData.requiredSkills.length > 0 && (
                                            <div className='flex flex-wrap gap-2'>
                                                {formData.requiredSkills.map(
                                                    (skill) => (
                                                        <span
                                                            key={skill}
                                                            className='bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                            <span>{skill}</span>
                                                            <button
                                                                onClick={() =>
                                                                    removeFromArray(
                                                                        "requiredSkills",
                                                                        skill
                                                                    )
                                                                }
                                                                className='hover:bg-white/20 rounded-full p-0.5'>
                                                                <X className='w-3 h-3' />
                                                            </button>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Team & Collaboration */}
                            {currentStep === 4 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Users className='w-5 h-5 inline mr-2' />
                                                Team Size
                                            </label>
                                            <select
                                                value={formData.teamSize}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "teamSize",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500'>
                                                {[
                                                    2, 3, 4, 5, 6, 7, 8, 9, 10
                                                ].map((size) => (
                                                    <option
                                                        key={size}
                                                        value={size}>
                                                        {size} people
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Clock className='w-5 h-5 inline mr-2' />
                                                Commitment Level
                                            </label>
                                            <select
                                                value={formData.commitmentLevel}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "commitmentLevel",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500'>
                                                <option value='Full-time'>
                                                    Full-time (40+ hrs/week)
                                                </option>
                                                <option value='Part-time'>
                                                    Part-time (10-20 hrs/week)
                                                </option>
                                                <option value='Weekend'>
                                                    Weekend (5-10 hrs/week)
                                                </option>
                                                <option value='Flexible'>
                                                    Flexible schedule
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Looking For * (What kind of
                                            developers do you need?)
                                        </label>

                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customLookingFor}
                                                    onChange={(e) =>
                                                        setCustomLookingFor(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='e.g., Experienced React Developer...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomItem(
                                                            "lookingFor",
                                                            customLookingFor,
                                                            setCustomLookingFor
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        addCustomItem(
                                                            "lookingFor",
                                                            customLookingFor,
                                                            setCustomLookingFor
                                                        )
                                                    }
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
                                            {lookingForOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() =>
                                                        addToArray(
                                                            "lookingFor",
                                                            option
                                                        )
                                                    }
                                                    disabled={formData.lookingFor.includes(
                                                        option
                                                    )}
                                                    className={`
                                                        p-2 rounded-lg text-sm transition-all duration-200
                                                        ${
                                                            formData.lookingFor.includes(
                                                                option
                                                            )
                                                                ? "bg-purple-500/50 text-purple-200 cursor-not-allowed"
                                                                : "bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40"
                                                        }
                                                    `}>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.lookingFor.length > 0 && (
                                            <div>
                                                <p className='text-gray-300 text-sm mb-2'>
                                                    Looking for:
                                                </p>
                                                <div className='flex flex-wrap gap-2'>
                                                    {formData.lookingFor.map(
                                                        (role) => (
                                                            <span
                                                                key={role}
                                                                className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                                <span>
                                                                    {role}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeFromArray(
                                                                            "lookingFor",
                                                                            role
                                                                        )
                                                                    }
                                                                    className='hover:bg-white/20 rounded-full p-0.5'>
                                                                    <X className='w-3 h-3' />
                                                                </button>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <MessageCircle className='w-5 h-5 inline mr-2' />
                                                Preferred Communication
                                            </label>
                                            <select
                                                value={
                                                    formData.communicationPreference
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "communicationPreference",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500'>
                                                <option value='Email'>
                                                    Email
                                                </option>
                                                <option value='Discord'>
                                                    Discord
                                                </option>
                                                <option value='Slack'>
                                                    Slack
                                                </option>
                                                <option value='Telegram'>
                                                    Telegram
                                                </option>
                                                <option value='WhatsApp'>
                                                    WhatsApp
                                                </option>
                                                <option value='Other'>
                                                    Other
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Globe className='w-5 h-5 inline mr-2' />
                                                Your Timezone
                                            </label>
                                            <select
                                                value={formData.timezone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "timezone",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500'>
                                                {timezones.map((tz) => (
                                                    <option key={tz} value={tz}>
                                                        {tz}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                GitHub Repository (Optional)
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.githubRepo}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "githubRepo",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='https://github.com/username/repo'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                Live Demo (Optional)
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.liveDemo}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "liveDemo",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='https://your-demo.com'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className='flex justify-between items-center mt-8 pt-6 border-t border-white/10'>
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className='flex items-center space-x-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200'>
                                <ArrowLeft className='w-4 h-4' />
                                <span>Previous</span>
                            </button>

                            {currentStep < STEPS.length ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!validateStep(currentStep)}
                                    className='flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200'>
                                    <span>Next</span>
                                    <ArrowRight className='w-4 h-4' />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        isLoading || !validateStep(currentStep)
                                    }
                                    className='flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all duration-200'>
                                    {isLoading ? (
                                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    ) : (
                                        <Check className='w-4 h-4' />
                                    )}
                                    <span>
                                        {isLoading
                                            ? "Creating..."
                                            : "Create Project"}
                                    </span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
