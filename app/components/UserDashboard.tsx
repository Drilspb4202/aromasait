'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Smile, Target, Droplet, Utensils, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface UserDashboardProps {
  userId: string
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [moodData, setMoodData] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Fetch mood data
      const { data: moodEntries, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      if (moodError) throw moodError

      // Fetch goals
      const { data: userGoals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (goalsError) throw goalsError

      // Fetch recommendations
      const { data: userRecommendations, error: recommendationsError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)

      if (recommendationsError) throw recommendationsError

      setMoodData(moodEntries || [])
      setGoals(userGoals || [])
      setRecommendations(userRecommendations || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Не удалось загрузить данные пользователя')
    } finally {
      setLoading(false)
    }
  }

  const renderMoodChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={moodData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="mood.happiness" stroke="#8884d8" />
        <Line type="monotone" dataKey="mood.energy" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderGoals = () => (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{goal.title}</p>
            <Progress value={goal.progress} className="w-40" />
          </div>
          <span className="text-sm text-gray-500">{goal.progress}%</span>
        </div>
      ))}
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {rec.type === 'aromatherapy' && <Droplet className="h-5 w-5 text-blue-500" />}
              {rec.type === 'nutrition' && <Utensils className="h-5 w-5 text-green-500" />}
              <p className="font-medium">{rec.title}</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Обзор настроения</CardTitle>
        </CardHeader>
        <CardContent>
          {renderMoodChart()}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Цели</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGoals()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние рекомендации</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRecommendations()}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center">
              <Smile className="h-5 w-5 mb-2" />
              Оценить настроение
            </Button>
            <Button variant="outline" className="flex flex-col items-center">
              <Target className="h-5 w-5 mb-2" />
              Поставить цель
            </Button>
            <Button variant="outline" className="flex flex-col items-center">
              <TrendingUp className="h-5 w-5 mb-2" />
              Посмотреть прогресс
            </Button>
            <Button variant="outline" className="flex flex-col items-center">
              <Calendar className="h-5 w-5 mb-2" />
              Запланировать медитацию
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

