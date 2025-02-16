'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, Bot, Mic, MicOff, User, ThumbsUp, ThumbsDown, 
  Clock, Volume2, Loader2, Waveform, Download, VolumeX,
  Smile, Meh, Frown, Filter, Save, Settings,
  Moon, Sun, Keyboard, BarChart2, Bookmark, Star, X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { MessageItem } from './MessageItem'

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
  reactions: {
    likes: number
    dislikes: number
  }
  isVoice?: boolean
  audioUrl?: string
  processingVoice?: boolean
  emotion?: 'positive' | 'neutral' | 'negative'
  confidence?: number
  category?: 'general' | 'question' | 'command' | 'voice' | 'system'
  tags?: string[]
}

interface WaveformVisualizerProps {
  audioLevel: number
}

interface Theme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface Settings {
  autoSpeak: boolean
  theme: string
  fontSize: number
  messageSpacing: number
  soundEffects: boolean
  showTimestamps: boolean
  showEmotions: boolean
  showCategories: boolean
}

interface Statistics {
  totalMessages: number
  userMessages: number
  aiMessages: number
  voiceMessages: number
  averageResponseTime: number
  popularTopics: { topic: string, count: number }[]
  emotionDistribution: { emotion: string, count: number }[]
}

const WaveformVisualizer = ({ audioLevel }: WaveformVisualizerProps) => {
  const bars = 12
  return (
    <div className="flex items-center space-x-0.5 h-8">
      {[...Array(bars)].map((_, i) => {
        const height = Math.max(4, audioLevel * 32 * Math.abs(Math.sin((i + 1) / (bars / 2))))
        return (
          <motion.div
            key={i}
            className="w-0.5 bg-gradient-to-t from-red-500 to-red-300 rounded-full"
            animate={{
              height: `${height}px`,
              opacity: audioLevel > 0.1 ? 1 : 0.5
            }}
            transition={{ duration: 0.1 }}
          />
        )
      })}
    </div>
  )
}

