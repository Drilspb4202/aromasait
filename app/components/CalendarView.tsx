'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns'

interface CalendarViewProps {
  view: 'weekly' | 'monthly'
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function CalendarView({ view, selectedDate, onDateChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)

  const handlePrevious = () => {
    if (view === 'weekly') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }

  const handleNext = () => {
    if (view === 'weekly') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }

  const renderWeeklyView = () => {
    const start = startOfWeek(currentDate)
    const end = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <motion.div
            key={day.toString()}
            className={`p-4 text-center cursor-pointer rounded-lg transition-colors duration-200 ${
              isSameDay(day, selectedDate)
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDateChange(day)}
          >
            <div className="font-bold text-lg">{format(day, 'EEE')}</div>
            <div className="text-3xl font-light">{format(day, 'd')}</div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-green-200 dark:bg-green-800 p-4 rounded-lg">
        <Button variant="outline" onClick={handlePrevious} className="bg-white dark:bg-gray-800">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {view === 'weekly' ? 'Previous Week' : 'Previous Month'}
        </Button>
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
          {view === 'weekly'
            ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
            : format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" onClick={handleNext} className="bg-white dark:bg-gray-800">
          {view === 'weekly' ? 'Next Week' : 'Next Month'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      {view === 'weekly' ? (
        renderWeeklyView()
      ) : (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-lg border-0 shadow-lg bg-white dark:bg-gray-800"
        />
      )}
    </div>
  )
}

