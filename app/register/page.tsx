import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import Auth from '@/components/Auth'
import AuthProvider from '@/components/AuthProvider'

export default function RegisterPage() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <Auth isRegister={true} />
        </Suspense>
      </main>
    </AuthProvider>
  )
}

