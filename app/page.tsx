import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-6 sm:p-8">
      <CardHeader className="pb-6">
        <CardTitle className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          SELAMAT DATANG
        </CardTitle>
        <CardDescription className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-2">
          Pilih aktivitas Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Mulai kuis untuk menguji pengetahuan Anda, atau buat soal baru untuk dibagikan!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link href="/quiz" passHref className="flex-1">
            <Button className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Mulai Kuis
            </Button>
          </Link>
          <Link href="/create" passHref className="flex-1">
            <Button
              variant="outline"
              className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold border-gray-900 text-gray-900 hover:bg-gray-100 dark:border-gray-50 dark:text-gray-50 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-transparent"
            >
              Buat Soal Baru
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
