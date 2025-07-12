"use client"

import type React from "react"

import { QuestionList } from "@/components/question-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz } from "@/context/quiz-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { questions as initialQuestionsData } from "@/lib/questions"
import { Loader2 } from "lucide-react"

export default function ManageQuestionsPage() {
  const { questions, importQuestions, exportQuestions, isImporting } = useQuiz()
  const { toast } = useToast()
  const [filterType, setFilterType] = useState<"all" | "default" | "user">("all")

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await importQuestions(file)
        toast({
          title: "Impor Berhasil",
          description: "Soal-soal berhasil diimpor.",
        })
      } catch (error: any) {
        toast({
          title: "Impor Gagal",
          description: error.message || "Terjadi kesalahan saat mengimpor soal.",
          variant: "destructive",
        })
      }
      event.target.value = "" // Clear file input
    }
  }

  const handleExport = () => {
    exportQuestions()
    toast({
      title: "Ekspor Berhasil",
      description: "Soal-soal Anda telah diekspor ke file JSON.",
    })
  }

  const filteredQuestions = questions.filter((q) => {
    const isDefault = initialQuestionsData.some((iq) => iq.id === q.id)
    if (filterType === "all") return true
    if (filterType === "default") return isDefault
    if (filterType === "user") return !isDefault
    return true
  })

  return (
    <Card className="w-full max-w-xl md:max-w-2xl mx-auto shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in p-4 sm:p-6 lg:p-8">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center">
          Kelola Soal Kuis
        </CardTitle>
        <CardDescription className="text-center text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
          Lihat, edit, dan hapus soal yang ada. Anda juga bisa mengimpor atau mengekspor soal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="import-file" className="sr-only">
              Impor Soal
            </Label>
            <Input id="import-file" type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Button
              onClick={() => document.getElementById("import-file")?.click()}
              className="w-full py-2 px-4 text-base font-semibold bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengimpor...
                </>
              ) : (
                "Impor Soal"
              )}
            </Button>
          </div>
          <Button
            onClick={handleExport}
            className="w-full py-2 px-4 text-base font-semibold bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
          >
            Ekspor Soal
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-base sm:text-lg text-gray-800 dark:text-gray-200">Filter Soal:</Label>
          <RadioGroup
            value={filterType}
            onValueChange={(value: "all" | "default" | "user") => setFilterType(value)}
            className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="filter-all" />
              <Label htmlFor="filter-all" className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Semua
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="filter-default" />
              <Label htmlFor="filter-default" className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Bawaan
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="filter-user" />
              <Label htmlFor="filter-user" className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Buatan Pengguna
              </Label>
            </div>
          </RadioGroup>
        </div>

        {filteredQuestions.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300 text-base sm:text-lg">
            Tidak ada soal yang cocok dengan filter ini.
          </p>
        ) : (
          <QuestionList questions={filteredQuestions} />
        )}
      </CardContent>
    </Card>
  )
}
