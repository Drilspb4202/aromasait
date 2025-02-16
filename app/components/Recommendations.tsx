'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Heart, Droplet, Utensils, Activity, ChevronDown, ChevronUp, AlertTriangle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { SectionHeader } from '@/components/ui/section-header'

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('count', { count: 'exact', head: true })
    return !error
  } catch (error) {
    console.error('Error checking Supabase connection:', error)
    return false
  }
}

interface RecommendationsProps {
  mood: string
  currentRecommendations: any | null
  setCurrentRecommendations: React.Dispatch<React.SetStateAction<any | null>>
}

interface RecommendationItem {
  name: string
  description: string
  benefits: string
  howToUse: string
}

interface RecommendationData {
  oil: RecommendationItem
  recipe: RecommendationItem
  activity: RecommendationItem
}

export default function Recommendations({ mood, currentRecommendations, setCurrentRecommendations }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [isConnected, setIsConnected] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    checkSupabaseConnection().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (mood && !currentRecommendations && isConnected) {
      fetchRecommendations()
    } else if (currentRecommendations) {
      setRecommendations(currentRecommendations)
    }
  }, [mood, currentRecommendations, isConnected])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('favorite_recommendations')
          .select('id, type')
          .eq('user_id', user.id)

        if (error) throw error

        setFavorites(new Set(data.map(item => item.id)))
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }

    fetchFavorites()
  }, [])

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, userPreferences: getUserPreferences() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setRecommendations(data)
      setCurrentRecommendations(data)
      await saveRecommendations(data)

    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to fetch recommendations. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const saveRecommendations = async (recommendations: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { data: moodEntry, error: moodError } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (moodError) throw moodError

      if (moodEntry) {
        const { error: saveError } = await supabase
          .from('recommendations')
          .insert({
            user_id: user.id,
            mood_entry_id: moodEntry.id,
            oil: recommendations.oil,
            recipe: recommendations.recipe,
            activity: recommendations.activity
          })

        if (saveError) throw saveError

        console.log('Recommendations saved successfully')

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('moodUpdated'))
        }
      }
    } catch (err) {
      console.error('Error saving recommendations:', err)
      toast.error('Не удалось сохранить рекомендации: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'))
    }
  }

  const addToFavorites = async (type: 'oil' | 'recipe' | 'activity', item: RecommendationItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { data: recommendationData } = await supabase
        .from('recommendations')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (recommendationData) {
        const { data, error } = await supabase
          .from('favorite_recommendations')
          .insert({
            user_id: user.id,
            recommendation_id: recommendationData.id,
            type: type,
            data: JSON.stringify(item)
          })
          .select()

        if (error) throw error

        if (data && data[0]) {
          setFavorites(prev => new Set([...prev, data[0].id]))
          toast.success('Добавлено в избранное!')
          window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { id: data[0].id, action: 'add' } }))
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Ошибка при добавлении в избранное')
    }
  }

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const nextRecommendation = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3)
  }

  const prevRecommendation = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3)
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center text-red-500 dark:text-red-400">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          {error}
        </CardContent>
      </Card>
    )
  }

  if (!recommendations) {
    return null
  }

  const icons = {
    oil: <Droplet className="h-6 w-6" />,
    recipe: <Utensils className="h-6 w-6" />,
    activity: <Activity className="h-6 w-6" />,
  }

  const recommendationTypes = ['oil', 'recipe', 'activity']
  const currentType = recommendationTypes[currentIndex]
  const currentRecommendation = recommendations[currentType as keyof RecommendationData]

  return (
    <Card className="mb-8 overflow-hidden">
      <SectionHeader
        title="Персональные рекомендации"
        description="Основаны на вашем текущем настроении и предпочтениях"
        icon={<Sparkles className="w-6 h-6 text-primary" />}
      />
      <CardHeader>
        <CardTitle className="text-2xl text-center">Персональные рекомендации</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {!isConnected && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded flex items-center">
            <AlertTriangle className="mr-2" />
            Ошибка подключения к базе данных. Рекомендации могут быть недоступны.
          </div>
        )}
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300, y:20 }}
            animate={{ opacity: 1, x: 0, y:0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300, y:20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.5 }}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 p-6 rounded-lg shadow-lg border border-purple-100 dark:border-purple-800"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                {icons[currentType as keyof typeof icons]}
              </div>
              <h3 className="text-xl font-semibold ml-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {currentType === 'oil' && 'Эфирное масло'}
                {currentType === 'recipe' && 'Веганский рецепт'}
                {currentType === 'activity' && 'Рекомендуемое занятие'}
              </h3>
            </div>
            <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">{currentRecommendation.name}</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{currentRecommendation.description}</p>
            <AnimatePresence>
              {expandedItems[currentType] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-600 dark:text-gray-400"
                >
                  <h5 className="font-semibold mt-2 dark:text-gray-300">Польза:</h5>
                  <p>{currentRecommendation.benefits}</p>
                  <h5 className="font-semibold mt-2 dark:text-gray-300">Как использовать:</h5>
                  <p>{currentRecommendation.howToUse}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(currentType)}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {expandedItems[currentType] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Скрыть
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Подробнее
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addToFavorites(currentType as 'oil' | 'recipe' | 'activity', currentRecommendation)}
              >
                <Heart className={`h-5 w-5 ${favorites.has(currentType) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
          <Button onClick={prevRecommendation} variant="outline" className="bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-300">
            <ArrowLeft className="mr-2" /> Предыдущая
          </Button>
          <Button onClick={nextRecommendation} variant="outline" className="bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-300">
            Следующая <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getUserPreferences() {
  // В реальном приложении здесь бы загружались предпочтения пользователя
  return {
    favoriteOils: ['Лаванда', 'Мята'],
    dietaryRestrictions: ['Без глютена'],
    activityLevel: 'Средний',
  }
}

function getPrompt(parsedMood: any, userPreferences: any) {
  const prompt = `Как эксперт по ароматерапии и веганскому питанию, предоставьте персонализированные рекомендации для человека со следующими параметрами настроения и предпочтениями:

Настроение:
${Object.entries(parsedMood).map(([key, value]) => `${key}: ${value}`).join('\n')}

Учтите все аспекты настроения, включая энергичность, счастье, спокойствие, стресс, тревожность, концентрацию, креативность, мотивацию, качество сна и социальную связь.

Предпочтения пользователя:
Любимые масла: ${userPreferences.favoriteOils.join(', ')}
Диетические ограничения: ${userPreferences.dietaryRestrictions.join(', ')}
Уровень активности: ${userPreferences.activityLevel}

Ответ должен быть в формате JSON:
{
  "oil": {
    "name": "название эфирного масла",
    "description": "краткое описание эфирного масла",
    "benefits": "подробное описание пользы масла для текущего настроения",
    "howToUse": "инструкции по использованию масла"
  },
  "recipe": {
    "name": "название веганского рецепта",
    "description": "краткое описание рецепта",
    "benefits": "подробное описание пользы рецепта для текущего настроения",
    "howToUse": "инструкции по приготовлению блюда"
  },
  "activity": {
    "name": "название рекомендуемого занятия",
    "description": "краткое описание занятия",
    "benefits": "подробное описание пользы занятия для текущего настроения",
    "howToUse": "инструкции по выполнению занятия"
  }
}`
  return prompt;
}

