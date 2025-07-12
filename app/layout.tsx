import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { QuizProvider } from "@/context/quiz-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuis Cerdas Interaktif",
  description: "Website kuis interaktif dengan fitur pembuatan soal dan responsif.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QuizProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
              <Navbar />
              <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </QuizProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
