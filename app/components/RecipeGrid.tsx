'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, Utensils, Heart, Search, Filter, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Recipe {
  id: string
  name: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  ingredients: string[]
  instructions: string[]
  rating: number
  isFavorite: boolean
}

const categories = ['Все', 'Завтрак', 'Обед', 'Ужин', 'Перекус', 'Десерт']
const sortOptions = [
  { value: 'prepTime', label: 'Время подготовки' },
  { value: 'difficulty', label: 'Сложность' },
  { value: 'rating', label: 'Рейтинг' },
]

export default function RecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipes().catch(error => {
      console.error('Error in fetchRecipes:', error)
      toast.error('An unexpected error occurred. Please try again later.')
    })
  }, [])

  useEffect(() => {
    filterAndSortRecipes()
  }, [recipes, searchTerm, selectedCategory, sortBy])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
  
      if (error) {
        if (error.code === '42P01') {
          console.error('Table "recipes" does not exist:', error)
          setRecipes([])
          toast.error('Recipe data is not available. Please contact support.')
        } else {
          throw error
        }
      } else if (data) {
        const recipesWithFavorites = await addFavoritesToRecipes(data)
        setRecipes(recipesWithFavorites)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      toast.error('Failed to load recipes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const addFavoritesToRecipes = async (recipes: Recipe[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return recipes

    const { data: favorites, error } = await supabase
      .from('favorite_recipes')
      .select('recipe_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching favorites:', error)
      return recipes
    }

    const favoriteIds = new Set(favorites.map(f => f.recipe_id))
    return recipes.map(recipe => ({ ...recipe, isFavorite: favoriteIds.has(recipe.id) }))
  }

  const filterAndSortRecipes = () => {
    let filtered = recipes

    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory)
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(lowercasedTerm) ||
        recipe.description.toLowerCase().includes(lowercasedTerm) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercasedTerm))
      )
    }

    filtered.sort((a, b) => {
      if (sortBy === 'prepTime') return a.prepTime - b.prepTime
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      }
      return b.rating - a.rating
    })

    setFilteredRecipes(filtered)
  }

  const toggleFavorite = async (recipe: Recipe) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Пожалуйста, войдите в систему, чтобы добавить рецепт в избранное')
      return
    }

    const newIsFavorite = !recipe.isFavorite

    try {
      if (newIsFavorite) {
        await supabase
          .from('favorite_recipes')
          .insert({ user_id: user.id, recipe_id: recipe.id })
      } else {
        await supabase
          .from('favorite_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id)
      }

      setRecipes(recipes.map(r => 
        r.id === recipe.id ? { ...r, isFavorite: newIsFavorite } : r
      ))

      toast.success(newIsFavorite ? 'Рецепт добавлен в избранное' : 'Рецепт удален из избранного')
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Не удалось обновить избранное')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск рецептов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Сортировать по" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Рецепты не найдены
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes && filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(recipe)}
                        >
                          <Heart className={`h-5 w-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <CardTitle className="text-xl mb-2">{recipe.name}</CardTitle>
                      <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {recipe.prepTime + recipe.cookTime} мин
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                          <Utensils className="mr-1 h-3 w-3" />
                          {recipe.difficulty}
                        </Badge>
                        <Badge variant="secondary">
                          ★ {recipe.rating.toFixed(1)}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Ингредиенты
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <ul className="list-disc list-inside">
                            {recipe.ingredients.map((ingredient, index) => (
                              <li key={index} className="text-sm">{ingredient}</li>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

