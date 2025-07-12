"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider" // Import Slider

interface QuizStartScreenProps {
  onStart: (numQuestions: number) => void
}

export function QuizStartScreen({ onStart }: QuizStartScreenProps) {
  const { questions } = useQuiz()
  const { toast } = useToast()
  const maxQuestions = questions.length > 0 ? questions.length : 1
  const [numQuestions, setNumQuestions] = useState(Math.min(5, maxQuestions)) // Default to 5 or max available

  const handleStartClick = () => {
    if (questions.length === 0) {
      toast({
        title: "Tidak Ada Soal",
        description: "Tidak ada soal kuis yang tersedia. Silakan buat soal baru.",
        variant: "destructive",
      })
      return
    }
    if (numQuestions <= 0) {
      toast({
        title: "Jumlah Soal Tidak Valid",
        description: "Jumlah soal harus lebih dari 0.",
        variant: "destructive",
      })
      return
    }
    if (numQuestions > questions.length) {
      toast({
        title: "Jumlah Soal Terlalu Banyak",
        description: `Hanya ada ${questions.length} soal yang tersedia. Kuis akan dimulai dengan ${questions.length} soal.`,
        variant: "warning",
      })
      onStart(questions.length)
      return
    }
    onStart(numQuestions)
  }

  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-6 sm:p-8">
      <CardHeader className="pb-6">
        <CardTitle className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          KUIS CERDAS
        </CardTitle>
        <CardDescription className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-2">
          Uji pengetahuan Anda. Siap untuk tantangan?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Jawab serangkaian pertanyaan pilihan ganda dan lihat seberapa banyak yang Anda ketahui. Setiap jawaban yang
          benar akan meningkatkan skor Anda!
        </p>
        <div className="space-y-4">
          <Label htmlFor="num-questions" className="text-base sm:text-lg text-gray-800 dark:text-gray-200">
            Jumlah Soal Kuis: {numQuestions}
          </Label>
          <Slider
            id="num-questions"
            min={1}
            max={maxQuestions}
            step={1}
            value={[numQuestions]}
            onValueChange={(value) => setNumQuestions(value[0])}
            className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200 dark:[&>span:first-child]:bg-gray-700 [&>span:first-child]:rounded-lg [&_[role=slider]]:bg-gray-900 dark:[&_[role=slider]]:bg-gray-50 [&_[role=slider]]:border-gray-900 dark:[&_[role=slider]]:border-gray-50 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">Total soal tersedia: {questions.length}</p>
        </div>
        <Button
          onClick={handleStartClick}
          className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Mulai Kuis Sekarang
        </Button>
      </CardContent>
    </Card>
  )
}
