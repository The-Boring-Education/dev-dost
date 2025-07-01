"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogOut, User, Plus, Heart } from "lucide-react"

export function Header() {
    const { data: session, status } = useSession()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" })
    }

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center space-x-2'>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center space-x-2'>
                            <div className='w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center'>
                                <Heart className='w-5 h-5 text-white' />
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-xl font-bold text-white'>
                                    DevDost
                                </h1>
                                <p className='text-xs text-gray-300 -mt-1'>
                                    by The Boring Education
                                </p>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Navigation */}
                    {session && (
                        <nav className='hidden md:flex items-center space-x-6'>
                            <Link
                                href='/dashboard'
                                className='text-white/80 hover:text-white transition-colors duration-200'>
                                Dashboard
                            </Link>
                            <Link
                                href='/projects'
                                className='text-white/80 hover:text-white transition-colors duration-200'>
                                Projects
                            </Link>
                            <Link
                                href='/matches'
                                className='text-white/80 hover:text-white transition-colors duration-200'>
                                Matches
                            </Link>
                            <Link
                                href='/profile'
                                className='text-white/80 hover:text-white transition-colors duration-200'>
                                Profile
                            </Link>
                        </nav>
                    )}

                    {/* User Actions */}
                    <div className='flex items-center space-x-4'>
                        {status === "loading" ? (
                            <div className='w-8 h-8 bg-white/20 rounded-full animate-pulse'></div>
                        ) : session ? (
                            <div className='flex items-center space-x-3'>
                                <Link href='/create-project'>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className='flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200'>
                                        <Plus className='w-4 h-4' />
                                        <span className='hidden sm:inline'>
                                            Create Project
                                        </span>
                                    </motion.button>
                                </Link>

                                <div className='flex items-center space-x-2'>
                                    <img
                                        src={
                                            session.user?.image ||
                                            "/default-avatar.png"
                                        }
                                        alt={session.user?.name || "User"}
                                        className='w-8 h-8 rounded-full border-2 border-white/20'
                                    />
                                    <span className='text-white font-medium hidden lg:inline'>
                                        {session.user?.name?.split(" ")[0]}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSignOut}
                                    className='flex items-center space-x-1 text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg'>
                                    <LogOut className='w-4 h-4' />
                                    <span className='hidden sm:inline'>
                                        Sign Out
                                    </span>
                                </motion.button>
                            </div>
                        ) : (
                            <Link href='/auth/signin'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200'>
                                    <User className='w-4 h-4' />
                                    <span>Sign In</span>
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
