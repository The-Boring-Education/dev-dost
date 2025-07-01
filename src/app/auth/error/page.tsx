"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, RefreshCw, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

const errorMessages: Record<
    string,
    { title: string; description: string; solution: string }
> = {
    OAuthAccountNotLinked: {
        title: "Account Linking Issue",
        description:
            "This email is already associated with another account method.",
        solution:
            "Please try signing in with the method you used previously, or contact support if you need help."
    },
    OAuthCallbackError: {
        title: "Authentication Failed",
        description: "There was an error during the sign-in process.",
        solution:
            "Please try signing in again. If the problem persists, check your internet connection."
    },
    AccessDenied: {
        title: "Access Denied",
        description: "You don't have permission to access this application.",
        solution: "Please contact support if you believe this is an error."
    },
    Verification: {
        title: "Verification Required",
        description: "Please check your email and click the verification link.",
        solution: "If you didn't receive an email, please try signing in again."
    },
    Default: {
        title: "Authentication Error",
        description: "An unexpected error occurred during sign-in.",
        solution: "Please try again or contact support if the issue persists."
    }
}

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get("error") || "Default"

    const errorInfo = errorMessages[error] || errorMessages.Default

    const handleRetry = () => {
        router.push("/auth/signin")
    }

    const handleClearSession = async () => {
        // Clear any potential session conflicts
        try {
            await fetch("/api/auth/signout", { method: "POST" })
            router.push("/auth/signin")
        } catch (err) {
            console.error("Error clearing session:", err)
            router.push("/auth/signin")
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
            {/* Background Animation */}
            <div className='absolute inset-0 opacity-20'>
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute w-72 h-72 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl'
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: `${(i * 30) % 100}%`,
                            top: `${(i * 25) % 100}%`
                        }}
                    />
                ))}
            </div>

            <div className='relative w-full max-w-md'>
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='mb-8'>
                    <Link
                        href='/'
                        className='flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200'>
                        <ArrowLeft className='w-4 h-4' />
                        <span>Back to Home</span>
                    </Link>
                </motion.div>

                {/* Error Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-red-500/20 shadow-2xl'>
                    {/* Error Icon */}
                    <div className='text-center mb-6'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200
                            }}
                            className='inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl mb-4'>
                            <AlertCircle className='w-8 h-8 text-red-400' />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-2xl font-bold text-white mb-2'>
                            {errorInfo.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='text-gray-300 text-sm'>
                            Error Code: {error}
                        </motion.p>
                    </div>

                    {/* Error Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='space-y-4 mb-8'>
                        <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                            <h3 className='text-white font-medium mb-2'>
                                What happened?
                            </h3>
                            <p className='text-gray-300 text-sm'>
                                {errorInfo.description}
                            </p>
                        </div>

                        <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                            <h3 className='text-white font-medium mb-2'>
                                How to fix this:
                            </h3>
                            <p className='text-gray-300 text-sm'>
                                {errorInfo.solution}
                            </p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className='space-y-3'>
                        <button
                            onClick={handleRetry}
                            className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2'>
                            <RefreshCw className='w-5 h-5' />
                            <span>Try Again</span>
                        </button>

                        {error === "OAuthAccountNotLinked" && (
                            <button
                                onClick={handleClearSession}
                                className='w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200'>
                                Clear Session & Retry
                            </button>
                        )}

                        <Link
                            href={`mailto:support@theboringeducation.com?subject=DevDost Auth Error&body=Error: ${error}`}
                            className='w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2'>
                            <Mail className='w-5 h-5' />
                            <span>Contact Support</span>
                        </Link>
                    </motion.div>

                    {/* Debug Info (Development Only) */}
                    {process.env.NODE_ENV === "development" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className='mt-6 pt-6 border-t border-white/10'>
                            <details className='text-xs text-gray-400'>
                                <summary className='cursor-pointer mb-2'>
                                    Debug Information
                                </summary>
                                <pre className='bg-black/20 p-3 rounded overflow-x-auto'>
                                    {JSON.stringify(
                                        {
                                            error,
                                            timestamp: new Date().toISOString(),
                                            userAgent:
                                                typeof window !== "undefined"
                                                    ? navigator.userAgent
                                                    : "N/A",
                                            url:
                                                typeof window !== "undefined"
                                                    ? window.location.href
                                                    : "N/A"
                                        },
                                        null,
                                        2
                                    )}
                                </pre>
                            </details>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
