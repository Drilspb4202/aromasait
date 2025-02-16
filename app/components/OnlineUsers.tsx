'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'

interface OnlineUser {
  id: string
  username: string
  last_seen: string
}

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    fetchOnlineUsers()
    const channel = supabase
      .channel('online_users')
      .on('presence', { event: 'sync' }, () => {
        fetchOnlineUsers()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchOnlineUsers() {
    try {
      const { data, error } = await supabase
        .from('online_users')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(20)

      if (error) {
        if (error.code === '42P01') {
          console.error('Таблица online_users не существует:', error)
          toast.error('Ошибка при загрузке пользователей онлайн. Пожалуйста, убедитесь, что таблица создана.')
        } else {
          throw error
        }
      } else {
        setOnlineUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching online users:', error)
      toast.error('Не удалось загрузить список пользователей онлайн')
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Пользователи онлайн</h3>
        <div className="space-y-4">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">Последняя активность: {new Date(user.last_seen).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

