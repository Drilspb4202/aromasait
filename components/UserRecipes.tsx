'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/lib/oils-data'
import { Card, CardContent } from '@/components/ui/card'

interface UserRecipesProps {
  userId: string
  onApplyRecipe: (recipe: Recipe) => void
}

export const UserRecipes: React.FC<UserRecipesProps> = ({ userId, onApplyRecipe }) => {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    // В будущем здесь будет загрузка рецептов пользователя
    setUserRecipes([])
  }, [userId])

  if (userRecipes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">У вас пока нет сохраненных рецептов</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userRecipes.map(recipe => (
        <Card key={recipe.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{recipe.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
            <button
              onClick={() => onApplyRecipe(recipe)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Применить рецепт
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 