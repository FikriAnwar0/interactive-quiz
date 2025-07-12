"use client"

import { useState, useEffect } from "react"
import { QuizStartScreen } from "@/components/quiz-start-screen"
import { QuizGame } from "@/components/quiz-game"
import { QuizResults } from "@/components/quiz-results"
import { useQuiz } from "@/context/quiz-context"
import type { Question } from "@/lib/questions"

export default function QuizPage() {
  const { questions, shuffleQuestions } = useQuiz()
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [quizState, setQuizState] = useState<"start" | "playing" | "results">("start")
  const [totalQuestionsToPlay, setTotalQuestionsToPlay] = useState(0)

  useEffect(() => {
    if (quizState === "start" && questions.length > 0) {
      // Only shuffle if there are questions available
      setShuffledQuestions(shuffleQuestions(totalQuestionsToPlay > 0 ? totalQuestionsToPlay : questions.length))
    }
  }, [quizState, questions, shuffleQuestions, totalQuestionsToPlay])

  const handleStartQuiz = (num: number) => {
    if (num > questions.length) {
      num = questions.length // Cap at available questions
    }
    setTotalQuestionsToPlay(num)
    setShuffledQuestions(shuffleQuestions(num)) // Shuffle with the selected count
    setQuizState("playing")
  }

  const handleQuizComplete = (finalScore: number, answers: string[]) => {
    setScore(finalScore)
    setSelectedAnswers(answers)
    setQuizState("results")
  }

  const handleRestartQuiz = () => {
    setQuizState("start")
    setScore(0)
    setSelectedAnswers([])
    setTotalQuestionsToPlay(0) // Reset count for next start
  }

  const [score, setScore] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

  return (
    <>
      {quizState === "start" && <QuizStartScreen onStart={handleStartQuiz} />}
      {quizState === "playing" && shuffledQuestions.length > 0 && (
        <QuizGame questions={shuffledQuestions} onQuizComplete={handleQuizComplete} />
      )}
      {quizState === "playing" && shuffledQuestions.length === 0 && (
        <div className="text-center text-gray-700 dark:text-gray-300 text-base sm:text-lg">
          Tidak ada soal yang cukup untuk memulai kuis dengan jumlah yang diminta.
        </div>
      )}
      {quizState === "results" && (
        <QuizResults
          score={score}
          totalQuestions={shuffledQuestions.length}
          selectedAnswers={selectedAnswers}
          questions={shuffledQuestions}
          onRestart={handleRestartQuiz}
        />
      )}
    </>
  )
}
