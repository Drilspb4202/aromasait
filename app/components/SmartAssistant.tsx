'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Loader2, Target, CheckCircle, XCircle, Edit2, Save, CalendarIcon, Bell, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Goal {
  id: string
  description: string
  category: string
  steps: string[]
  completed: boolean[]
  createdAt: number
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  reminder?: Date
}

const categories = [
  { value: 'personal', label: 'Личное развитие' },
  { value: 'professional', label: 'Профессиональный рост' },
  { value: 'health', label: 'Здоровье и фитнес' },
  { value: 'relationships', label: 'Отношения' },
  { value: 'financial', label: 'Финансы' },
]

const priorities = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]

export default function SmartAssistant() {
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [goals, setGoals] = useState<Goal[]>([])
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(categories[0].value)
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedDueDate, setSelectedDueDate] = useState<Date>()
  const [selectedReminder, setSelectedReminder] = useState<Date>()

  useEffect(() => {
    const savedGoals = localStorage.getItem('smartAssistantGoals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals, (key, value) => {
        if (key === 'dueDate' || key === 'reminder') {
          return value ? new Date(value) : undefined
        }
        return value
      }))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('smartAssistantGoals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      goals.forEach(goal => {
        if (goal.reminder && new Date(goal.reminder) <= now) {
          toast.success(`Напоминание: ${goal.description}`, {
            duration: 5000,
            icon: '🔔',
          })
          // Remove the reminder after it's shown
          updateGoal(goal.id, { ...goal, reminder: undefined })
        }
      })
    }

    const intervalId = setInterval(checkReminders, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [goals])

  const generateGoal = async () => {
    if (!userInput.trim()) {
      toast.error('Пожалуйста, введите ваши пожелания или область для улучшения')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/smart-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, category: selectedCategory }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при получении ответа от AI')
      }

      const data = await response.json()
      const newGoal: Goal = {
        id: Date.now().toString(),
        description: data.goal,
        category: selectedCategory,
        steps: data.steps,
        completed: new Array(data.steps.length).fill(false),
        createdAt: Date.now(),
        priority: selectedPriority,
        dueDate: selectedDueDate,
        reminder: selectedReminder,
      }

      setGoals(prevGoals => [newGoal, ...prevGoals])
      setUserInput('')
      setSelectedDueDate(undefined)
      setSelectedReminder(undefined)
      toast.success('Новая цель сгенерирована!')
    } catch (error) {
      console.error('Ошибка:', error)
      toast.error('Не удалось сгенерировать цель. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  const toggleStepCompletion = (goalId: string, stepIndex: number) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              completed: goal.completed.map((step, index) =>
                index === stepIndex ? !step : step
              ),
            }
          : goal
      )
    )
  }

  const removeGoal = (id: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id))
    toast.success('Цель удалена')
  }

  const editGoal = (id: string) => {
    setEditingGoal(id)
  }

  const saveGoal = (id: string, newDescription: string) => {
    updateGoal(id, { description: newDescription })
    setEditingGoal(null)
    toast.success('Цель обновлена')
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    )
  }

  const calculateProgress = (goal: Goal) => {
    const completedSteps = goal.completed.filter(Boolean).length
    return (completedSteps / goal.steps.length) * 100
  }

  const overallProgress = goals.length > 0
    ? goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / goals.length
    : 0

  const sortedGoals = [...goals].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Умный ассистент</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setSelectedPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите приоритет" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDueDate ? format(selectedDueDate, 'PP', { locale: ru }) : 'Выберите дату выполнения'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDueDate}
                  onSelect={setSelectedDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  {selectedReminder ? format(selectedReminder, 'PP', { locale: ru }) : 'Установить напоминание'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedReminder}
                  onSelect={setSelectedReminder}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Textarea
            placeholder="Опишите ваши пожелания или область, в которой вы хотите улучшиться..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="mb-2"
          />
          <Button onClick={generateGoal} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
            {loading ? 'Генерация...' : 'Сгенерировать цель'}
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Общий прогресс</h3>
          <Progress value={overallProgress} className="h-2 mb-2" />
          <p className="text-sm text-gray-600">{overallProgress.toFixed(0)}% целей выполнено</p>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            {sortedGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  {editingGoal === goal.id ? (
                    <Input
                      value={goal.description}
                      onChange={(e) => {
                        const newGoals = goals.map(g =>
                          g.id === goal.id ? { ...g, description: e.target.value } : g
                        )
                        setGoals(newGoals)
                      }}
                      className="flex-grow mr-2"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold">{goal.description}</h3>
                  )}
                  <div className="flex items-center">
                    {editingGoal === goal.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveGoal(goal.id, goal.description)}
                        className="text-green-500"
                      >
                        <Save className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editGoal(goal.id)}
                        className="text-blue-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(goal.id)}
                      className="text-red-500"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Категория: {categories.find(c => c.value === goal.category)?.label}</p>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Приоритет:</span>
                    {goal.priority === 'high' && <ArrowUp className="text-red-500" />}
                    {goal.priority === 'medium' && <ArrowUp className="text-yellow-500" />}
                    {goal.priority === 'low' && <ArrowDown className="text-green-500" />}
                  </div>
                </div>
                {goal.dueDate && (
                  <p className="text-sm text-gray-600 mb-2">
                    Срок выполнения: {format(goal.dueDate, 'PP', { locale: ru })}
                  </p>
                )}
                {goal.reminder && (
                  <p className="text-sm text-gray-600 mb-2">
                    Напоминание: {format(goal.reminder, 'PP', { locale: ru })}
                  </p>
                )}
                <Progress value={calculateProgress(goal)} className="h-2 mb-2" />
                <p className="text-sm text-gray-600 mb-2">{calculateProgress(goal).toFixed(0)}% выполнено</p>
                <ul className="list-disc list-inside">
                  {goal.steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStepCompletion(goal.id, index)}
                        className={goal.completed[index] ? 'text-green-500' : 'text-gray-400'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                      </Button>
                      <span className={goal.completed[index] ? 'line-through' : ''}>{step}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

