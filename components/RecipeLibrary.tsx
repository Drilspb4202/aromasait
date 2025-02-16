'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Star, Clock, Heart, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useUser } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { Badge } from '@/components/ui/badge'

interface Recipe {
  id: string
  name: string
  oils: Array<{
    name: string
    amount: number
    color: string
    description: string
    icon: string
  }>
  effect: string
  mood: string[]
  timeOfDay: string[]
  benefits: string[]
  category: string
}

interface RecipeLibraryProps {
  onApplyRecipe: (recipe: Recipe) => void
}

export const RecipeLibrary: React.FC<RecipeLibraryProps> = ({ onApplyRecipe }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMood, setCurrentMood] = useState<string>('радость')
  const { user } = useUser()

  const loadRecipes = async () => {
    try {
      // Загружаем предустановленные рецепты
      const { data: presetRecipes, error: presetError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (presetError) throw presetError

      // Загружаем сохраненные пользователем рецепты
      if (user) {
        const { data: userRecipes, error: userError } = await supabase
          .from('user_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (userError) throw userError
        setSavedRecipes(userRecipes || [])
      }

      setRecipes(presetRecipes || [])
    } catch (error) {
      console.error('Error loading recipes:', error)
      toast.error('Не удалось загрузить рецепты')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRecipe = async (recipeId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id)

      if (error) throw error

      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
      toast.success('Рецепт удален')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      toast.error('Не удалось удалить рецепт')
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [user])

  const renderRecipeCard = (recipe: Recipe, index: number, isSaved = false) => (
    <Card key={recipe.id || index} className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <div className="flex gap-2">
            {isSaved && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteRecipe(recipe.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {recipe.timeOfDay && recipe.timeOfDay.map(time => (
              <Badge key={time} variant="secondary" className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <strong>Состав:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {recipe.oils && recipe.oils.map((oil, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-lg">{oil.icon}</span>
                  <span>{oil.name} - {oil.amount} капель</span>
                </li>
              ))}
            </ul>
          </div>

          {recipe.effect && (
            <div className="text-sm text-gray-600">
              <strong>Эффект:</strong>
              <p className="mt-1">{recipe.effect}</p>
            </div>
          )}

          {recipe.benefits && recipe.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {benefit}
                </Badge>
              ))}
            </div>
          )}

          {recipe.mood && recipe.mood.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.mood.map((mood, index) => (
                <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Heart className="w-3 h-3 mr-1" />
                  {mood}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            onClick={() => onApplyRecipe(recipe)}
          >
            Применить рецепт
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="recommendations" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
        <TabsTrigger value="by-mood">По настроению</TabsTrigger>
        <TabsTrigger value="saved">Мои рецепты</TabsTrigger>
        <TabsTrigger value="all">Все рецепты</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendations">
        {!user ? (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Требуется авторизация</h3>
            <p className="text-gray-600">Войдите в систему, чтобы получать персонализированные рекомендации</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Загружаем рекомендации...</p>
          </div>
        ) : (
          <div className="space-y-6 p-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Персональные рекомендации</h3>
              <p className="text-gray-600">Рецепты, подобранные специально для вас на основе ваших предпочтений</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes
                .filter(recipe => recipe.category === 'Рекомендованные')
                .map((recipe, index) => renderRecipeCard(recipe, index))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="by-mood">
        <div className="p-4 space-y-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {['радость', 'спокойствие', 'концентрация', 'энергия', 'расслабление', 'гармония'].map(mood => (
              <Button
                key={mood}
                variant={currentMood === mood ? "default" : "outline"}
                onClick={() => setCurrentMood(mood)}
                className={`${currentMood === mood ? 'bg-blue-500 text-white' : ''} transition-all`}
              >
                {mood}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes
              .filter(recipe => recipe.mood.includes(currentMood))
              .map((recipe, index) => renderRecipeCard(recipe, index))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="saved">
        <div className="p-4">
          {!user ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Требуется авторизация</h3>
              <p className="text-gray-600">Войдите в систему, чтобы видеть сохраненные рецепты</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Загружаем ваши рецепты...</p>
            </div>
          ) : savedRecipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">У вас пока нет сохраненных рецептов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe, index) => renderRecipeCard(recipe, index, true))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="all">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => renderRecipeCard(recipe, index))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
} 