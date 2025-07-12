"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { PlusCircle, MinusCircle } from "lucide-react" // Import icons

export function CreateQuestionForm() {
  const { addQuestion } = useQuiz()
  const { toast } = useToast()
  const [questionText, setQuestionText] = useState("")
  const [options, setOptions] = useState([""]) // Default to 1 option
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const MAX_OPTIONS = 6
  const MIN_OPTIONS = 1

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!questionText.trim()) newErrors.questionText = "Pertanyaan tidak boleh kosong."
    if (options.length < MIN_OPTIONS) newErrors.options = `Minimal ${MIN_OPTIONS} pilihan jawaban diperlukan.`
    options.forEach((opt, index) => {
      if (!opt.trim()) newErrors[`option${index}`] = `Pilihan ${index + 1} tidak boleh kosong.`
    })
    if (!correctAnswer.trim()) newErrors.correctAnswer = "Jawaban benar tidak boleh kosong."
    if (correctAnswer.trim() && !options.includes(correctAnswer)) {
      newErrors.correctAnswer = "Jawaban benar harus salah satu dari pilihan yang ada."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    // Clear error for this option if it's now valid
    if (errors[`option${index}`] && value.trim()) {
      setErrors((prev) => {
        const { [`option${index}`]: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleAddOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, ""])
      setErrors((prev) => {
        const { options: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleRemoveOption = (indexToRemove: number) => {
    if (options.length > MIN_OPTIONS) {
      setOptions(options.filter((_, index) => index !== indexToRemove))
      // If the removed option was the correct answer, clear correct answer
      if (correctAnswer === options[indexToRemove]) {
        setCorrectAnswer("")
      }
      setErrors((prev) => {
        const { [`option${indexToRemove}`]: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value)
    if (errors.questionText && e.target.value.trim()) {
      setErrors((prev) => {
        const { questionText: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectAnswer(e.target.value)
    if (errors.correctAnswer && e.target.value.trim() && options.includes(e.target.value)) {
      setErrors((prev) => {
        const { correctAnswer: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Gagal Menambahkan Soal",
        description: "Harap perbaiki kesalahan pada formulir.",
        variant: "destructive",
      })
      return
    }

    addQuestion({
      question: questionText,
      options: options.filter((opt) => opt.trim() !== ""), // Filter out empty options
      answer: correctAnswer,
    })

    setQuestionText("")
    setOptions([""]) // Reset to 1 default option
    setCorrectAnswer("")
    setErrors({}) // Clear all errors on successful submission

    toast({
      title: "Soal Berhasil Ditambahkan!",
      description: "Soal baru Anda telah berhasil ditambahkan ke kuis.",
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-6 sm:p-8">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center">
          Buat Soal Baru
        </CardTitle>
        <CardDescription className="text-center text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan soal pilihan ganda Anda sendiri ke kuis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-base sm:text-lg">
              Pertanyaan
            </Label>
            <Input
              id="question"
              placeholder="Masukkan teks pertanyaan..."
              value={questionText}
              onChange={handleQuestionTextChange}
              className={cn(
                "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50 text-sm sm:text-base py-2",
                errors.questionText && "border-red-500",
              )}
              aria-invalid={errors.questionText ? "true" : "false"}
              aria-describedby={errors.questionText ? "question-error" : undefined}
            />
            {errors.questionText && (
              <p id="question-error" className="text-sm text-red-500">
                {errors.questionText}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <Label className="text-base sm:text-lg">Pilihan Jawaban</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Pilihan ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className={cn(
                    "flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50 text-sm sm:text-base py-2",
                    errors[`option${index}`] && "border-red-500",
                  )}
                  aria-invalid={errors[`option${index}`] ? "true" : "false"}
                  aria-describedby={errors[`option${index}`] ? `option${index}-error` : undefined}
                />
                {options.length > MIN_OPTIONS && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label={`Hapus pilihan ${index + 1}`}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.options && (
              <p id="options-error" className="text-sm text-red-500">
                {errors.options}
              </p>
            )}
            {options.length < MAX_OPTIONS && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                className="w-full py-2 px-4 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pilihan
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="correct-answer" className="text-base sm:text-lg">
              Jawaban Benar
            </Label>
            <Input
              id="correct-answer"
              placeholder="Masukkan jawaban yang benar (harus sama dengan salah satu pilihan)"
              value={correctAnswer}
              onChange={handleCorrectAnswerChange}
              className={cn(
                "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50 text-sm sm:text-base py-2",
                errors.correctAnswer && "border-red-500",
              )}
              aria-invalid={errors.correctAnswer ? "true" : "false"}
              aria-describedby={errors.correctAnswer ? "correct-answer-error" : undefined}
            />
            {errors.correctAnswer && (
              <p id="correct-answer-error" className="text-sm text-red-500">
                {errors.correctAnswer}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full py-2 sm:py-3 text-base sm:text-lg font-semibold bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Tambahkan Soal
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
