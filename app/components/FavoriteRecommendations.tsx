'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Droplet, Utensils, Activity, Search, AlertTriangle, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface FavoriteItem {
  id: string
  user_id: string
  recommendation_id: string
  created_at: string
  type: 'oil' | 'recipe' | 'activity'
  data: {
    name: string
    description: string
    benefits?: string
    howToUse?: string
  }
}

export default function FavoriteRecommendations() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { data, error } = await supabase
        .from('favorite_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFavorites(data.map(item => ({
        ...item,
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
      })))
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Ошибка при загрузке избранного')
      toast.error('Ошибка при загрузке избранного')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_recommendations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFavorites(favorites.filter(item => item.id !== id))
      toast.success('Удалено из избранного')
      
      // Dispatch event to notify Recommendations component
      window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { id, action: 'remove' } }))
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Ошибка при удалении из избранного')
    }
  }

  const filteredFavorites = favorites.filter(item => 
    item.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'oil':
        return <Droplet className="h-4 w-4 text-blue-500" />
      case 'recipe':
        return <Utensils className="h-4 w-4 text-green-500" />
      case 'activity':
        return <Activity className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'oil':
        return 'Эфирное масло'
      case 'recipe':
        return 'Веганский рецепт'
      case 'activity':
        return 'Рекомендуемое занятие'
      default:
        return 'Рекомендация'
    }
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Загрузка избранного...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center text-red-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center text-gray-500">
          <p>У вас пока нет избранных рекомендаций</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Избранные рекомендации</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Поиск избранного..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <ScrollArea className="h-[400px]">
          <AnimatePresence>
            {filteredFavorites.map((item) => (
              <motion.div 
                key={item.id} 
                className="mb-4 p-4 bg-gray-50 rounded-lg relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  {getTypeIcon(item.type)}
                  <h3 className="font-semibold ml-2 text-sm text-gray-600">
                    {getTypeLabel(item.type)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 hover:bg-red-100 hover:text-red-500"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h4 className="font-medium text-lg mb-1">{item.data.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.data.description}</p>
                {item.data.benefits && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Польза:</strong> {item.data.benefits}
                  </div>
                )}
                {item.data.howToUse && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Применение:</strong> {item.data.howToUse}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Добавлено: {new Date(item.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

