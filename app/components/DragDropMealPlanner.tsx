'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import NutritionalInfo from './NutritionalInfo'
import PortionAdjuster from './PortionAdjuster'
import { Plus, X, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Meal {
  id: string
  name: string
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  servings: number
}

interface MealPlan {
  [key: string]: Meal[]
}

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

interface DragDropMealPlannerProps {
  selectedDate: Date
}

export default function DragDropMealPlanner({ selectedDate }: DragDropMealPlannerProps) {
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  })

  useEffect(() => {
    fetchMealPlan()
  }, [selectedDate])

  const fetchMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate.toISOString().split('T')[0])
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setMealPlan(data.plan)
      } else {
        setMealPlan({
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
        })
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error)
      toast.error('Failed to load meal plan')
    }
  }

  const saveMealPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('meal_plans')
        .upsert({
          user_id: user.id,
          date: selectedDate.toISOString().split('T')[0],
          plan: mealPlan,
        })

      if (error) throw error

      toast.success('Meal plan saved successfully')
    } catch (error) {
      console.error('Error saving meal plan:', error)
      toast.error('Failed to save meal plan')
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    const sourceType = source.droppableId as keyof MealPlan
    const destType = destination.droppableId as keyof MealPlan

    const newMealPlan = { ...mealPlan }
    const [movedMeal] = newMealPlan[sourceType].splice(source.index, 1)
    newMealPlan[destType].splice(destination.index, 0, movedMeal)

    setMealPlan(newMealPlan)
  }

  const addMeal = (mealType: keyof MealPlan) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'New Meal',
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
      servings: 1,
    }

    setMealPlan(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], newMeal],
    }))
  }

  const removeMeal = (mealType: keyof MealPlan, mealId: string) => {
    setMealPlan(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(meal => meal.id !== mealId),
    }))
  }

  const updateMealServings = (mealType: keyof MealPlan, mealId: string, servings: number) => {
    setMealPlan(prev => ({
      ...prev,
      [mealType]: prev[mealType].map(meal =>
        meal.id === mealId ? { ...meal, servings } : meal
      ),
    }))
  }

  return (
    <div className="space-y-6 mt-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {mealTypes.map(mealType => (
          <Droppable key={mealType} droppableId={mealType}>
            {(provided) => (
              <Card {...provided.droppableProps} ref={provided.innerRef} className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
                  <CardTitle className="capitalize text-lg">{mealType}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {mealPlan[mealType].map((meal, index) => (
                    <Draggable key={meal.id} draggableId={meal.id} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-green-100 dark:bg-green-900 p-3 mb-2 rounded-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium text-green-800 dark:text-green-200">{meal.name}</span>
                          <div className="flex items-center space-x-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-white dark:bg-gray-700">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <NutritionalInfo nutritionalInfo={meal.nutritionalInfo} />
                              </PopoverContent>
                            </Popover>
                            <PortionAdjuster
                              servings={meal.servings}
                              onChange={(servings) => updateMealServings(mealType, meal.id, servings)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMeal(mealType, meal.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMeal(mealType)}
                    className="mt-2 w-full bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 text-green-800 dark:text-green-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <Button onClick={saveMealPlan} className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
        Save Meal Plan
      </Button>
    </div>
  )
}

