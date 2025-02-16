'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Utensils, ShoppingCart, Sparkles } from 'lucide-react'
import DragDropMealPlanner from './DragDropMealPlanner'
import CalendarView from './CalendarView'
import RecipeSuggestions from './RecipeSuggestions'
import ShoppingList from './ShoppingList'

export default function VeganMenuPlanner() {
  const [activeTab, setActiveTab] = useState('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <Card className="w-full max-w-7xl mx-auto overflow-hidden bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900 dark:to-teal-800 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6">
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
          <Utensils className="mr-2 h-8 w-8" />
          Vegan Menu Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-4 bg-green-100 dark:bg-green-800 p-2 rounded-lg">
            {[
              { value: 'weekly', label: 'Weekly View', icon: CalendarDays },
              { value: 'monthly', label: 'Monthly View', icon: CalendarDays },
              { value: 'suggestions', label: 'Recipe Suggestions', icon: Sparkles },
              { value: 'shopping', label: 'Shopping List', icon: ShoppingCart },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-700"
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <TabsContent value="weekly">
                <CalendarView view="weekly" selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <DragDropMealPlanner selectedDate={selectedDate} />
              </TabsContent>
              <TabsContent value="monthly">
                <CalendarView view="monthly" selectedDate={selectedDate} onDateChange={setSelectedDate} />
              </TabsContent>
              <TabsContent value="suggestions">
                <RecipeSuggestions />
              </TabsContent>
              <TabsContent value="shopping">
                <ShoppingList />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

