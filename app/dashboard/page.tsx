import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/AuthProvider'
import MainContent from '@/components/MainContent'

export default function DashboardPage() {
  return (
    <AuthProvider>
      <main>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <MainContent />
        </Suspense>
      </main>
    </AuthProvider>
  )
}

