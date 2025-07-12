"use client"

import { useState, useEffect, useRef } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Question } from "@/lib/questions"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface QuizGameProps {
  questions: Question[] // This prop will now receive shuffled questions
  onQuizComplete: (score: number, selectedAnswers: string[]) => void
}

const QUESTION_TIME_LIMIT = 15 // seconds

export function QuizGame({ questions, onQuizComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Removed audio refs and playSound function

  const currentQuestion = questions[currentQuestionIndex]
  const selectedOption = selectedAnswers[currentQuestionIndex]

  // Timer logic
  useEffect(() => {
    if (showFeedback || questions.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!)
          handleNextQuestion(true) // Auto-submit if time runs out
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestionIndex, showFeedback, questions.length])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(QUESTION_TIME_LIMIT)
    setShowFeedback(false)
    setIsAnswerCorrect(false)
    setIsSubmitting(false)
  }, [currentQuestionIndex])

  const handleAnswerSelect = (value: string) => {
    if (showFeedback) return
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestionIndex] = value
    setSelectedAnswers(newSelectedAnswers)

    const correct = value === currentQuestion.answer
    setIsAnswerCorrect(correct)
    setShowFeedback(true)
    // Removed playSound call

    if (timerRef.current) clearInterval(timerRef.current)

    setIsSubmitting(true)
    setTimeout(() => {
      handleNextQuestion()
    }, 1500)
  }

  const handleNextQuestion = (timedOut = true) => {
    setIsSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++
      }
    })
    onQuizComplete(correctCount, selectedAnswers)
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto text-center shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-6 sm:p-8">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Tidak ada soal kuis!
        </CardTitle>
        <CardContent>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            Silakan buat soal baru di halaman "Buat Soal" atau periksa halaman "Kelola Soal".
          </p>
        </CardContent>
      </Card>
    )
  }

  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-6 sm:p-8">
      {/* Removed hidden audio elements */}

      <CardHeader className="pb-6">
        <CardTitle className="text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">
          Kuis Interaktif
        </CardTitle>
        <div className="flex items-center justify-between mt-4">
          <Progress
            value={progressValue}
            className="flex-grow h-2 bg-gray-200 dark:bg-gray-700 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gray-900 dark:[&::-webkit-progress-value]:bg-gray-50"
          />
          <div className="ml-4 text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
            {timeLeft}s
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-50 leading-relaxed">
          Soal {currentQuestionIndex + 1} dari {questions.length}: <br />
          {currentQuestion.question}
        </h3>
        <RadioGroup value={selectedOption} onValueChange={handleAnswerSelect} className="grid gap-4">
          {currentQuestion.options.map((option) => (
            <div
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`flex items-center rounded-lg border p-4 transition-all duration-200 cursor-pointer
                ${
                  selectedOption === option
                    ? showFeedback
                      ? isAnswerCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md"
                      : "border-gray-900 bg-gray-100 dark:bg-gray-800 shadow-md"
                    : "border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-800/50"
                }
                ${showFeedback && selectedOption !== option && option === currentQuestion.answer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
                ${showFeedback ? "pointer-events-none" : ""}
                `}
            >
              <RadioGroupItem value={option} id={option} className="sr-only" />
              <Label
                htmlFor={option}
                className="w-full cursor-pointer text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200"
              >
                {option}
              </Label>
              {showFeedback && selectedOption === option && (
                <span className="ml-auto">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </span>
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        <Button
          onClick={() => handleNextQuestion()}
          disabled={!selectedOption || isSubmitting}
          className="py-3 px-6 sm:py-4 sm:px-8 text-lg sm:text-xl font-semibold bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
            </>
          ) : currentQuestionIndex < questions.length - 1 ? (
            "Soal Berikutnya"
          ) : (
            "Selesai Kuis"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
