'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export default function RecipeSuggestions() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [preferences, setPreferences] = useState({
    lowCalorie: false,
    highProtein: false,
    glutenFree: false,
    nutFree: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRecipes()
  }, [preferences])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      let query = supabase.from('recipes').select('*')

      if (preferences.lowCalorie) {
        query = query.lt('nutritionalInfo->>calories', 500)
      }
      if (preferences.highProtein) {
        query = query.gt('nutritionalInfo->>protein', 20)
      }
      if (preferences.glutenFree) {
        query = query.eq('glutenFree', true)
      }
      if (preferences.nutFree) {
        query = query.eq('nutFree', true)
      }

      const { data, error } = await query.limit(10)

      if (error) throw error

      setRecipes(data as Recipe[])
    } catch (error) {
      console.error('Error fetching recipes:', error)
      toast.error('Failed to load recipe suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (preference: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [preference]: !prev[preference] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {Object.entries(preferences).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={() => handlePreferenceChange(key as keyof typeof preferences)}
            />
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          </label>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                  <div className="space-y-1">
                    <p>Calories: {recipe.nutritionalInfo.calories}</p>
                    <p>Protein: {recipe.nutritionalInfo.protein}g</p>
                    <p>Carbs: {recipe.nutritionalInfo.carbs}g</p>
                    <p>Fat: {recipe.nutritionalInfo.fat}g</p>
                  </div>
                  <Button className="mt-4 w-full">Add to Meal Plan</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

