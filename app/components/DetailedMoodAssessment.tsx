'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Battery, Coffee, Target, Palette, Zap, Moon, Users, ArrowRight, ArrowLeft, Check, Smile } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface MoodDimension {
  name: string
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const moodDimensions: MoodDimension[] = [
  { name: 'energy', label: 'Энергичность', icon: <Battery className="w-6 h-6" />, description: 'Уровень физической и ментальной энергии', color: 'bg-yellow-500' },
  { name: 'happiness', label: 'Счастье', icon: <Zap className="w-6 h-6" />, description: 'Общее ощущение благополучия и радости', color: 'bg-green-500' },
  { name: 'calmness', label: 'Спокойствие', icon: <Coffee className="w-6 h-6" />, description: 'Уровень внутреннего спокойствия и умиротворения', color: 'bg-blue-500' },
  { name: 'focus', label: 'Концентрация', icon: <Target className="w-6 h-6" />, description: 'Способность фокусироваться и концентрироваться', color: 'bg-indigo-500' },
  { name: 'creativity', label: 'Креативность', icon: <Palette className="w-6 h-6" />, description: 'Уровень творческого мышления', color: 'bg-pink-500' },
  { name: 'sleep_quality', label: 'Качество сна', icon: <Moon className="w-6 h-6" />, description: 'Качество и продолжительность сна', color: 'bg-indigo-700' },
  { name: 'social_connection', label: 'Социальная связь', icon: <Users className="w-6 h-6" />, description: 'Уровень социального взаимодействия', color: 'bg-teal-500' },
]

interface DetailedMoodAssessmentProps {
  onMoodSubmit: (mood: Record<string, number>, dietPreference: number) => void
}

export default function DetailedMoodAssessment({ onMoodSubmit }: DetailedMoodAssessmentProps) {
  const [moodValues, setMoodValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(moodDimensions.map(dim => [dim.name, 5]))
  )
  const [dietPreference, setDietPreference] = useState(5) // 1-10: 1 - полностью здоровое, 10 - полностью веганское
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [currentDimension, setCurrentDimension] = useState(0)

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('mood_entries').select('count', { count: 'exact', head: true })
      setIsConnected(!error)
    } catch (error) {
      setIsConnected(false)
    }
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setMoodValues(prev => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!isConnected) {
        throw new Error('Нет подключения к базе данных')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Пожалуйста, войдите в систему')
        return
      }

      const moodEntry = {
        user_id: user.id,
        mood_data: moodValues,
        diet_preference: dietPreference,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodEntry)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message)
      }

      console.log('Mood entry saved:', data)
      onMoodSubmit(moodValues, dietPreference)
      setShowRecommendationDialog(true)
      toast.success('Настроение успешно сохранено')

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('moodUpdated'))
      }

    } catch (error) {
      console.error('Error saving mood:', error)
      toast.error('Ошибка при сохранении настроения: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextDimension = () => {
    if (currentDimension < moodDimensions.length - 1) {
      setCurrentDimension(currentDimension + 1)
    } else {
      handleSubmit(new Event('submit') as React.FormEvent)
    }
  }

  const prevDimension = () => {
    if (currentDimension > 0) {
      setCurrentDimension(currentDimension - 1)
    }
  }

  const getEmoji = (value: number) => {
    if (value <= 3) return '😔'
    if (value <= 7) return '😐'
    return '😊'
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 shadow-xl">
      <SectionHeader
        title="Оценка настроения"
        description="Оцените ваше текущее состояние и предпочтения в питании"
        icon={<Smile className="w-6 h-6 text-primary" />}
      />
      <CardContent className="p-6">
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded"
          >
            Ошибка подключения к базе данных. Пожалуйста, попробуйте позже.
          </motion.div>
        )}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDimension}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentDimension === moodDimensions.length ? (
                <div>
                  <Label className="text-lg font-medium mb-2 block">Предпочтения в питании</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Укажите ваши предпочтения между здоровым и веганским питанием
                  </p>
                  <div className="relative pt-1 mb-6">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[dietPreference]}
                      onValueChange={(value) => setDietPreference(value[0])}
                      className="w-full"
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Здоровое питание</span>
                      <span>Веганское питание</span>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-sm font-medium">
                        {dietPreference <= 3 ? 'Предпочтение здорового питания' :
                         dietPreference <= 7 ? 'Сбалансированный подход' :
                         'Предпочтение веганского питания'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                moodDimensions.map((dim, index) => (
                  <div key={dim.name} className={index === currentDimension ? '' : 'hidden'}>
                    <Label htmlFor={dim.name} className="flex items-center text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">
                      {dim.icon}
                      <span className="ml-2">{dim.label}</span>
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{dim.description}</p>
                    <div className="relative pt-1 mb-6">
                      <Slider
                        id={dim.name}
                        min={1}
                        max={10}
                        step={1}
                        value={[moodValues[dim.name]]}
                        onValueChange={(value) => handleSliderChange(dim.name, value)}
                        className="w-full"
                        aria-label={`Оценка ${dim.label}`}
                        aria-valuemin={1}
                        aria-valuemax={10}
                        aria-valuenow={moodValues[dim.name]}
                      />
                      <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Низкий</span>
                        <span>Высокий</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <motion.div
                        className="text-4xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        {getEmoji(moodValues[dim.name])}
                      </motion.div>
                      <div className="text-2xl font-bold">{moodValues[dim.name]}</div>
                      <Progress value={moodValues[dim.name] * 10} className={`w-2/3 ${dim.color}`} />
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={prevDimension} 
                disabled={currentDimension === 0}
                variant="outline"
              >
                <ArrowLeft className="mr-2" /> Назад
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Вернуться к предыдущему вопросу</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentDimension + 1} из {moodDimensions.length + 1}
          </span>
          <Progress 
            value={((currentDimension + 1) / (moodDimensions.length + 1)) * 100} 
            className="w-32 mt-2"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={currentDimension < moodDimensions.length ? nextDimension : handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                disabled={isSubmitting}
              >
                {currentDimension < moodDimensions.length ? (
                  <>Далее <ArrowRight className="ml-2" /></>
                ) : (
                  <>{isSubmitting ? 'Сохранение...' : 'Завершить'} <Check className="ml-2" /></>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentDimension < moodDimensions.length ? 'Перейти к следующему вопросу' : 'Сохранить оценку настроения'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
      <Dialog open={showRecommendationDialog} onOpenChange={setShowRecommendationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Рекомендации готовы!</DialogTitle>
            <DialogDescription>
              Ваше настроение успешно сохранено. Теперь вы можете посмотреть персонализированные рекомендации на основе вашей оценки настроения.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowRecommendationDialog(false)}>Посмотреть рекомендации</Button>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

