'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Auth from '@/components/Auth'
import UserProfile from '@/components/UserProfile'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import ProfileMenu from '@/components/ProfileMenu'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Menu, Sun, Moon, Brain, Home, Loader2, Smile, BarChart2, TrendingUp, Utensils, Feather, Droplet, ClipboardList, Bot, Award } from 'lucide-react' // Added Brain and Home imports, and Loader2 from lucide-react
import { useTheme } from 'next-themes'
import Sidebar from '@/components/Sidebar'
import ProgressTracker from '@/app/components/ProgressTracker' // Added import
import AICoach from '@/app/components/AICoach' // Added AICoach import
import Notifications from '@/app/components/Notifications' // Added Notifications import
import ThemeToggle from '@/app/components/ThemeToggle'; // Added ThemeToggle import


// Динамический импорт компонентов
const DetailedMoodAssessment = lazy(() => import('@/app/components/DetailedMoodAssessment'))
const Recommendations = lazy(() => import('@/app/components/Recommendations'))
//const MoodHistory = lazy(() => import('@/app/components/MoodHistory'))
const FavoriteRecommendations = lazy(() => import('@/app/components/FavoriteRecommendations'))
const MoodVisualization = lazy(() => import('@/app/components/MoodVisualization'))
const DailyTips = lazy(() => import('@/app/components/DailyTips'))
//const SocialSharing = lazy(() => import('@/app/components/SocialSharing'))
const HabitTracker = lazy(() => import('@/app/components/HabitTracker'))
const EssentialOilGuide = lazy(() => import('@/app/components/EssentialOilGuide'))
const Achievements = lazy(() => import('@/app/components/Achievements'))
const AIAssistant = lazy(() => import('@/app/components/AIAssistant'))
const AromaMeditation = lazy(() => import('@/app/components/AromaMeditation'))
const PersonalizedRecipe = lazy(() => import('@/app/components/PersonalizedRecipe'))
const VirtualDiffuser = lazy(() => import('@/components/VirtualDiffuser'))
const SmartAssistant = lazy(() => import('@/app/components/SmartAssistant'))
const PlanningCalendar = lazy(() => import('@/app/components/PlanningCalendar'))

const menuItems = [
  { 
    group: "Основное",
    items: [
      { value: 'assessment', label: 'Оценка настроения', icon: Smile },
      { value: 'recommendations', label: 'Рекомендации', icon: BarChart2 },
      { value: 'progress', label: 'Прогресс', icon: TrendingUp },
    ]
  },
  {
    group: "Инструменты",
    items: [
      { value: 'recipes', label: 'Рецепты', icon: Utensils },
      { value: 'meditation', label: 'Медитация', icon: Feather },
      { value: 'aromatherapy', label: 'Ароматерапия', icon: Droplet },
      { value: 'habit-tracker', label: 'Трекер привычек', icon: ClipboardList },
    ]
  },
  {
    group: "AI и планирование",
    items: [
      { value: 'ai-assistant', label: 'AI-ассистент', icon: Bot },
      { value: 'smart-assistant', label: 'Умный ассистент', icon: Brain },
      { value: 'ai-coach', label: 'AI-коуч', icon: Brain },
    ]
  },
  {
    group: "Достижения",
    items: [
      { value: 'achievements', label: 'Достижения', icon: Award },
    ]
  }
];

export default function MainContent() {
  const [currentMood, setCurrentMood] = useState<Record<string, number> | null>(null)
  const [currentRecommendations, setCurrentRecommendations] = useState<any | null>(null)
  const [currentRecipe, setCurrentRecipe] = useState<any | null>(null)
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState('assessment')
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (user) {
      const channel = supabase.channel('online_users')
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await supabase.from('online_users').upsert({ 
            id: user.id, 
            username: user.user_metadata.full_name || user.email 
          })
        }
      })

      return () => {
        channel.unsubscribe()
      }
    }
  }, [user])

  const handleMoodSubmit = (mood: Record<string, number>) => {
    setCurrentMood(mood)
    setCurrentRecommendations(null)
    setCurrentRecipe(null)
    setActiveTab('recommendations')
  }

  const handleAddToMealPlanner = (recipe: any) => {
    setGeneratedRecipe(recipe)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Вы успешно вышли из системы')
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('Ошибка при выходе из системы')
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900">
        <Auth />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-40 h-16">
          <div className="container mx-auto h-full px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold capitalize">
                {(() => {
                  const translations: Record<string, string> = {
                    'assessment': 'Оценка настроения',
                    'recommendations': 'Рекомендации',
                    'progress': 'Прогресс',
                    'recipes': 'Рецепты',
                    'meditation': 'Медитация',
                    'aromatherapy': 'Ароматерапия',
                    'ai-assistant': 'AI-ассистент',
                    'smart-assistant': 'Умный ассистент',
                    'ai-coach': 'AI-коуч',
                    'achievements': 'Достижения',
                    'habit-tracker': 'Трекер привычек'
                  }
                  return translations[activeTab] || activeTab
                })()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Добавляем кнопку возврата на лендинг */}
              <Button variant="ghost" onClick={() => router.push('/')} className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                На главную
              </Button>
              <Notifications />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="hover:bg-accent"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <ProfileMenu onProfileOpen={() => setIsProfileOpen(true)} />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<div className="flex justify-center items-center h-full">Loading...</div>}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="assessment">
                    <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                      <DetailedMoodAssessment onMoodSubmit={handleMoodSubmit} />
                    </Suspense>
                    {currentMood && <MoodVisualization mood={currentMood} />}
                  </TabsContent>
                  <TabsContent value="recommendations">
                    <Card>
                      <CardContent className="p-6">
                        <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                          <DailyTips />
                        </Suspense>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {currentMood ? (
                            <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                              <Recommendations 
                                mood={JSON.stringify(currentMood)} 
                                currentRecommendations={currentRecommendations}
                                setCurrentRecommendations={setCurrentRecommendations}
                              />
                            </Suspense>
                          ) : (
                            <p className="text-center text-muted-foreground my-8">Пожалуйста, сначала оцените свое настроение.</p>
                          )}
                          <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                            <FavoriteRecommendations />
                          </Suspense>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="recipes">
                    <Card>
                      <CardContent className="p-6">
                        {currentMood ? (
                          <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                            <PersonalizedRecipe 
                              mood={currentMood} 
                              currentRecipe={currentRecipe}
                              setCurrentRecipe={setCurrentRecipe}
                              onAddToMealPlanner={handleAddToMealPlanner}
                            />
                          </Suspense>
                        ) : (
                          <p className="text-center text-gray-600 dark:text-gray-400 my-8">Пожалуйста, сначала оцените свое настроение для получения персонализированного рецепта.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="meditation">
                    <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                      <AromaMeditation />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="aromatherapy">
                    <VirtualDiffuser />
                    <EssentialOilGuide />
                  </TabsContent>
                  <TabsContent value="ai-assistant">
                    <AIAssistant />
                  </TabsContent>
                  <TabsContent value="progress">
                    <ProgressTracker />
                  </TabsContent>
                  <TabsContent value="achievements">
                    <Achievements />
                  </TabsContent>
                  <TabsContent value="habit-tracker">
                    <HabitTracker />
                  </TabsContent>
                  <TabsContent value="smart-assistant">
                    <SmartAssistant />
                  </TabsContent>
                  <TabsContent value="ai-coach">
                    <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                      <AICoach />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {isProfileOpen && (
        <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  )
}

