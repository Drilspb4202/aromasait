'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Calendar, Trophy, Download, Upload, Bell } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface Habit {
  id: number
  name: string
  category: string
  completed: boolean[]
  streak: number
}

const categories = [
  { value: 'health', label: 'Здоровье' },
  { value: 'productivity', label: 'Продуктивность' },
  { value: 'relationships', label: 'Отношения' },
  { value: 'personal_growth', label: 'Личностный рост' },
]

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [newCategory, setNewCategory] = useState(categories[0].value)
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (newHabit.trim() !== '') {
      setHabits([...habits, { 
        id: Date.now(), 
        name: newHabit, 
        category: newCategory,
        completed: new Array(7).fill(false),
        streak: 0
      }])
      setNewHabit('')
      setShowAddDialog(false)
      toast.success('Привычка добавлена')
    } else {
      toast.error('Пожалуйста, введите название привычки')
    }
  }

  const toggleHabit = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed]
        newCompleted[dayIndex] = !newCompleted[dayIndex]
        
        // Обновляем серию выполнений
        let streak = 0
        for (let i = newCompleted.length - 1; i >= 0; i--) {
          if (newCompleted[i]) {
            streak++
          } else {
            break
          }
        }
        
        return { ...habit, completed: newCompleted, streak }
      }
      return habit
    }))
  }

  const removeHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id))
    toast.success('Привычка удалена')
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const exportData = () => {
    const dataStr = JSON.stringify(habits)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'habits.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedHabits = JSON.parse(e.target?.result as string)
          setHabits(importedHabits)
          toast.success('Привычки импортированы успешно')
        } catch (error) {
          toast.error('Ошибка при импорте файла')
        }
      }
      reader.readAsText(file)
    }
  }

  const filteredHabits = activeTab === 'all' ? habits : habits.filter(habit => habit.category === activeTab)

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
        <CardTitle className="text-2xl text-center">Трекер привычек</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            className="text-blue-500 hover:text-blue-700"
          >
            Предыдущая неделя
          </Button>
          <span className="font-semibold">
            {format(currentWeek, 'd MMMM', { locale: ru })} - {format(addDays(currentWeek, 6), 'd MMMM yyyy', { locale: ru })}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            className="text-blue-500 hover:text-blue-700"
          >
            Следующая неделя
          </Button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 transition-colors duration-200">
                <Plus className="mr-2 h-4 w-4" /> Добавить привычку
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить новую привычку</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Название
                  </Label>
                  <Input
                    id="name"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Категория
                  </Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addHabit}>Добавить привычку</Button>
            </DialogContent>
          </Dialog>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" /> Экспорт
            </Button>
            <label htmlFor="import-file">
              <Button variant="outline" as="span">
                <Upload className="mr-2 h-4 w-4" /> Импорт
              </Button>
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1"></th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="px-2 py-1 text-center">
                        <div className="text-sm font-semibold">{format(day, 'EEEEEE', { locale: ru })}</div>
                        <div className="text-xs text-gray-500">{format(day, 'd')}</div>
                      </th>
                    ))}
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredHabits.map((habit) => (
                      <motion.tr
                        key={habit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-2 py-3 font-medium">{habit.name}</td>
                        {habit.completed.map((completed, dayIndex) => (
                          <td key={dayIndex} className="px-2 py-3 text-center">
                            <Checkbox
                              checked={completed}
                              onCheckedChange={() => toggleHabit(habit.id, dayIndex)}
                              className="mx-auto"
                              disabled={!isSameDay(weekDays[dayIndex], new Date()) && weekDays[dayIndex] > new Date()}
                            />
                          </td>
                        ))}
                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{habit.streak}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHabit(habit.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {filteredHabits.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {activeTab === 'all' ? 'Добавьте свою первую привычку!' : 'Нет привычек в этой категории.'}
          </p>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Прогресс за неделю</h3>
          {filteredHabits.map((habit) => (
            <div key={habit.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>{habit.name}</span>
                <span>{habit.completed.filter(Boolean).length}/{habit.completed.length} дней</span>
              </div>
              <Progress value={(habit.completed.filter(Boolean).length / habit.completed.length) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

