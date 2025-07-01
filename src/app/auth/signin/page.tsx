"use client"

import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function SignInPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check if user is already signed in
        getSession().then((session) => {
            if (session) {
                router.push("/dashboard")
            }
        })
    }, [router])

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            const result = await signIn("google", {
                callbackUrl: "/dashboard",
                redirect: false
            })

            if (result?.error) {
                toast.error("Failed to sign in. Please try again.")
            } else {
                toast.success("Welcome to DevDost! 🚀")
                router.push("/dashboard")
            }
        } catch (error) {
            console.error("Sign in error:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            {/* Background Animation */}
            <div className='absolute inset-0 opacity-20'>
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl'
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
                            left: `${(i * 25) % 100}%`,
                            top: `${(i * 20) % 100}%`
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

                {/* Sign In Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl'>
                    {/* Logo */}
                    <div className='text-center mb-8'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200
                            }}
                            className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4'>
                            <Heart className='w-8 h-8 text-white' />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-3xl font-bold text-white mb-2'>
                            Welcome to DevDost
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='text-gray-300'>
                            Sign in to start building amazing projects together
                        </motion.p>
                    </div>

                    {/* Sign In Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='space-y-6'>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className='w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'>
                            {isLoading ? (
                                <div className='w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin'></div>
                            ) : (
                                <>
                                    <svg
                                        className='w-5 h-5'
                                        viewBox='0 0 24 24'>
                                        <path
                                            fill='#4285F4'
                                            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                        />
                                        <path
                                            fill='#34A853'
                                            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                        />
                                        <path
                                            fill='#FBBC05'
                                            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                        />
                                        <path
                                            fill='#EA4335'
                                            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className='text-center text-xs text-gray-400'>
                            By signing in, you agree to our Terms of Service and
                            Privacy Policy
                        </motion.p>
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className='mt-8 pt-8 border-t border-white/10'>
                        <h3 className='text-white font-medium mb-4 text-center'>
                            What you'll get access to:
                        </h3>
                        <div className='space-y-3'>
                            {[
                                "🚀 Browse exciting project ideas",
                                "💫 Match with developers worldwide",
                                "🔥 Create your own project ideas",
                                "💬 Connect via WhatsApp/Telegram/Email"
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className='flex items-center space-x-2 text-gray-300 text-sm'>
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className='text-center text-gray-400 text-sm mt-8'>
                    Ready to find your dev partner? Let's build something
                    amazing! 🎯
                </motion.p>
            </div>
        </div>
    )
}
