"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            {children}
            <Toaster
                position='top-center'
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#1f2937",
                        color: "#fff",
                        borderRadius: "12px"
                    }
                }}
            />
        </SessionProvider>
    )
}
