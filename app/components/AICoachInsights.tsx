import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

interface Goal {
  id: string
  title: string
  progress: number
  category: string
}

interface Recommendation {
  type: string
  content: string
}

interface AICoachInsightsProps {
  goals: Goal[]
  recommendations: Recommendation[]
}

export default function AICoachInsights({ goals, recommendations }: AICoachInsightsProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateInsights()
  }, [goals, recommendations])

  const generateInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-coach-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, recommendations }),
      })
      const data = await response.json()
      if (response.ok) {
        setInsights(data.insights)
      } else {
        throw new Error(data.error || 'Failed to generate insights')
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = goals.map(goal => ({
    name: goal.title,
    progress: goal.progress,
  }))

  const pieData = goals.reduce((acc, goal) => {
    const existingCategory = acc.find(item => item.name === goal.category)
    if (existingCategory) {
      existingCategory.value += 1
    } else {
      acc.push({ name: goal.category, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const getOverallProgress = () => {
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
    return Math.round(totalProgress / goals.length)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Общий прогресс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-center mb-4">
            {getOverallProgress()}%
          </div>
          <div className="flex justify-center items-center">
            {getOverallProgress() >= 50 ? (
              <TrendingUp className="text-green-500 mr-2" />
            ) : (
              <TrendingDown className="text-red-500 mr-2" />
            )}
            <span className="text-lg">
              {getOverallProgress() >= 50 ? 'На верном пути!' : 'Есть над чем поработать'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Прогресс по целям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение целей по категориям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Аналитика</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {insights.map((insight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {insight}
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

