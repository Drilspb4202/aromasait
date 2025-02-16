import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import Auth from '@/components/Auth'
import AuthProvider from '@/components/AuthProvider'
import { WavyBackground } from '@/components/ui/wavy-background'

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen w-full overflow-hidden">
        <WavyBackground className="absolute inset-0 w-full h-full">
          <main className="relative z-10 min-h-screen flex items-center justify-center">
            <Toaster />
            <Suspense fallback={<div>Loading...</div>}>
              <Auth />
            </Suspense>
          </main>
        </WavyBackground>
      </div>
    </AuthProvider>
  )
}

