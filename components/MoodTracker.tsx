'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useUser } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { Heart, Brain, Sun, ArrowLeft, Cloud, CloudRain, CloudSun, Moon, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const moodOptions = [
  { value: 0, emoji: '😢', label: 'Очень грустно', icon: CloudRain, color: 'from-blue-400 to-gray-400', weather: 'Дождливо' },
  { value: 2, emoji: '😞', label: 'Грустно', icon: Cloud, color: 'from-gray-400 to-gray-300', weather: 'Пасмурно' },
  { value: 4, emoji: '😐', label: 'Нормально', icon: Cloud, color: 'from-gray-300 to-blue-300', weather: 'Облачно' },
  { value: 6, emoji: '🙂', label: 'Хорошо', icon: CloudSun, color: 'from-blue-300 to-yellow-200', weather: 'Прояснение' },
  { value: 8, emoji: '😊', label: 'Отлично', icon: Sun, color: 'from-yellow-200 to-yellow-400', weather: 'Солнечно' },
  { value: 10, emoji: '😃', label: 'Восхитительно', icon: Zap, color: 'from-yellow-400 to-orange-400', weather: 'Прекрасно' }
]

const energyOptions = [
  { value: 0, emoji: '😴', label: 'Нет сил', icon: Moon, color: 'from-indigo-900 to-purple-900' },
  { value: 2, emoji: '🥱', label: 'Сонливость', icon: Moon, color: 'from-purple-900 to-purple-700' },
  { value: 4, emoji: '😐', label: 'Немного устал', icon: CloudSun, color: 'from-purple-700 to-purple-500' },
  { value: 6, emoji: '🙂', label: 'Есть силы', icon: Sun, color: 'from-purple-500 to-yellow-500' },
  { value: 8, emoji: '💪', label: 'Энергичен', icon: Sun, color: 'from-yellow-500 to-orange-500' },
  { value: 10, emoji: '⚡', label: 'Полон энергии', icon: Zap, color: 'from-orange-500 to-red-500' }
]

const stressOptions = [
  { value: 0, emoji: '😌', label: 'Спокоен', icon: Sun, color: 'from-green-400 to-blue-400' },
  { value: 2, emoji: '😊', label: 'Расслаблен', icon: CloudSun, color: 'from-blue-400 to-purple-400' },
  { value: 4, emoji: '😐', label: 'Немного напряжен', icon: Cloud, color: 'from-purple-400 to-pink-400' },
  { value: 6, emoji: '😟', label: 'Тревожно', icon: CloudRain, color: 'from-pink-400 to-red-400' },
  { value: 8, emoji: '😰', label: 'Сильный стресс', icon: CloudRain, color: 'from-red-400 to-red-500' },
  { value: 10, emoji: '😫', label: 'Очень тревожно', icon: CloudRain, color: 'from-red-500 to-red-600' }
]

const getOptionByValue = (value: number, options: typeof moodOptions) => {
  const index = Math.floor((value / 10) * 5)
  return options[Math.min(index, options.length - 1)]
}

export function MoodTracker() {
  const [mood, setMood] = useState(5)
  const [energy, setEnergy] = useState(5)
  const [stress, setStress] = useState(5)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moodHistory, setMoodHistory] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const { toast } = useToast()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      fetchMoodHistory()
    }
  }, [user])

  const fetchMoodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_tracker')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setMoodHistory(data || [])
    } catch (error) {
      console.error('Error fetching mood history:', error)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('mood_tracker')
        .insert({
          user_id: user.id,
          mood,
          energy,
          stress,
          notes
        })

      if (error) throw error

      toast({
        title: 'Успешно',
        description: 'Ваше состояние записано'
      })

      fetchMoodHistory()
      setNotes('')
      setCurrentStep(0)
    } catch (error) {
      console.error('Error saving mood:', error)
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      title: 'Настроение',
      description: 'Как вы себя чувствуете?',
      value: mood,
      setValue: setMood,
      options: moodOptions
    },
    {
      title: 'Энергия',
      description: 'Оцените ваш уровень энергии',
      value: energy,
      setValue: setEnergy,
      options: energyOptions
    },
    {
      title: 'Стресс',
      description: 'Насколько вы напряжены?',
      value: stress,
      setValue: setStress,
      options: stressOptions
    }
  ]

  const currentStepData = steps[currentStep]
  const currentOption = getOptionByValue(currentStepData.value, currentStepData.options)
  const Icon = currentOption.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Фон с погодой */}
          <div className={`h-40 bg-gradient-to-r ${currentOption.color} p-6 relative overflow-hidden`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute right-6 top-6 text-white/80"
            >
              <Icon size={120} />
            </motion.div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}
                <h2 className="text-3xl font-bold">{currentStepData.title}</h2>
              </div>
              <p className="text-white/80 mt-2">{currentStepData.description}</p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Эмоджи и описание */}
            <div className="text-center">
              <motion.div
                key={currentStepData.value}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-7xl mb-4"
              >
                {currentOption.emoji}
              </motion.div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {currentOption.label}
              </p>
              {currentStep === 0 && currentOption.weather && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentOption.weather}
                </p>
              )}
            </div>

            {/* Опции настроения */}
            <div className="grid grid-cols-3 gap-3">
              {currentStepData.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => currentStepData.setValue(option.value)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                    currentStepData.value === option.value
                      ? 'bg-gradient-to-r ' + option.color + ' text-white'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs text-center">{option.label}</span>
                </motion.button>
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Добавьте заметку о вашем самочувствии..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] bg-gray-50 dark:bg-gray-700 border-0 resize-none"
                />

                <Button 
                  onClick={handleSubmit}
                  className={`w-full h-12 text-lg font-medium bg-gradient-to-r ${currentOption.color}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className={`w-full h-12 text-lg font-medium bg-gradient-to-r ${currentOption.color}`}
              >
                Далее
              </Button>
            )}

            {/* Индикатор прогресса */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-gradient-to-r ' + currentOption.color
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* История настроения */}
        {moodHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              История настроения
            </h3>
            <div className="space-y-4">
              {moodHistory.map((entry, index) => {
                const moodOption = getOptionByValue(entry.mood, moodOptions)
                const energyOption = getOptionByValue(entry.energy, energyOptions)
                const stressOption = getOptionByValue(entry.stress, stressOptions)

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">{moodOption.emoji}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(entry.created_at), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${moodOption.color} text-white`}>
                            {moodOption.label}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${energyOption.color} text-white`}>
                            {energyOption.label}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${stressOption.color} text-white`}>
                            {stressOption.label}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}