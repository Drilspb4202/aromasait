'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MoodHistoryEntry {
  date: string
  mood: Record<string, number>
}

export default function MoodStatistics() {
  const [moodData, setMoodData] = useState<Record<string, number>>({})

  useEffect(() => {
    const storedHistory = localStorage.getItem('moodHistory')
    if (storedHistory) {
      const history: MoodHistoryEntry[] = JSON.parse(storedHistory)
      const aggregatedMood: Record<string, number> = {}

      history.forEach(entry => {
        Object.entries(entry.mood).forEach(([key, value]) => {
          if (aggregatedMood[key]) {
            aggregatedMood[key] += value
          } else {
            aggregatedMood[key] = value
          }
        })
      })

      // Calculate average
      Object.keys(aggregatedMood).forEach(key => {
        aggregatedMood[key] = Number((aggregatedMood[key] / history.length).toFixed(2))
      })

      setMoodData(aggregatedMood)
    }
  }, [])

  const chartData = Object.entries(moodData).map(([name, value]) => ({ name, value }))

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Статистика настроений</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}

