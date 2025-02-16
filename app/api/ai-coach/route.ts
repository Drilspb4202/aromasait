import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем историю сообщений пользователя
    const { data: chatHistory, error: chatError } = await supabase
      .from('ai_coach_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(10)

    if (chatError) throw chatError

    // Получаем цели пользователя
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    if (goalsError) throw goalsError

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Вы - персонализированный AI-коуч по имени Ария, специализирующийся на ароматерапии, веганском питании и общем благополучии. Используйте следующую историю чата и цели пользователя для контекста и ответьте на последнее сообщение пользователя:

    История чата:
    ${chatHistory.map(msg => `${msg.is_user ? 'Пользователь' : 'Ария'}: ${msg.content}`).join('\n')}

    Цели пользователя:
    ${goals.map(goal => `- ${goal.title}: ${goal.description} (Прогресс: ${goal.progress}%)`).join('\n')}

    Пользователь: ${message}

    Ария:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    // Сохраняем сообщение пользователя и ответ AI в базу данных
    await supabase.from('ai_coach_messages').insert([
      { user_id: user.id, content: message, is_user: true },
      { user_id: user.id, content: aiResponse, is_user: false }
    ])

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Error in AI coach:', error)
    return NextResponse.json({ error: 'Failed to get AI coach response' }, { status: 500 })
  }
}

