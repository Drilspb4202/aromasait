'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  user_id: string
  username: string
  content: string
  created_at: string
}

export default function CommunityChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    const channel = supabase
      .channel('public:community_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, payload => {
        const newMessage = payload.new as Message
        setMessages(prevMessages => [...prevMessages, newMessage])
      })
      .subscribe()

    return () => {
      authListener.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Не удалось загрузить сообщения')
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      toast.error('Вы должны войти в систему, чтобы отправлять сообщения')
      return
    }
    if (!newMessage.trim()) return

    try {
      const { data, error } = await supabase
        .from('community_messages')
        .insert({
          user_id: user.id,
          username: user.user_metadata.full_name || user.email,
          content: newMessage.trim()
        })
        .select()

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Не удалось отправить сообщение')
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] mb-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2 mb-4">
              <Avatar>
                <AvatarFallback>{message.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{message.username}</p>
                <p className="text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Отправить</Button>
        </form>
      </CardContent>
    </Card>
  )
}

