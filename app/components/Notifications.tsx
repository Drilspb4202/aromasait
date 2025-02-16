'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/notifications')
      const data = await response.json()
      
      if (response.status === 401) {
        setError('Пожалуйста, войдите в систему')
        return
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications')
      }
      
      setNotifications(data.notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Не удалось загрузить уведомления')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadNotifications = async () => {
      if (mounted) {
        await fetchNotifications()
      }
    }
    
    loadNotifications()
    const interval = setInterval(loadNotifications, 60000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [fetchNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Не удалось отметить уведомление как прочитанное')
    }
  }, [])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Уведомления</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-4">{error}</div>
                ) : notifications.length === 0 ? (
                  <div className="text-gray-500 text-center p-4">
                    Нет новых уведомлений
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-3 bg-gray-50 rounded-lg relative group"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <h4 className="font-medium mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
