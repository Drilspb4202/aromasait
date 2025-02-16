import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { user_id, content, user_name } = await request.json()

    if (!user_id || !content || !user_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id, content, user_name })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error submitting review:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 })
  }
}

