'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Award, Star, Zap, Heart, Smile } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  completed: boolean
}

const achievementsList: Achievement[] = [
  {
    id: 'mood_streak',
    name: 'Настроенный на успех',
    description: 'Отслеживайте свое настроение 7 дней подряд',
    icon: <Smile className="w-6 h-6 text-yellow-500" />,
    progress: 0,
    maxProgress: 7,
    completed: false
  },
  {
    id: 'oil_expert',
    name: 'Знаток ароматов',
    description: 'Попробуйте 10 различных эфирных масел',
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    progress: 0,
    maxProgress: 10,
    completed: false
  },
  {
    id: 'vegan_chef',
    name: 'Веган-шеф',
    description: 'Приготовьте 5 различных веганских блюд',
    icon: <Heart className="w-6 h-6 text-green-500" />,
    progress: 0,
    maxProgress: 5,
    completed: false
  },
  {
    id: 'meditation_master',
    name: 'Мастер медитации',
    description: 'Проведите в общей сложности 1 час в медитации',
    icon: <Star className="w-6 h-6 text-blue-500" />,
    progress: 0,
    maxProgress: 60,
    completed: false
  }
]

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsList)

  useEffect(() => {
    fetchAchievements()
    // Set initial achievements data
    setAchievements(achievementsList)
  }, [])

  async function fetchAchievements() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        if (error.code === '42P01') {
          console.error('Table "user_achievements" does not exist:', error)
          // If the table doesn't exist, use the initial achievements data
          return
        }
        throw error
      }

      if (data) {
        const updatedAchievements = achievements.map(achievement => {
          const userAchievement = data.find(a => a.achievement_id === achievement.id)
          if (userAchievement) {
            return {
              ...achievement,
              progress: userAchievement.progress,
              completed: userAchievement.completed
            }
          }
          return achievement
        })
        setAchievements(updatedAchievements)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      toast.error('Ошибка при загрузке достижений')
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <Award className="mr-2" />
          Достижения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="bg-white p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                {achievement.icon}
                <h3 className="text-lg font-semibold ml-2">{achievement.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              <div className="flex items-center justify-between mb-2">
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="w-3/4" />
                <span className="text-sm font-medium">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              {achievement.completed && (
                <Badge variant="success" className="mt-2">
                  Выполнено!
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

