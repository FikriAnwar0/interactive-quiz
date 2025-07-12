"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { questions as initialQuestionsData, type Question } from "@/lib/questions"

interface QuizContextType {
  questions: Question[]
  addQuestion: (newQuestion: Omit<Question, "id">) => void
  updateQuestion: (updatedQuestion: Question) => void
  deleteQuestion: (id: string) => void
  shuffleQuestions: (count?: number) => Question[]
  importQuestions: (file: File) => Promise<void>
  exportQuestions: () => void
  isImporting: boolean
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = "user_quiz_questions"

export function QuizProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestionsData)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Load questions from local storage on initial mount
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedQuestions) {
        const parsedQuestions: Question[] = JSON.parse(storedQuestions)
        // Merge initial questions with stored questions, avoiding duplicates by ID
        const mergedQuestions = [...initialQuestionsData]
        parsedQuestions.forEach((q) => {
          if (!mergedQuestions.some((mq) => mq.id === q.id)) {
            mergedQuestions.push(q)
          }
        })
        setQuestions(mergedQuestions)
      }
    } catch (error) {
      console.error("Failed to load questions from local storage:", error)
      setQuestions(initialQuestionsData) // Fallback to initial questions
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save questions to local storage whenever they change (only user-created ones)
  useEffect(() => {
    if (!isLoaded) return // Don't save until initial load is complete
    const userCreatedQuestions = questions.filter((q) => !initialQuestionsData.some((iq) => iq.id === q.id))
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userCreatedQuestions))
    } catch (error) {
      console.error("Failed to save questions to local storage:", error)
    }
  }, [questions, isLoaded])

  const addQuestion = (newQuestion: Omit<Question, "id">) => {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Unique ID for user questions
    setQuestions((prevQuestions) => [...prevQuestions, { ...newQuestion, id }])
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) => prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id))
  }

  const shuffleQuestions = (count?: number) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return count ? shuffled.slice(0, count) : shuffled
  }

  const importQuestions = async (file: File) => {
    setIsImporting(true)
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedData: Question[] = JSON.parse(event.target?.result as string)
          if (!Array.isArray(importedData) || !importedData.every((q) => q.question && q.options && q.answer)) {
            throw new Error("Invalid JSON format for questions.")
          }

          const newQuestionsToAdd: Question[] = []
          importedData.forEach((importedQ) => {
            // Generate new unique ID for imported questions to avoid conflicts
            const newId = `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            newQuestionsToAdd.push({ ...importedQ, id: newId })
          })

          setQuestions((prevQuestions) => {
            // Filter out any imported questions that might have duplicate content (optional, but good practice)
            const uniqueNewQuestions = newQuestionsToAdd.filter(
              (newQ) =>
                !prevQuestions.some(
                  (existingQ) =>
                    existingQ.question === newQ.question &&
                    JSON.stringify(existingQ.options) === JSON.stringify(newQ.options),
                ),
            )
            return [...prevQuestions, ...uniqueNewQuestions]
          })
          resolve()
        } catch (error) {
          console.error("Error importing questions:", error)
          reject(new Error("Gagal mengimpor soal. Pastikan format file JSON benar."))
        } finally {
          setIsImporting(false)
        }
      }
      reader.onerror = () => {
        setIsImporting(false)
        reject(new Error("Gagal membaca file."))
      }
      reader.readAsText(file)
    })
  }

  const exportQuestions = () => {
    const userCreatedQuestions = questions.filter((q) => !initialQuestionsData.some((iq) => iq.id === q.id))
    const dataStr = JSON.stringify(userCreatedQuestions, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kuis_soal_ekspor.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        shuffleQuestions,
        importQuestions,
        exportQuestions,
        isImporting,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
