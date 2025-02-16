import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Target, TrendingUp, Sparkles, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  category: string
}

interface GoalProgressProps {
  goals: Goal[]
  onGoalUpdate: () => void
}

export default function GoalProgress({ goals, onGoalUpdate }: GoalProgressProps) {
  const [editingGoal, setEditingGoal] = useState<string | null>(null)

  const handleProgressUpdate = async (goalId: string, newProgress: number) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress }),
      })

      if (response.ok) {
        toast.success('Прогресс обновлен')
        onGoalUpdate()
      } else {
        throw new Error('Failed to update progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Не удалось обновить прогресс')
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту цель?')) {
      try {
        const response = await fetch(`/api/goals/${goalId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Цель удалена')
          onGoalUpdate()
        } else {
          throw new Error('Failed to delete goal')
        }
      } catch (error) {
        console.error('Error deleting goal:', error)
        toast.error('Не удалось удалить цель')
      }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aromatherapy':
        return 'bg-purple-500'
      case 'nutrition':
        return 'bg-green-500'
      case 'exercise':
        return 'bg-blue-500'
      case 'mindfulness':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {goals?.map((goal) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                <Badge className={getCategoryColor(goal.category)}>
                  {goal.category}
                </Badge>
              </div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">{goal.progress}% завершено</span>
              </div>
              <Progress value={goal.progress} className="mb-2" />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Срок: {new Date(goal.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGoal(goal.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
              {editingGoal === goal.id && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <Button
                    size="sm"
                    onClick={() => setEditingGoal(null)}
                    className="mt-2"
                  >
                    Сохранить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
