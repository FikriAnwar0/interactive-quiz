"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between p-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
        KUIS CERDAS
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/quiz"
          className={cn(
            "text-lg font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-50",
            pathname === "/quiz" ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400",
          )}
        >
          Mulai Kuis
        </Link>
        <Link
          href="/create"
          className={cn(
            "text-lg font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-50",
            pathname === "/create" ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400",
          )}
        >
          Buat Soal
        </Link>
        <Link
          href="/manage"
          className={cn(
            "text-lg font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-50",
            pathname === "/manage" ? "text-gray-900 dark:text-gray-50" : "text-gray-600 dark:text-gray-400",
          )}
        >
          Kelola Soal
        </Link>
      </div>

      {/* Mobile Navigation & Theme Toggle */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-700 bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[250px] sm:w-[300px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex flex-col gap-4 pt-8">
              <Link
                href="/quiz"
                className={cn(
                  "text-xl font-semibold py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === "/quiz"
                    ? "text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                Mulai Kuis
              </Link>
              <Link
                href="/create"
                className={cn(
                  "text-xl font-semibold py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === "/create"
                    ? "text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                Buat Soal
              </Link>
              <Link
                href="/manage"
                className={cn(
                  "text-xl font-semibold py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === "/manage"
                    ? "text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                Kelola Soal
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
