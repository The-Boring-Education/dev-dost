import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "DevDost - Tinder for Builders",
    description:
        "Find partners for building projects. Connect with developers across cities and build amazing projects together.",
    keywords: [
        "developers",
        "projects",
        "collaboration",
        "coding",
        "partnership"
    ],
    authors: [{ name: "The Boring Education" }],
    openGraph: {
        title: "DevDost - Tinder for Builders",
        description:
            "Find partners for building projects. Connect with developers across cities and build amazing projects together.",
        type: "website"
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body
                className={`${inter.className} antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
