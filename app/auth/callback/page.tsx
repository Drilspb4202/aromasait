'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Выполняется вход...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const hash = window.location.hash
        if (hash) {
          setStatus('Обработка аутентификации...')
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) throw error
          if (session) {
            setStatus('Аутентификация успешна. Перенаправление...')
            router.push('/')
          }
        } else {
          setStatus('Проверка текущей сессии...')
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) throw error
          if (session) {
            setStatus('Сессия найдена. Перенаправление...')
            router.push('/')
          } else {
            throw new Error('Сессия не найдена')
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        setStatus('Произошла ошибка. Перенаправление на страницу входа...')
        setTimeout(() => router.push('/?error=auth-failed'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        <p className="text-gray-600">Пожалуйста, не закрывайте эту страницу</p>
      </div>
    </div>
  )
}

