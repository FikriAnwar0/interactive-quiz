"use client"

import { useQuiz } from "@/context/quiz-context"
import type { Question } from "@/lib/questions"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { EditQuestionForm } from "@/components/edit-question-form"
import { useState } from "react"

interface QuestionListProps {
  questions: Question[]
}

export function QuestionList({ questions }: QuestionListProps) {
  const { deleteQuestion } = useQuiz()
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentQuestionToEdit, setCurrentQuestionToEdit] = useState<Question | null>(null)

  const handleDelete = (id: string) => {
    deleteQuestion(id)
    toast({
      title: "Soal Dihapus",
      description: "Soal kuis telah berhasil dihapus.",
    })
  }

  const handleEditClick = (question: Question) => {
    setCurrentQuestionToEdit(question)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setCurrentQuestionToEdit(null)
    toast({
      title: "Soal Diperbarui",
      description: "Soal kuis telah berhasil diperbarui.",
    })
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex-1 pr-2 mb-2 sm:mb-0">
            <p className="font-semibold text-gray-900 dark:text-gray-50 text-sm sm:text-base">
              {index + 1}. {q.question}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Jawaban: <span className="font-medium">{q.answer}</span>
            </p>
          </div>
          <div className="flex space-x-1 self-end sm:self-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick(q)}
              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">Edit soal</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Hapus soal</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-50">Hapus Soal Ini?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}

      {currentQuestionToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-6 sm:p-8 max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center">
                Edit Soal
              </DialogTitle>
            </DialogHeader>
            <EditQuestionForm question={currentQuestionToEdit} onSave={handleEditSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
