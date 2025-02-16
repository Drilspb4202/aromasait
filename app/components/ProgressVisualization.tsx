'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

interface ProgressData {
  date: string
  energy: number
  happiness: number
  calmness: number
  stress: number
  anxiety: number
  focus: number
  creativity: number
  motivation: number
  sleep_quality: number
  social_connection: number
}

const moodCategories = [
  { key: 'energy', label: 'Энергичность', color: '#FFD700' },
  { key: 'happiness', label: 'Счастье', color: '#4CAF50' },
  { key: 'calmness', label: 'Спокойствие', color: '#2196F3' },
  { key: 'stress', label: 'Стресс', color: '#FF5722' },
  { key: 'anxiety', label: 'Тревожность', color: '#9C27B0' },
  { key: 'focus', label: 'Концентрация', color: '#3F51B5' },
  { key: 'creativity', label: 'Креативность', color: '#FF4081' },
  { key: 'motivation', label: 'Мотивация', color: '#FF9800' },
  { key: 'sleep_quality', label: 'Качество сна', color: '#607D8B' },
  { key: 'social_connection', label: 'Социальная связь', color: '#00BCD4' }
]

export default function ProgressVisualization() {
  const [period, setPeriod] = useState('week')
  const [data, setData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      let startDate
      switch (period) {
        case 'week':
          startDate = subDays(new Date(), 7)
          break
        case 'month':
          startDate = subMonths(new Date(), 1)
          break
        case 'year':
          startDate = subYears(new Date(), 1)
          break
        default:
          startDate = subDays(new Date(), 7)
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at, mood')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(new Date()).toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      const formattedData = data.map(entry => ({
        date: format(new Date(entry.created_at), 'dd.MM.yyyy'),
        ...entry.mood
      }))

      setData(formattedData)
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAverage = (category: string) => {
    if (data.length === 0) return 0
    const sum = data.reduce((acc, entry) => acc + (entry[category] || 0), 0)
    return Math.round((sum / data.length) * 10) / 10
  }

  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-between">
          <span>Визуализация прогресса</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Средние показатели за период</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {moodCategories.map((category) => (
                    <TooltipProvider key={category.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-white p-4 rounded-lg shadow">
                            <h4 className="text-sm font-medium mb-2">{category.label}</h4>
                            <Progress value={calculateAverage(category.key) * 10} className="h-2 mb-2" />
                            <p className="text-2xl font-bold" style={{ color: category.color }}>
                              {calculateAverage(category.key)}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Среднее значение {category.label.toLowerCase()} за выбранный период</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
              <div className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <RechartsTooltip content={renderTooltip} />
                    <Legend />
                    {moodCategories.map((category) => (
                      <Line
                        key={category.key}
                        type="monotone"
                        dataKey={category.key}
                        stroke={category.color}
                        name={category.label}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

