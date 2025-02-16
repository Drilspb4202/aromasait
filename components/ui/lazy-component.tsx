'use client'

import { Suspense } from 'react'

interface LazyComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function LazyComponent({ children, fallback }: LazyComponentProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}
