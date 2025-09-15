import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Destiny Rising - Hero Upgrade Tracker",
  description: "Track your hero upgrades, materials, and progression in Destiny Rising",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#164e63" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Destiny Rising Tracker",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`font-sans ${inter.variable} antialiased bg-black text-white min-h-screen`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
