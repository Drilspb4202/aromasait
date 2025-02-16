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
import { Card } from '@/components/ui/card'
import { Menu, Sun, Moon, Home, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import Sidebar from '@/components/Sidebar'
import Notifications from '@/app/components/Notifications'

// Динамический импорт компонентов
const DetailedMoodAssessment = lazy(() => import('@/app/components/DetailedMoodAssessment'))
const Recommendations = lazy(() => import('@/app/components/Recommendations'))
const MoodHistory = lazy(() => import('@/app/components/MoodHistory'))
const FavoriteRecommendations = lazy(() => import('@/app/components/FavoriteRecommendations'))
const MoodVisualization = lazy(() => import('@/app/components/MoodVisualization'))
const DailyTips = lazy(() => import('@/app/components/DailyTips'))
const SocialSharing = lazy(() => import('@/app/components/SocialSharing'))
const HabitTracker = lazy(() => import('@/app/components/HabitTracker'))
const EssentialOilGuide = lazy(() => import('@/app/components/EssentialOilGuide'))
const Achievements = lazy(() => import('@/app/components/Achievements'))
const AIAssistant = lazy(() => import('@/app/components/AIAssistant'))
const AromaMeditation = lazy(() => import('@/app/components/AromaMeditation'))
const PersonalizedRecipe = lazy(() => import('@/app/components/PersonalizedRecipe'))
const VirtualDiffuser = lazy(() => import('@/components/VirtualDiffuser'))
const SmartAssistant = lazy(() => import('@/app/components/SmartAssistant'))
const PlanningCalendar = lazy(() => import('@/app/components/PlanningCalendar'))
const AICoach = lazy(() => import('@/app/components/AICoach'))

export default function MainContent() {
  const [mood, setMood] = useState<Record<string, number> | null>(null)
  const [currentRecommendations, setCurrentRecommendations] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState('assessment')
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timeout)
  }, [])

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

  const handleMoodSubmit = (newMood: Record<string, number>) => {
    setMood(newMood)
    setCurrentRecommendations(null)
    setActiveTab('recommendations')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
        <Auth />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Загрузка вашего пространства...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        toggleSidebar={toggleSidebar} 
      />
      
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
                {activeTab.split('-').join(' ')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6 container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Suspense fallback={
                <Card className="p-8 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </Card>
              }>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="assessment">
                    <DetailedMoodAssessment onMoodSubmit={handleMoodSubmit} />
                    {mood && <MoodVisualization mood={mood} />}
                  </TabsContent>
                  
                  <TabsContent value="recommendations">
                    <div className="grid gap-6">
                      <DailyTips />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mood ? (
                          <Recommendations 
                            mood={JSON.stringify(mood)} 
                            currentRecommendations={currentRecommendations}
                            setCurrentRecommendations={setCurrentRecommendations}
                          />
                        ) : (
                          <Card className="p-8 text-center">
                            <p className="text-muted-foreground">
                              Пожалуйста, сначала оцените свое настроение
                            </p>
                          </Card>
                        )}
                        <FavoriteRecommendations />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <MoodHistory />
                  </TabsContent>
                  
                  <TabsContent value="recipes">
                    <div className="grid gap-6">
                      <Suspense fallback={<div className="flex justify-center items-center h-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                        <PersonalizedRecipe />
                      </Suspense>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meditation">
                    <AromaMeditation />
                  </TabsContent>
                  
                  <TabsContent value="aromatherapy">
                    <div className="grid gap-6">
                      <VirtualDiffuser />
                      <EssentialOilGuide />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social">
                    <SocialSharing />
                  </TabsContent>
                  
                  <TabsContent value="ai-assistant">
                    <AIAssistant />
                  </TabsContent>
                  
                  <TabsContent value="progress">
                    <div className="grid gap-6">
                      <HabitTracker />
                      <Achievements />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="smart-assistant">
                    <SmartAssistant />
                  </TabsContent>
                  
                  <TabsContent value="ai-coach">
                    <AICoach />
                  </TabsContent>
                  
                  <TabsContent value="calendar">
                    <PlanningCalendar />
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

