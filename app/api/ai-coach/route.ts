import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Отсутствуют переменные окружения для Supabase')
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Отсутствует GEMINI_API_KEY')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { message } = await request.json()
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем историю сообщений пользователя
    const { data: chatHistory, error: chatError } = await supabase
      .from('ai_coach_messages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })
      .limit(10)

    if (chatError) {
      console.error('Error fetching chat history:', chatError)
      return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 })
    }

    // Получаем цели пользователя
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', session.user.id)

    if (goalsError) {
      console.error('Error fetching goals:', goalsError)
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Вы - персонализированный AI-коуч по имени Ария, специализирующийся на ароматерапии, веганском питании и общем благополучии. Используйте следующую историю чата и цели пользователя для контекста и ответьте на последнее сообщение пользователя:

    История чата:
    ${chatHistory?.map(msg => `${msg.is_user ? 'Пользователь' : 'Ария'}: ${msg.content}`).join('\n')}

    Цели пользователя:
    ${goals?.map(goal => `- ${goal.title}: ${goal.description} (Прогресс: ${goal.progress}%)`).join('\n')}

    Пользователь: ${message}

    Ария:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    // Сохраняем сообщение пользователя
    await supabase
      .from('ai_coach_messages')
      .insert([
        { 
          user_id: session.user.id,
          content: message,
          is_user: true
        }
      ])

    // Сохраняем ответ AI
    await supabase
      .from('ai_coach_messages')
      .insert([
        {
          user_id: session.user.id,
          content: aiResponse,
          is_user: false
        }
      ])

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Error in AI coach:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
