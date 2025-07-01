import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Heart, Code, Users, Zap, ArrowRight, Github } from "lucide-react"

export default function HomePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/dashboard")
        }
    }, [session, router])

    if (status === "loading") {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white'></div>
            </div>
        )
    }

    if (session) {
        return null // Will redirect to dashboard
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <Header />

            {/* Hero Section */}
            <main className='flex-1'>
                <section className='relative overflow-hidden pt-20 pb-32'>
                    {/* Background Animation */}
                    <div className='absolute inset-0 opacity-20'>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className='absolute w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl'
                                animate={{
                                    x: [0, 100, 0],
                                    y: [0, 50, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 10 + i * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    left: `${(i * 20) % 100}%`,
                                    top: `${(i * 15) % 100}%`
                                }}
                            />
                        ))}
                    </div>

                    <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='text-center'>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className='mb-8'>
                                <h1 className='text-5xl md:text-7xl font-bold text-white mb-6'>
                                    Find Your
                                    <motion.span
                                        animate={{
                                            backgroundPosition: ["0%", "100%"]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className='block bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-300% leading-tight'>
                                        Dev Partner
                                    </motion.span>
                                </h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                                    Swipe right on projects, connect with
                                    developers across cities, and build amazing
                                    things together.
                                    <strong className='text-white'>
                                        {" "}
                                        It&apos;s Tinder for Builders! 🚀
                                    </strong>
                                </motion.p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
                                <Link href='/auth/signin'>
                                    <motion.button
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow:
                                                "0 20px 40px rgba(139, 92, 246, 0.3)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className='flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200'>
                                        <Heart className='w-5 h-5' />
                                        <span>Start Building Together</span>
                                        <ArrowRight className='w-5 h-5' />
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='flex items-center space-x-2 border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm'>
                                    <Github className='w-5 h-5' />
                                    <span>View Demo</span>
                                </motion.button>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                                <div className='bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10'>
                                    <div className='text-3xl font-bold text-white mb-2'>
                                        500+
                                    </div>
                                    <div className='text-gray-300'>
                                        Active Developers
                                    </div>
                                </div>
                                <div className='bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10'>
                                    <div className='text-3xl font-bold text-white mb-2'>
                                        150+
                                    </div>
                                    <div className='text-gray-300'>
                                        Projects Built
                                    </div>
                                </div>
                                <div className='bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10'>
                                    <div className='text-3xl font-bold text-white mb-2'>
                                        50+
                                    </div>
                                    <div className='text-gray-300'>
                                        Successful Matches
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className='py-20 bg-black/10'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className='text-center mb-16'>
                            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                                How It Works
                            </h2>
                            <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
                                Simple as swiping, powerful as collaboration
                            </p>
                        </motion.div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {[
                                {
                                    icon: <Code className='w-8 h-8' />,
                                    title: "Browse Projects",
                                    description:
                                        "Swipe through exciting project ideas or create your own. From web apps to AI projects."
                                },
                                {
                                    icon: <Heart className='w-8 h-8' />,
                                    title: "Find Your Match",
                                    description:
                                        "When two developers both swipe right on the same project, magic happens! You get matched."
                                },
                                {
                                    icon: <Users className='w-8 h-8' />,
                                    title: "Build Together",
                                    description:
                                        "Connect via WhatsApp, Telegram, or email. Start building your next amazing project together."
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.2,
                                        duration: 0.8
                                    }}
                                    whileHover={{ y: -10 }}
                                    className='bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300'>
                                    <div className='bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 mx-auto'>
                                        {feature.icon}
                                    </div>
                                    <h3 className='text-xl font-semibold text-white mb-4 text-center'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-300 text-center leading-relaxed'>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className='py-20'>
                    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20'>
                            <div className='flex items-center justify-center mb-6'>
                                <Zap className='w-12 h-12 text-yellow-400' />
                            </div>
                            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                                Ready to Build?
                            </h2>
                            <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
                                Join hundreds of developers who are already
                                building amazing projects together. Your next
                                great collaboration is just a swipe away!
                            </p>
                            <Link href='/auth/signin'>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 20px 40px rgba(139, 92, 246, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 rounded-xl font-semibold text-xl transition-all duration-200 inline-flex items-center space-x-2'>
                                    <span>Get Started for Free</span>
                                    <ArrowRight className='w-6 h-6' />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
