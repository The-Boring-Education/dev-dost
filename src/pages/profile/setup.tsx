"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
    User,
    Code,
    MapPin,
    MessageCircle,
    Phone,
    Mail,
    Github,
    Globe,
    ArrowRight,
    ArrowLeft,
    Check,
    Plus,
    X
} from "lucide-react"
import toast from "react-hot-toast"
import { techStackOptions, experienceOptions } from "@/lib/seedData"

interface FormData {
    bio: string
    skills: string[]
    location: string
    experience: "beginner" | "intermediate" | "advanced"
    interests: string[]
    contactPreferences: {
        whatsapp: string
        telegram: string
        email: string
    }
    githubProfile: string
    portfolioUrl: string
}

const STEPS = [
    { id: 1, title: "About You", description: "Tell us about yourself" },
    { id: 2, title: "Skills & Experience", description: "What do you know?" },
    { id: 3, title: "Interests & Goals", description: "What excites you?" },
    { id: 4, title: "Contact Info", description: "How can partners reach you?" }
]

export default function ProfileSetupPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [customSkill, setCustomSkill] = useState("")
    const [customInterest, setCustomInterest] = useState("")

    const [formData, setFormData] = useState<FormData>({
        bio: "",
        skills: [],
        location: "",
        experience: "beginner",
        interests: [],
        contactPreferences: {
            whatsapp: "",
            telegram: "",
            email: session?.user?.email || ""
        },
        githubProfile: "",
        portfolioUrl: ""
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
            return
        }

        if (session?.user?.profileCompleted) {
            router.push("/dashboard")
            return
        }

        // Set email from session
        if (session?.user?.email) {
            setFormData((prev) => ({
                ...prev,
                contactPreferences: {
                    ...prev.contactPreferences,
                    email: session.user.email!
                }
            }))
        }
    }, [session, status, router])

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleContactChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            contactPreferences: {
                ...prev.contactPreferences,
                [field]: value
            }
        }))
    }

    const addSkill = (skill: string) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill]
            }))
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove)
        }))
    }

    const addCustomSkill = () => {
        if (customSkill.trim()) {
            addSkill(customSkill.trim())
            setCustomSkill("")
        }
    }

    const addInterest = (interest: string) => {
        if (interest && !formData.interests.includes(interest)) {
            setFormData((prev) => ({
                ...prev,
                interests: [...prev.interests, interest]
            }))
        }
    }

    const removeInterest = (interestToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter(
                (interest) => interest !== interestToRemove
            )
        }))
    }

    const addCustomInterest = () => {
        if (customInterest.trim()) {
            addInterest(customInterest.trim())
            setCustomInterest("")
        }
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return (
                    formData.bio.trim().length >= 10 &&
                    formData.location.trim().length > 0
                )
            case 2:
                return formData.skills.length >= 2
            case 3:
                return formData.interests.length >= 1
            case 4:
                return formData.contactPreferences.email.includes("@")
            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
        } else {
            toast.error("Please complete all required fields")
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(4)) {
            toast.error("Please complete all required fields")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/user/complete-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                toast.success("Profile completed! Welcome to DevDost! 🎉")
                router.push("/dashboard")
            } else {
                toast.error("Failed to save profile. Please try again.")
            }
        } catch (error) {
            console.error("Error saving profile:", error)
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
                    <p className='text-white text-lg'>
                        Setting up your profile...
                    </p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    const interestOptions = [
        "Web Development",
        "Mobile Apps",
        "Machine Learning",
        "Data Science",
        "Blockchain",
        "Game Development",
        "AI/ChatGPT",
        "DevOps",
        "UI/UX Design",
        "Backend APIs",
        "Frontend Frameworks",
        "Cloud Computing",
        "Open Source",
        "Startup Ideas",
        "E-commerce",
        "Fintech",
        "Healthtech",
        "Edtech"
    ]

    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
            <Header />

            <main className='flex-1 container mx-auto px-4 py-8'>
                {/* Progress Bar */}
                <div className='max-w-2xl mx-auto mb-8'>
                    <div className='flex justify-between items-center mb-4'>
                        {STEPS.map((step, index) => (
                            <div key={step.id} className='flex items-center'>
                                <div
                                    className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${
                      currentStep >= step.id
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-white/20 text-gray-400"
                  }
                `}>
                                    {currentStep > step.id ? (
                                        <Check className='w-5 h-5' />
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`
                    w-16 h-1 mx-2
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
                <div className='max-w-2xl mx-auto'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20'>
                        <AnimatePresence mode='wait'>
                            {/* Step 1: About You */}
                            {currentStep === 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <User className='w-5 h-5 inline mr-2' />
                                            Bio (Tell us about yourself) *
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "bio",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="I'm a passionate developer who loves building innovative solutions..."
                                            className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none h-32 focus:outline-none focus:border-purple-500'
                                            maxLength={500}
                                        />
                                        <p className='text-gray-400 text-sm mt-1'>
                                            {formData.bio.length}/500 characters
                                            (minimum 10)
                                        </p>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <MapPin className='w-5 h-5 inline mr-2' />
                                            Location (City, Country) *
                                        </label>
                                        <input
                                            type='text'
                                            value={formData.location}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                            placeholder='San Francisco, USA'
                                            className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Skills & Experience */}
                            {currentStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <Code className='w-5 h-5 inline mr-2' />
                                            Experience Level *
                                        </label>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                            {experienceOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() =>
                                                        handleInputChange(
                                                            "experience",
                                                            option.value
                                                        )
                                                    }
                                                    className={`
                            p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${
                                formData.experience === option.value
                                    ? "border-purple-500 bg-purple-500/20"
                                    : "border-white/20 hover:border-white/40"
                            }
                          `}>
                                                    <div className='text-white font-medium'>
                                                        {option.label}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Your Skills * (Select at least 2)
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
                                                    placeholder='Add custom skill...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomSkill()
                                                    }
                                                />
                                                <button
                                                    onClick={addCustomSkill}
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
                                            {techStackOptions
                                                .slice(0, 12)
                                                .map((skill) => (
                                                    <button
                                                        key={skill}
                                                        onClick={() =>
                                                            addSkill(skill)
                                                        }
                                                        disabled={formData.skills.includes(
                                                            skill
                                                        )}
                                                        className={`
                            p-2 rounded-lg text-sm transition-all duration-200
                            ${
                                formData.skills.includes(skill)
                                    ? "bg-purple-500/50 text-purple-200 cursor-not-allowed"
                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40"
                            }
                          `}>
                                                        {skill}
                                                    </button>
                                                ))}
                                        </div>

                                        {formData.skills.length > 0 && (
                                            <div>
                                                <p className='text-gray-300 text-sm mb-2'>
                                                    Selected Skills:
                                                </p>
                                                <div className='flex flex-wrap gap-2'>
                                                    {formData.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={skill}
                                                                className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                                <span>
                                                                    {skill}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeSkill(
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
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Interests & Goals */}
                            {currentStep === 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            Project Interests * (What type of
                                            projects excite you?)
                                        </label>
                                        <div className='mb-4'>
                                            <div className='flex space-x-2'>
                                                <input
                                                    type='text'
                                                    value={customInterest}
                                                    onChange={(e) =>
                                                        setCustomInterest(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder='Add custom interest...'
                                                    className='flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        addCustomInterest()
                                                    }
                                                />
                                                <button
                                                    onClick={addCustomInterest}
                                                    className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors'>
                                                    <Plus className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
                                            {interestOptions.map((interest) => (
                                                <button
                                                    key={interest}
                                                    onClick={() =>
                                                        addInterest(interest)
                                                    }
                                                    disabled={formData.interests.includes(
                                                        interest
                                                    )}
                                                    className={`
                            p-2 rounded-lg text-sm transition-all duration-200
                            ${
                                formData.interests.includes(interest)
                                    ? "bg-purple-500/50 text-purple-200 cursor-not-allowed"
                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40"
                            }
                          `}>
                                                    {interest}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.interests.length > 0 && (
                                            <div>
                                                <p className='text-gray-300 text-sm mb-2'>
                                                    Selected Interests:
                                                </p>
                                                <div className='flex flex-wrap gap-2'>
                                                    {formData.interests.map(
                                                        (interest) => (
                                                            <span
                                                                key={interest}
                                                                className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1'>
                                                                <span>
                                                                    {interest}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeInterest(
                                                                            interest
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

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Github className='w-5 h-5 inline mr-2' />
                                                GitHub Profile (Optional)
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.githubProfile}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "githubProfile",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='https://github.com/yourusername'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Globe className='w-5 h-5 inline mr-2' />
                                                Portfolio Website (Optional)
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.portfolioUrl}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "portfolioUrl",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='https://yourportfolio.com'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Contact Info */}
                            {currentStep === 4 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='space-y-6'>
                                    <div className='mb-6'>
                                        <h3 className='text-white text-lg font-semibold mb-2'>
                                            How can your project partners
                                            contact you?
                                        </h3>
                                        <p className='text-gray-300 text-sm'>
                                            When you match with someone, they'll
                                            see your preferred contact methods.
                                        </p>
                                    </div>

                                    <div>
                                        <label className='block text-white font-medium mb-2'>
                                            <Mail className='w-5 h-5 inline mr-2' />
                                            Email * (Primary contact)
                                        </label>
                                        <input
                                            type='email'
                                            value={
                                                formData.contactPreferences
                                                    .email
                                            }
                                            onChange={(e) =>
                                                handleContactChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            readOnly
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <Phone className='w-5 h-5 inline mr-2' />
                                                WhatsApp (Optional)
                                            </label>
                                            <input
                                                type='tel'
                                                value={
                                                    formData.contactPreferences
                                                        .whatsapp
                                                }
                                                onChange={(e) =>
                                                    handleContactChange(
                                                        "whatsapp",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='+1234567890'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-white font-medium mb-2'>
                                                <MessageCircle className='w-5 h-5 inline mr-2' />
                                                Telegram (Optional)
                                            </label>
                                            <input
                                                type='text'
                                                value={
                                                    formData.contactPreferences
                                                        .telegram
                                                }
                                                onChange={(e) =>
                                                    handleContactChange(
                                                        "telegram",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder='@yourusername'
                                                className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                                            />
                                        </div>
                                    </div>

                                    <div className='bg-blue-500/20 border border-blue-500/30 rounded-xl p-4'>
                                        <h4 className='text-blue-200 font-medium mb-2'>
                                            Privacy Note
                                        </h4>
                                        <p className='text-blue-100 text-sm'>
                                            Your contact information will only
                                            be shared when you successfully
                                            match with another developer on a
                                            project. You can update this
                                            information anytime in your profile
                                            settings.
                                        </p>
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
                                            ? "Saving..."
                                            : "Complete Profile"}
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
