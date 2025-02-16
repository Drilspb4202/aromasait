'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'

interface MoodAssessmentProps {
  onSubmit: (values: { energy: number }) => void
}

export default function MoodAssessment({ onSubmit }: MoodAssessmentProps) {
  const [energy, setEnergy] = useState(5)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setEnergy(value)
    e.target.style.setProperty('--value', `${(value / 10) * 100}%`)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white/95 backdrop-blur-lg shadow-lg rounded-[32px]">
      <div className="flex flex-col items-center space-y-8">
        {/* Заголовок */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-violet-100/50 flex items-center justify-center">
            <Smile className="w-8 h-8 text-violet-500" />
          </div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            Оценка настроения
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Оцените ваше текущее состояние и предпочтения в питании
          </p>
        </div>

        {/* Шкала энергичности */}
        <div className="w-full space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-violet-100/50 flex items-center justify-center">
              <span className="text-violet-500 text-lg">⚡</span>
            </div>
            <div>
              <div className="font-medium text-gray-800 text-lg">Энергичность</div>
              <div className="text-sm text-gray-500">Уровень физической и ментальной энергии</div>
            </div>
          </div>

          {/* Слайдер */}
          <div className="w-full px-1">
            <input
              type="range"
              min="0"
              max="10"
              value={energy}
              onChange={handleSliderChange}
              className="mood-slider"
              style={{ '--value': `${(energy / 10) * 100}%` } as React.CSSProperties}
            />
          </div>

          {/* Метки */}
          <div className="flex justify-between text-sm text-gray-400 px-1">
            <span>Низкий</span>
            <span>Высокий</span>
          </div>

          {/* Текущее значение */}
          <div className="flex items-center space-x-2 justify-center">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg shadow-lg"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: 0,
              }}
            >
              {energy}
            </motion.div>
            <div className="text-sm text-gray-400">из 10</div>
          </div>
        </div>

        {/* Прогресс */}
        <div className="w-full text-center text-sm text-gray-400">
          1 из 8
        </div>

        {/* Кнопки навигации */}
        <div className="flex justify-between w-full pt-4">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            onClick={() => window.history.back()}
          >
            Назад
          </Button>
          <Button
            className="px-8 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => onSubmit({ energy })}
          >
            Далее
          </Button>
        </div>
      </div>
    </Card>
  )
}

