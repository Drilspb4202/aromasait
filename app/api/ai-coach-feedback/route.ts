import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { messageIndex, isPositive } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем сообщение, на которое дается обратная связь
    const { data: messages, error: messagesError } = await supabase
      .from('ai_coach_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(messageIndex + 1)

    if (messagesError) throw messagesError

    const targetMessage = messages[messageIndex]

    if (!targetMessage || targetMessage.is_user) {
      return NextResponse.json({ error: 'Invalid message index' }, { status: 400 })
    }

    // Сохраняем обратную связь
    const { error: feedbackError } = await supabase
      .from('ai_coach_feedback')
      .insert({
        user_id: user.id,
        message_id: targetMessage.id,
        is_positive: isPositive
      })

    if (feedbackError) throw feedbackError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
}

