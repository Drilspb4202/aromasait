'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MoodVisualizationProps {
  mood: Record<string, number>
}

const moodColors = {
  energy: ['#FF9900', '#FFD700'],
  happiness: ['#00CED1', '#40E0D0'],
  calmness: ['#98FB98', '#00FA9A'],
  stress: ['#FF6347', '#FF4500'],
  anxiety: ['#DDA0DD', '#EE82EE'],
  focus: ['#4169E1', '#1E90FF'],
  creativity: ['#FF69B4', '#FF1493'],
  motivation: ['#FFA500', '#FF8C00'],
  sleep_quality: ['#483D8B', '#6A5ACD'],
  social_connection: ['#20B2AA', '#48D1CC']
}

const moodTranslations: Record<string, string> = {
  energy: 'Энергичность',
  happiness: 'Счастье',
  calmness: 'Спокойствие',
  stress: 'Стресс',
  anxiety: 'Тревожность',
  focus: 'Концентрация',
  creativity: 'Креативность',
  motivation: 'Мотивация',
  sleep_quality: 'Качество сна',
  social_connection: 'Социальная связь'
}

export default function MoodVisualization({ mood }: MoodVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 640 ? window.innerWidth - 40 : 300
      setCanvasSize({ width, height: width })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const moodEntries = Object.entries(mood)
    const totalSegments = moodEntries.length
    const angleStep = (Math.PI * 2) / totalSegments

    moodEntries.forEach(([key, value], index) => {
      const startAngle = index * angleStep
      const endAngle = (index + 1) * angleStep

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius * (value / 10), startAngle, endAngle)
      ctx.closePath()

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, moodColors[key as keyof typeof moodColors][0])
      gradient.addColorStop(1, moodColors[key as keyof typeof moodColors][1])
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [mood, canvasSize])

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= radius) {
      const angle = Math.atan2(dy, dx)
      const moodEntries = Object.entries(mood)
      const totalSegments = moodEntries.length
      const angleStep = (Math.PI * 2) / totalSegments

      const index = Math.floor(((angle + Math.PI * 2) % (Math.PI * 2)) / angleStep)
      setHoveredMood(moodEntries[index][0])
    } else {
      setHoveredMood(null)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-center">Визуализация настроения</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <motion.canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onMouseMove={handleCanvasMouseMove}
          onTouchMove={(e) => {
            const touch = e.touches[0]
            if (touch) {
              handleCanvasMouseMove({
                clientX: touch.clientX,
                clientY: touch.clientY
              } as React.MouseEvent<HTMLCanvasElement>)
            }
          }}
          className="cursor-pointer mb-4"
        />
        {hoveredMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold mb-4"
          >
            {moodTranslations[hoveredMood]}: {mood[hoveredMood]}
          </motion.div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(mood).map(([key, value]) => (
            <motion.div
              key={key}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{
                  background: `linear-gradient(to right, ${moodColors[key as keyof typeof moodColors][0]}, ${moodColors[key as keyof typeof moodColors][1]})`
                }}
              />
              <span className="text-xs sm:text-sm">{moodTranslations[key]}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

