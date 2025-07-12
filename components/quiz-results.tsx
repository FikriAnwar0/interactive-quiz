"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Question } from "@/lib/questions"
import { CheckCircle2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  selectedAnswers: string[]
  questions: Question[]
  onRestart: () => void
}

export function QuizResults({ score, totalQuestions, selectedAnswers, questions, onRestart }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100
  const [showConfetti, setShowConfetti] = useState(false)
  // Removed audioCompleteRef

  useEffect(() => {
    if (percentage === 100) {
      setShowConfetti(true)
      // Removed audio play call
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [percentage])

  const getFeedback = () => {
    if (percentage === 100) {
      return "Luar biasa! Anda menjawab semua pertanyaan dengan benar!"
    } else if (percentage >= 70) {
      return "Kerja bagus! Anda memiliki pemahaman yang sangat baik."
    } else if (percentage >= 50) {
      return "Cukup baik! Terus berlatih untuk hasil yang lebih baik."
    } else {
      return "Jangan menyerah! Mari coba lagi dan tingkatkan pengetahuan Anda."
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in relative overflow-hidden p-6 sm:p-8">
      {/* Removed hidden audio element */}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: Math.random() > 0.5 ? "#000" : "#fff",
              }}
            />
          ))}
        </div>
      )}
      <style jsx>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
          animation: confetti-fall 3s ease-out forwards;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      <CardHeader className="pb-6">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">
          Hasil Kuis Anda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-6xl sm:text-7xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
            {score} / {totalQuestions}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-2">
            ({percentage.toFixed(0)}%)
          </p>
        </div>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{getFeedback()}</p>

        <div className="mt-8 space-y-6 text-left max-h-60 sm:max-h-80 overflow-y-auto pr-2">
          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 border-b pb-2">
            Tinjau Jawaban Anda:
          </h4>
          {questions.map((q, index) => (
            <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-base sm:text-lg">
                {index + 1}. {q.question}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Pilihan Anda: <span className="font-bold">{selectedAnswers[index] || "Tidak dijawab"}</span>
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Jawaban Benar: <span className="font-bold text-gray-800 dark:text-gray-200">{q.answer}</span>
              </p>
              {selectedAnswers[index] === q.answer ? (
                <span className="flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-gray-800 dark:text-gray-200" /> Benar
                </span>
              ) : (
                <span className="flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-2">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-gray-800 dark:text-gray-200" /> Salah
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="py-3 px-6 sm:py-4 sm:px-8 text-lg sm:text-xl font-semibold bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Mulai Ulang Kuis
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-gray-50">Mulai Ulang Kuis?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin memulai ulang kuis? Progres Anda saat ini akan hilang.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onRestart}
                className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Mulai Ulang
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
