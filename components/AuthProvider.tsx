'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

const AuthContext = createContext<{ session: Session | null; user: any | null }>({
  session: null,
  user: null,
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем локальное хранилище для быстрой инициализации
    const savedSession = localStorage.getItem('session')
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        setSession(parsedSession)
        setUser(parsedSession?.user ?? null)
      } catch (e) {
        localStorage.removeItem('session')
      }
    }

    // Получаем актуальную сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) {
        localStorage.setItem('session', JSON.stringify(session))
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) {
        localStorage.setItem('session', JSON.stringify(session))
      } else {
        localStorage.removeItem('session')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({
    session,
    user
  }), [session, user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider as default, useAuth }
