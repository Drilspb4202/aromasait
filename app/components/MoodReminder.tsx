'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Switch } from '@/components/ui/switch'

export default function MoodReminder() {
  const [isReminderSet, setIsReminderSet] = useState(false)

  useEffect(() => {
    const reminderStatus = localStorage.getItem('moodReminderStatus')
    if (reminderStatus) {
      setIsReminderSet(JSON.parse(reminderStatus))
    }
  }, [])

  const toggleReminder = () => {
    const newStatus = !isReminderSet
    setIsReminderSet(newStatus)
    localStorage.setItem('moodReminderStatus', JSON.stringify(newStatus))

    if (newStatus) {
      // Устанавливаем напоминание
      const now = new Date()
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0) // 20:00
      
      const timeUntilReminder = reminderTime.getTime() - now.getTime()
      if (timeUntilReminder < 0) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }

      setTimeout(() => {
        toast('Время оценить ваше настроение!', {
          icon: '🌈',
          duration: 5000,
        })
      }, reminderTime.getTime() - now.getTime())

      toast.success('Напоминание установлено на 20:00')
    } else {
      toast.success('Напоминание отключено')
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          {isReminderSet ? <Bell className="mr-2 text-purple-600" /> : <BellOff className="mr-2 text-gray-400" />}
          Напоминание
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <p className="mb-4 text-center">
            {isReminderSet
              ? 'Напоминание установлено на 20:00 каждый день.'
              : 'Напоминание не установлено.'}
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isReminderSet}
              onCheckedChange={toggleReminder}
              id="reminder-switch"
            />
            <label htmlFor="reminder-switch" className="text-sm font-medium">
              {isReminderSet ? 'Отключить напоминание' : 'Включить напоминание'}
            </label>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

