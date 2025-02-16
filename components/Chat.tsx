'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send, Smile, Image as ImageIcon, Paperclip, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    // Симуляция ответа ассистента
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Спасибо за ваше сообщение! Я помогу вам достичь гармонии и баланса.',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
  }

  return (
    <div className="flex flex-col h-[300px] rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/assistant-avatar.png" alt="AI Assistant" />
            <AvatarFallback className="bg-primary/20">AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">AI Ассистент</h3>
            <p className="text-xs text-muted-foreground">
              {isTyping ? 'печатает...' : 'онлайн'}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                "flex items-start gap-2 mb-4",
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage 
                  src={message.sender === 'user' ? '/user-avatar.png' : '/assistant-avatar.png'} 
                  alt={message.sender === 'user' ? 'User' : 'AI Assistant'} 
                />
                <AvatarFallback className={cn(
                  "text-xs",
                  message.sender === 'user' ? 'bg-primary/20' : 'bg-secondary/20'
                )}>
                  {message.sender === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary/20">AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-2 rounded-tl-none">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <div className="p-4 border-t bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-background/50 border-muted-foreground/20"
          />
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="rounded-full px-4 bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 