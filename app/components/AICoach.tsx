'use client'

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from 'react-hot-toast'
import { Brain, Send, Loader2, ThumbsUp, ThumbsDown, TrendingUp, Target, Calendar, Sparkles, PlusCircle, BarChart2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import LazyComponent from '@/components/ui/lazy-component'

// Ленивая загрузка компонентов
const GoalProgress = lazy(() => import('./GoalProgress'))
const GoalSetting = lazy(() => import('./GoalSetting'))

interface Message {
  content: string
  isUser: boolean
}

interface Recommendation {
  type: 'aromatherapy' | 'nutrition' | 'exercise' | 'mindfulness'
  content: string
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  category: string
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  // const [goals, setGoals] = useState<Goal[]>([])
  const [activeTab, setActiveTab] = useState('chat')
  const [showGoalSetting, setShowGoalSetting] = useState(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedMessages = localStorage.getItem('aiCoachMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aiCoachMessages', JSON.stringify(messages))
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (user) {
      fetchRecommendations()
      // fetchGoals()
    }
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/ai-coach-recommendations')
      if (!response.ok) {
        throw new Error('Unauthorized')
      }
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast.error('Не удалось загрузить рекомендации')
    }
  }

  // const fetchGoals = async () => {
  //   try {
  //     const response = await fetch('/api/goals')
  //     const data = await response.json()
  //     if (response.ok) {
  //       setGoals(data.goals)
  //     } else {
  //       throw new Error(data.error || 'Failed to fetch goals')
  //     }
  //   } catch (error) {
  //     console.error('Error fetching goals:', error)
  //     toast.error('Не удалось загрузить цели')
  //   }
  // }

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { content: input, isUser: true }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const maxRetries = 3
    let retries = 0

    while (retries < maxRetries) {
      try {
        const response = await fetch('/api/ai-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        })
        const data = await response.json()

        if (response.ok) {
          setMessages([...newMessages, { content: data.response, isUser: false }])
          return
        } else {
          throw new Error(data.error || 'Failed to get AI response')
        }
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error)
        retries++
        if (retries === maxRetries) {
          setMessages([...newMessages, { content: "Извините, у меня возникли проблемы с ответом. Пожалуйста, попробуйте еще раз позже.", isUser: false }])
          toast.error('Не удалось получить ответ от AI-коуча. Попробуйте еще раз позже.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }, [input, messages])

  const handleFeedback = async (messageIndex: number, isPositive: boolean) => {
    try {
      await fetch('/api/ai-coach-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIndex, isPositive }),
      })
      toast.success('Спасибо за ваш отзыв!')
    } catch (error) {
      console.error('Error sending feedback:', error)
      toast.error('Не удалось отправить отзыв')
    }
  }

  const handleAddGoal = () => {
    setShowGoalSetting(true)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="text-2xl flex items-center justify-center">
          <Brain className="mr-2" />
          Персонализированный AI-коуч
        </CardTitle>
        <CardDescription className="text-purple-100">
          Ваш личный помощник в достижении целей и улучшении благополучия
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="chat">Чат</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="goals">Цели</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4 mb-4 rounded-md border">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`inline-block p-3 rounded-lg ${
                      message.isUser ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-start">
                        <Avatar className="w-8 h-8 mr-2">
                          {message.isUser ? (
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                          ) : (
                            <AvatarImage src="/ai-coach-avatar.png" />
                          )}
                          <AvatarFallback>{message.isUser ? 'U' : 'AI'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            {message.isUser ? 'Вы' : 'AI-коуч'}
                          </p>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                    {!message.isUser && (
                      <div className="mt-2 flex justify-start space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(index, true)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Полезно
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(index, false)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Не полезно
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос вашему AI-коучу..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {!navigator.onLine && (
              <p className="text-yellow-500 mt-2">Вы находитесь в офлайн режиме. Новые сообщения будут отправлены, когда подключение восстановится.</p>
            )}
          </TabsContent>

          <TabsContent value="recommendations">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md"
                  >
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
                      {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                    </h4>
                    <p className="text-sm text-gray-600">{rec.content}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="goals">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Ваши цели</h3>
              <Button onClick={handleAddGoal} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить цель
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <LazyComponent>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <GoalProgress onGoalUpdate={() => {}} />
                </Suspense>
              </LazyComponent>
            </ScrollArea>
          </TabsContent>

        </Tabs>
      </CardContent>
      {showGoalSetting && (
        <LazyComponent>
          <Suspense fallback={<div>Загрузка...</div>}>
            <GoalSetting onClose={() => setShowGoalSetting(false)} onGoalAdded={() => {}} />
          </Suspense>
        </LazyComponent>
      )}
    </Card>
  )
}
