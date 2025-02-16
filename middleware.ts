import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Обновляем сессию, если она существует
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Если запрос к API и нет сессии, возвращаем 401
  if (request.nextUrl.pathname.startsWith('/api/') && !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return res
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: [
    '/api/ai-coach-recommendations',
    '/api/notifications',
    '/api/ai-coach',
    '/api/goals/:path*'
  ],
}
