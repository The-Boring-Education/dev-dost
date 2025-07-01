import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import "@/styles/globals.css"

export default function App({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Toaster
                position='top-center'
                reverseOrder={false}
                gutter={8}
                containerClassName=''
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: "",
                    duration: 4000,
                    style: {
                        background: "#1f2937",
                        color: "#fff",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)"
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        style: {
                            background:
                                "linear-gradient(135deg, #10b981, #059669)"
                        }
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background:
                                "linear-gradient(135deg, #ef4444, #dc2626)"
                        }
                    }
                }}
            />
        </SessionProvider>
    )
}
