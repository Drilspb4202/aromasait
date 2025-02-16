import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Bot, User, Clock, ThumbsUp, ThumbsDown, Smile, Meh, Frown, Waveform } from 'lucide-react'

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

interface MessageItemProps {
  message: Message
  settings: Settings
  index: number
  onReaction: (index: number, type: 'like' | 'dislike') => void
}

export const MessageItem = ({ message, settings, index, onReaction }: MessageItemProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const style = {
    fontSize: `${settings.fontSize}px`,
    marginBottom: `${settings.messageSpacing}px`
  }

  const getEmotionIcon = (emotion?: Message['emotion']) => {
    switch (emotion) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />
      default: return <Meh className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <motion.div 
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            message.isUser 
              ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700' 
              : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600'
          } hover:shadow-lg hover:shadow-${message.isUser ? 'blue' : 'violet'}-500/30 transition-shadow`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {message.isUser ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
        </motion.div>
        <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} mx-3`}>
          <motion.div 
            className={`p-4 rounded-2xl shadow-sm ${
              message.isUser 
                ? isDark
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-blue-900/20'
                  : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-100 shadow-gray-900/20'
                  : 'bg-white border border-gray-100 shadow-md'
            } hover:shadow-lg transition-shadow`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {message.isVoice ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <audio 
                    src={message.audioUrl} 
                    controls 
                    className={`h-8 rounded ${isDark ? 'filter invert' : ''}`} 
                  />
                  <span className="text-xs opacity-75 flex items-center">
                    <Waveform className="w-4 h-4 mr-1" />
                    Голосовое сообщение
                  </span>
                </div>
                {message.processingVoice && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <span className="opacity-75">Распознаю сообщение</span>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-current rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm leading-relaxed">{message.text}</div>
                {settings.showEmotions && message.emotion && (
                  <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'} flex items-center mt-2`}>
                    {getEmotionIcon(message.emotion)}
                    <span className="ml-1">
                      {message.emotion === 'positive' && 'Позитивное'}
                      {message.emotion === 'negative' && 'Негативное'}
                      {message.emotion === 'neutral' && 'Нейтральное'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
          <div className={`flex items-center mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} space-x-4`}>
            {settings.showTimestamps && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {format(message.timestamp, 'HH:mm', { locale: ru })}
              </div>
            )}
            {!message.isUser && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                  onClick={() => onReaction(index, 'like')}
                >
                  <ThumbsUp className={`w-3 h-3 ${message.reactions.likes > 0 ? 'text-blue-500' : ''}`} />
                  <span className="ml-1">{message.reactions.likes}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                  onClick={() => onReaction(index, 'dislike')}
                >
                  <ThumbsDown className={`w-3 h-3 ${message.reactions.dislikes > 0 ? 'text-red-500' : ''}`} />
                  <span className="ml-1">{message.reactions.dislikes}</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 