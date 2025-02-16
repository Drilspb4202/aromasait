'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MoodEntry {
  date: string
  mood: Record<string, number>
}

const moodColors: Record<string, string> = {
  happy: 'bg-yellow-400',
  sad: 'bg-blue-400',
  angry: 'bg-red-400',
  calm: 'bg-green-400',
  anxious: 'bg-purple-400',
}

export default function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem('moodHistory')
    if (storedHistory) {
      setMoodHistory(JSON.parse(storedHistory))
    }
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getMonthData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    return { year, month, daysInMonth, firstDayOfMonth }
  }

  const getMoodColor = (date: string) => {
    const entry = moodHistory.find(e => e.date.startsWith(date))
    if (!entry) return 'bg-gray-200'

    const dominantMood = Object.entries(entry.mood).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    return moodColors[dominantMood] || 'bg-gray-200'
  }

  const { year, month, daysInMonth, firstDayOfMonth } = getMonthData()

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(year, month + increment, 1))
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-between">
          <Button variant="ghost" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <Button variant="ghost" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="text-center font-bold">{day}</div>
          ))}
          {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            return (
              <motion.div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-full ${getMoodColor(dateString)}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {day}
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

