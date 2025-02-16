'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'

interface Message {
  text: string
  isUser: boolean
}

const botResponses: Record<string, string> = {
  'привет': 'Привет! Чем я могу вам помочь?',
  'как использовать эфирные масла': 'Эфирные масла можно использовать в диффузоре, добавлять в ванну или применять местно после разбавления. Всегда следуйте инструкциям по применению.',
  'что такое веганство': 'Веганство - это образ жизни, исключающий использование продуктов животного происхождения в пище, одежде и других аспектах жизни.',
  'какие продукты богаты белком для веганов': 'Хорошими источниками белка для веганов являются бобовые, орехи, семена, тофу, темпе и некоторые зерновые, такие как киноа.',
  'как начать заниматься ароматерапией': 'Начните с изучения основных эфирных масел и их свойств. Приобретите диффузор и несколько базовых масел, таких как лаванда, мята и эвкалипт.',
  'помощь': 'Я могу ответить на вопросы о веганстве, ароматерапии и общем благополучии. Просто задайте свой вопрос!'
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() === '') return

    const newMessages = [...messages, { text: input, isUser: true }]
    setMessages(newMessages)
    setInput('')

    // Простая логика ответа бота
    setTimeout(() => {
      let botReply = 'Извините, я не могу ответить на этот вопрос. Попробуйте спросить о веганстве, ароматерапии или общем благополучии.'
      
      for (const [key, value] of Object.entries(botResponses)) {
        if (input.toLowerCase().includes(key)) {
          botReply = value
          break
        }
      }

      setMessages([...newMessages, { text: botReply, isUser: false }])
    }, 500)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Чат-помощник</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4 p-4 border rounded">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}
            >
              <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.text}
              </span>
            </motion.div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            type="text"
            placeholder="Введите ваш вопрос..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow mr-2"
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

