import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StatsCardProps {
    icon: ReactNode
    label: string
    value: number
    gradient: string
}

export function StatsCard({ icon, label, value, gradient }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className='bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-200'>
            <div className='flex items-center space-x-3'>
                <div className={`bg-gradient-to-r ${gradient} p-2 rounded-lg`}>
                    {icon}
                </div>
                <div>
                    <div className='text-2xl font-bold text-white'>{value}</div>
                    <div className='text-gray-300 text-sm'>{label}</div>
                </div>
            </div>
        </motion.div>
    )
}