// Обновляем компонент StatisticsPanel
const StatisticsPanel = ({ statistics, onClose }: { 
  statistics: Statistics,
  onClose: () => void 
}) => {
  const { theme } = useTheme()
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Статистика чата</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-violet-50 p-3 rounded-lg">
          <div className="text-sm text-violet-600">Всего сообщений</div>
          <div className="text-2xl font-bold text-violet-700">{statistics.totalMessages}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600">Голосовых</div>
          <div className="text-2xl font-bold text-blue-700">{statistics.voiceMessages}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600">Ваши сообщения</div>
          <div className="text-2xl font-bold text-green-700">{statistics.userMessages}</div>
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="text-sm text-indigo-600">Ответы AI</div>
          <div className="text-2xl font-bold text-indigo-700">{statistics.aiMessages}</div>
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Распределение эмоций</div>
        <div className="flex items-center space-x-2">
          {statistics.emotionDistribution.map(({ emotion, count }) => (
            <div
              key={emotion}
              className="flex-1 bg-white rounded-lg p-2 text-center"
            >
              <div className="flex items-center justify-center mb-1">
                {emotion === 'positive' && <Smile className="w-4 h-4 text-green-500" />}
                {emotion === 'neutral' && <Meh className="w-4 h-4 text-gray-500" />}
                {emotion === 'negative' && <Frown className="w-4 h-4 text-red-500" />}
              </div>
              <div className="text-xs font-medium">{count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Среднее время ответа</div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <div className="text-lg font-bold text-gray-700">
            {statistics.averageResponseTime.toFixed(1)}с
          </div>
        </div>
      </div>
    </div>
  )
}

// Обновляем компонент SettingsPanel
const SettingsPanel = ({ settings, setSettings, onClose }: { 
  settings: Settings, 
  setSettings: (settings: Settings) => void,
  onClose: () => void
}) => {
  const { theme } = useTheme()
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Настройки</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Размер шрифта</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="12"
              max="20"
              value={settings.fontSize}
              onChange={(e) => {
                const newSettings = { ...settings, fontSize: Number(e.target.value) }
                setSettings(newSettings)
                localStorage.setItem('chat-settings', JSON.stringify(newSettings))
              }}
              className="w-full"
            />
            <span className="text-sm">{settings.fontSize}px</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Интервал между сообщениями</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="8"
              max="24"
              value={settings.messageSpacing}
              onChange={(e) => {
                const newSettings = { ...settings, messageSpacing: Number(e.target.value) }
                setSettings(newSettings)
                localStorage.setItem('chat-settings', JSON.stringify(newSettings))
              }}
              className="w-full"
            />
            <span className="text-sm">{settings.messageSpacing}px</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Звуковые эффекты</span>
          <Switch
            checked={settings.soundEffects}
            onCheckedChange={(checked) => {
              const newSettings = { ...settings, soundEffects: checked }
              setSettings(newSettings)
              localStorage.setItem('chat-settings', JSON.stringify(newSettings))
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Показывать время</span>
          <Switch
            checked={settings.showTimestamps}
            onCheckedChange={(checked) => {
              const newSettings = { ...settings, showTimestamps: checked }
              setSettings(newSettings)
              localStorage.setItem('chat-settings', JSON.stringify(newSettings))
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Показывать эмоции</span>
          <Switch
            checked={settings.showEmotions}
            onCheckedChange={(checked) => {
              const newSettings = { ...settings, showEmotions: checked }
              setSettings(newSettings)
              localStorage.setItem('chat-settings', JSON.stringify(newSettings))
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Показывать категории</span>
          <Switch
            checked={settings.showCategories}
            onCheckedChange={(checked) => {
              const newSettings = { ...settings, showCategories: checked }
              setSettings(newSettings)
              localStorage.setItem('chat-settings', JSON.stringify(newSettings))
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Группировка сообщений по дням
const MessageGroup = ({ date, messages, settings, onReaction }: { 
  date: string, 
  messages: Message[], 
  settings: Settings,
  onReaction: (messageIndex: number, type: 'like' | 'dislike') => void
}) => {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="py-2 text-sm text-muted-foreground">
          {date}
        </div>
      </div>
      {messages.map((message, index) => (
        <MessageItem 
          key={index} 
          message={message} 
          settings={settings}
          index={index}
          onReaction={onReaction}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const [processingVoice, setProcessingVoice] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const animationFrame = useRef<number | null>(null)
  const controls = useAnimation()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [filter, setFilter] = useState<Message['category'] | null>(null)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    autoSpeak: false,
    theme: 'light',
    fontSize: 14,
    messageSpacing: 16,
    soundEffects: true,
    showTimestamps: true,
    showEmotions: true,
    showCategories: true
  })
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalMessages: 0,
    userMessages: 0,
    aiMessages: 0,
    voiceMessages: 0,
    averageResponseTime: 0,
    popularTopics: [],
    emotionDistribution: []
  })
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  useEffect(() => {
    if (isRecording) {
      controls.start({
        scale: [1, 1.1, 1],
        borderColor: ['#EF4444', '#DC2626', '#EF4444'],
        transition: { duration: 1.5, repeat: Infinity }
      })
    } else {
      controls.stop()
    }
  }, [isRecording, controls])

  useEffect(() => {
    loadChat()
  }, [])

  useEffect(() => {
    saveChat()
  }, [messages])

  // Обработка горячих клавиш
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + K для поиска
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      const searchInput = document.getElementById('search-input')
      searchInput?.focus()
    }
    // Ctrl/Cmd + B для экспорта
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault()
      exportChat()
    }
    // Ctrl/Cmd + M для записи
    if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
      event.preventDefault()
      isRecording ? stopRecording() : startRecording()
    }
    // Esc для закрытия модальных окон
    if (event.key === 'Escape') {
      setShowSettings(false)
      setShowStats(false)
    }
  }, [isRecording])

  // Добавляем обработчик клавиш
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const analyzeAudio = (stream: MediaStream) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
      analyser.current = audioContext.current.createAnalyser()
      analyser.current.fftSize = 256
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount)
    }

    const source = audioContext.current.createMediaStreamSource(stream)
    source.connect(analyser.current)

    const updateLevel = () => {
      if (analyser.current && dataArray.current) {
        analyser.current.getByteFrequencyData(dataArray.current)
        const average = dataArray.current.reduce((acc, val) => acc + val, 0) / dataArray.current.length
        setAudioLevel(average / 128)
      }
      animationFrame.current = requestAnimationFrame(updateLevel)
    }

    updateLevel()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 44100,
          sampleSize: 16
        } 
      })
      
      setAudioStream(stream)
      audioChunks.current = []
      
      analyzeAudio(stream)
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }
      
      mediaRecorder.current.onstop = async () => {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current)
        }
        setAudioLevel(0)

        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm;codecs=opus' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const newMessage: Message = {
          text: 'Голосовое сообщение',
          isUser: true,
          timestamp: new Date(),
          reactions: { likes: 0, dislikes: 0 },
          isVoice: true,
          audioUrl,
          processingVoice: true
        }
        
        setMessages(prev => [...prev, newMessage])
        
        toast.promise(
          processVoiceMessage(audioBlob),
          {
            loading: 'Обработка голосового сообщения...',
            success: 'Голосовое сообщение обработано!',
            error: 'Ошибка при обработке сообщения'
          },
          {
            style: {
              minWidth: '250px',
            },
            success: {
              duration: 3000,
              icon: '🎉'
            },
            error: {
              duration: 3000,
              icon: '❌'
            }
          }
        )
      }

      mediaRecorder.current.start(200)
      setIsRecording(true)
      toast.success('Запись началась', {
        icon: '🎤',
        style: {
          background: '#10B981',
          color: '#fff'
        }
      })
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Ошибка доступа к микрофону')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      audioStream?.getTracks().forEach(track => track.stop())
      setAudioStream(null)
      setIsRecording(false)
      toast.success('Запись завершена', {
        icon: '✨',
        style: {
          background: '#6366F1',
          color: '#fff'
        }
      })
    }
  }

  const handleReaction = (index: number, type: 'like' | 'dislike') => {
    const newMessages = [...messages]
    if (type === 'like') {
      newMessages[index].reactions.likes++
      toast.success('Спасибо за положительную оценку!', {
        icon: '👍',
        style: {
          background: '#10B981',
          color: '#fff'
        }
      })
    } else {
      newMessages[index].reactions.dislikes++
      toast('Спасибо за обратную связь!', {
        icon: '👎',
        style: {
          background: '#6B7280',
          color: '#fff'
        }
      })
    }
    setMessages(newMessages)
  }

  const saveChat = () => {
    localStorage.setItem('chat-history', JSON.stringify(messages))
  }

  const loadChat = () => {
    const history = localStorage.getItem('chat-history')
    if (history) {
      setMessages(JSON.parse(history))
    }
  }

  const exportChat = () => {
    const chatText = messages
      .map(m => `[${format(m.timestamp, 'HH:mm')}] ${m.isUser ? 'Вы' : 'AI'}: ${m.text}`)
      .join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${format(new Date(), 'yyyy-MM-dd')}.txt`
    a.click()
    
    toast.success('Чат успешно экспортирован!', {
      icon: '📝',
      style: {
        background: '#10B981',
        color: '#fff'
      }
    })
  }

  const speakAIResponse = async (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'ru-RU'
    speech.rate = 1.0
    speech.pitch = 1.0
    
    speech.onstart = () => setIsSpeaking(true)
    speech.onend = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(speech)
  }

  const analyzeEmotion = (text: string): { emotion: Message['emotion'], confidence: number } => {
    const positiveWords = ['спасибо', 'отлично', 'хорошо', 'рад', 'круто', 'супер']
    const negativeWords = ['плохо', 'ужасно', 'грустно', 'жаль', 'проблема']
    
    const words = text.toLowerCase().split(' ')
    let positive = 0
    let negative = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positive++
      if (negativeWords.includes(word)) negative++
    })
    
    if (positive > negative) return { emotion: 'positive', confidence: positive / words.length }
    if (negative > positive) return { emotion: 'negative', confidence: negative / words.length }
    return { emotion: 'neutral', confidence: 1 - ((positive + negative) / words.length) }
  }

  const getEmotionIcon = (emotion?: Message['emotion']) => {
    switch (emotion) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />
      default: return <Meh className="w-4 h-4 text-gray-500" />
    }
  }

  // Обновляем функцию автоматической прокрутки
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollArea) {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  // Обновляем эффект для прокрутки при изменении сообщений
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100)
      const timer2 = setTimeout(scrollToBottom, 300) // Дополнительная прокрутка для надежности
      return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
      }
    }
  }, [messages, scrollToBottom])

  // Обновляем эффект для прокрутки при печатании
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(scrollToBottom, 100)
      return () => clearTimeout(timer)
    }
  }, [isTyping, scrollToBottom])

  // Обновляем обработчик отправки сообщения
  const handleSend = async (text: string = input.trim()) => {
    if (text === '') return

    const emotionAnalysis = analyzeEmotion(text)
    const newMessage: Message = {
      text,
      isUser: true,
      timestamp: new Date(),
      reactions: { likes: 0, dislikes: 0 },
      emotion: emotionAnalysis.emotion,
      confidence: emotionAnalysis.confidence,
      category: text.endsWith('?') ? 'question' : 'general'
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    // Прокручиваем после отправки сообщения пользователя
    setTimeout(scrollToBottom, 100)

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text,
          emotion: emotionAnalysis.emotion,
          category: newMessage.category
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsTyping(false)
        
        const aiResponse: Message = {
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          reactions: { likes: 0, dislikes: 0 },
          emotion: 'neutral',
          category: 'system'
        }
        
        setMessages(prev => [...prev, aiResponse])
        
        // Прокручиваем после получения ответа от AI
        setTimeout(scrollToBottom, 100)
        setTimeout(scrollToBottom, 300) // Дополнительная прокрутка для надежности
        
        if (autoSpeak) {
          speakAIResponse(data.response)
        }
      } else {
        throw new Error(data.error || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Не удалось получить ответ от AI. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      // Финальная прокрутка
      setTimeout(scrollToBottom, 100)
      setTimeout(scrollToBottom, 300)
    }
  }

  const processVoiceMessage = async (audioBlob: Blob) => {
    setProcessingVoice(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const simulatedText = "Привет! Это текст из голосового сообщения. Как дела?"
      setVoiceText(simulatedText)
      
      return simulatedText
    } catch (error) {
      console.error('Error processing voice message:', error)
      toast.error('Ошибка при обработке голосового сообщения')
      return null
    } finally {
      setProcessingVoice(false)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (filter === null) return true
    return message.category === filter
  })

  const toggleBookmark = (index: number) => {
    setBookmarks(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
    
    toast.success(
      bookmarks.includes(index) ? 'Закладка удалена' : 'Закладка добавлена',
      {
        icon: bookmarks.includes(index) ? '🗑️' : '🔖',
        style: {
          background: '#10B981',
          color: '#fff'
        }
      }
    )
  }

  useEffect(() => {
    const stats: Statistics = {
      totalMessages: messages.length,
      userMessages: messages.filter(m => m.isUser).length,
      aiMessages: messages.filter(m => !m.isUser).length,
      voiceMessages: messages.filter(m => m.isVoice).length,
      averageResponseTime: calculateAverageResponseTime(),
      popularTopics: analyzePopularTopics(),
      emotionDistribution: analyzeEmotions()
    }
    setStatistics(stats)
  }, [messages])

  const calculateAverageResponseTime = () => {
    let totalTime = 0
    let count = 0
    
    for (let i = 1; i < messages.length; i++) {
      if (!messages[i].isUser && messages[i-1].isUser) {
        totalTime += messages[i].timestamp.getTime() - messages[i-1].timestamp.getTime()
        count++
      }
    }
    
    return count > 0 ? totalTime / count / 1000 : 0
  }

  const analyzePopularTopics = () => {
    const topics: { [key: string]: number } = {}
    messages.forEach(message => {
      message.tags?.forEach(tag => {
        topics[tag] = (topics[tag] || 0) + 1
      })
    })
    
    return Object.entries(topics)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const analyzeEmotions = () => {
    const emotions: { [key: string]: number } = {
      positive: 0,
      neutral: 0,
      negative: 0
    }
    
    messages.forEach(message => {
      if (message.emotion) {
        emotions[message.emotion]++
      }
    })
    
    return Object.entries(emotions)
      .map(([emotion, count]) => ({ emotion, count }))
  }

  // Группировка сообщений по дням
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {}
    messages.forEach(message => {
      const date = format(message.timestamp, 'dd MMMM yyyy', { locale: ru })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }, [messages])

  // Эффект для звуковых уведомлений
  useEffect(() => {
    if (settings.soundEffects) {
      const audio = new Audio('/sounds/notification.mp3')
      audio.play()
    }
  }, [messages.length, settings.soundEffects])

  // Загрузка настроек при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('chat-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  return (
    <Card className={`mb-8 shadow-xl backdrop-blur-sm ${
      theme === 'dark' 
        ? 'bg-gray-900/95 text-white border-gray-800' 
        : 'bg-white/95 border-0'
    } overflow-hidden`}>
      <CardHeader className={`bg-gradient-to-r ${
        theme === 'dark'
          ? 'from-violet-800 via-indigo-800 to-purple-800'
          : 'from-violet-600 via-indigo-600 to-purple-600'
      } pb-6`}>
        <CardTitle className="text-2xl text-center text-white flex items-center justify-center">
          <Bot className="mr-3 h-7 w-7" />
          AI-ассистент
        </CardTitle>
        <CardDescription className="text-white/80 text-center">
          Задайте вопрос голосом или текстом
        </CardDescription>
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {autoSpeak ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
              {autoSpeak ? 'Выключить озвучку' : 'Включить озвучку'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportChat}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Download className="w-4 h-4 mr-1" />
              Экспорт чата
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <BarChart2 className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <ScrollArea 
          className={`h-[600px] mb-4 p-4 border rounded-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700'
              : 'bg-gradient-to-b from-gray-50 to-white shadow-inner'
          }`} 
          ref={scrollAreaRef}
        >
          <AnimatePresence>
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <MessageGroup 
                key={date} 
                date={date} 
                messages={messages}
                settings={settings}
                onReaction={handleReaction}
              />
            ))}
          </AnimatePresence>
          {(isLoading || isTyping) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 ml-2"
            >
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </ScrollArea>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-grow relative">
          <Input
            type="text"
                placeholder={isRecording ? "Говорите..." : "Задайте вопрос AI-ассистенту..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className={`pr-24 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-violet-500`}
                disabled={isRecording}
              />
              {isRecording && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                  <WaveformVisualizer audioLevel={audioLevel} />
                  <div className="flex items-center space-x-2 text-red-500">
                    <motion.span 
                      className="flex h-2 w-2 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                  </div>
                </div>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => isRecording ? stopRecording() : startRecording()}
                variant={isRecording ? "destructive" : "secondary"}
                className={`px-4 min-w-[120px] rounded-xl ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                    : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg shadow-violet-500/20'
                      : 'hover:bg-gray-100 shadow-lg shadow-violet-500/20'
                }`}
                disabled={isLoading || processingVoice}
              >
                {isRecording ? (
                  <motion.div 
                    className="flex items-center space-x-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <MicOff className="h-4 w-4" />
                    <span className="text-sm">Остановить</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mic className={`h-4 w-4 ${theme === 'dark' ? 'text-white' : ''}`} />
                    <span className="text-sm">Запись</span>
                  </div>
                )}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => handleSend()} 
                disabled={isLoading || (input.trim() === '' && !isRecording) || processingVoice}
                className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 px-6 rounded-xl shadow-lg shadow-violet-500/30"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
          </Button>
            </motion.div>
          </div>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`text-center text-sm p-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 border-gray-700'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Mic className="h-4 w-4 text-red-500" />
                <span>Говорите в микрофон. Когда закончите, нажмите кнопку "Остановить"</span>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`absolute top-20 right-4 w-96 ${
            theme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-white'
          } rounded-xl shadow-lg p-4`}
        >
          <StatisticsPanel 
            statistics={statistics} 
            onClose={() => setShowStats(false)} 
          />
        </motion.div>
      )}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`absolute top-20 right-4 w-80 ${
            theme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-white'
          } rounded-xl shadow-lg p-4`}
        >
          <SettingsPanel 
            settings={settings} 
            setSettings={setSettings}
            onClose={() => setShowSettings(false)}
          />
        </motion.div>
      )}
    </Card>
  )
}
