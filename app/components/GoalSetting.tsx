import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface GoalSettingProps {
  onClose: () => void
  onGoalAdded: () => void
}

export default function GoalSetting({ onClose, onGoalAdded }: GoalSettingProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState<Date>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !category || !dueDate) {
      toast.error('Пожалуйста, заполните все поля')
      return
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, dueDate }),
      })

      if (response.ok) {
        toast.success('Цель успешно добавлена')
        onGoalAdded()
        onClose()
      } else {
        throw new Error('Failed to add goal')
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      toast.error('Не удалось добавить цель')
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новую цель</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Название
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Описание
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Категория
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aromatherapy">Ароматерапия</SelectItem>
                  <SelectItem value="nutrition">Питание</SelectItem>
                  <SelectItem value="exercise">Упражнения</SelectItem>
                  <SelectItem value="mindfulness">Осознанность</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dueDate" className="text-right">
                Срок
              </label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Добавить цель</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

