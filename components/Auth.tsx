'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { Loader2 } from 'lucide-react'

interface AuthProps {
  isRegister?: boolean
}

const Auth = ({ isRegister = false }: AuthProps) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isResetPassword, setIsResetPassword] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Регистрация успешна! Проверьте вашу почту для подтверждения.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Вход выполнен успешно!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при аутентификации')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            : `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      if (!data?.url) {
        throw new Error('Не получен URL для авторизации')
      }

      window.location.href = data.url
    } catch (error: any) {
      console.error('Error during Google login:', error)
      toast.error(error.message || 'Ошибка входа через Google')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('Инструкции по сбросу пароля отправлены на вашу почту')
      setIsResetPassword(false)
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при сбросе пароля')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isResetPassword ? 'Сброс пароля' : (isRegister ? 'Регистрация' : 'Вход')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isResetPassword ? (
          <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </Button>
            <Button type="button" variant="link" onClick={() => setIsResetPassword(false)} className="w-full">
              Вернуться к входу
            </Button>
          </form>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
              </Button>
            </form>
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FcGoogle size={20} />}
                <span>{loading ? 'Загрузка...' : 'Войти через Google'}</span>
              </Button>
            </div>
            {!isRegister && (
              <Button type="button" variant="link" onClick={() => setIsResetPassword(true)} className="w-full mt-2">
                Забыли пароль?
              </Button>
            )}
            <div className="text-center mt-4">
              {isRegister ? (
                <p>Уже есть аккаунт? <a href="/login" className="text-blue-500 hover:underline">Войти</a></p>
              ) : (
                <p>Нет аккаунта? <a href="/register" className="text-blue-500 hover:underline">Зарегистрироваться</a></p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default Auth

