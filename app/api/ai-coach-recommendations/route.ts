import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем историю настроения пользователя
    const { data: moodHistory, error: moodError } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (moodError) throw moodError

    // Получаем историю использования эфирных масел
    const { data: oilUsage, error: oilError } = await supabase
      .from('oil_usage')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (oilError) throw oilError

    // Получаем историю питания
    const { data: mealHistory, error: mealError } = await supabase
      .from('meal_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (mealError) throw mealError

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `На основе следующих данных пользователя, предоставьте персонализированные рекомендации по ароматерапии, питанию, физическим упражнениям и осознанности:

    История настроения: ${JSON.stringify(moodHistory)}
    Использование эфирных масел: ${JSON.stringify(oilUsage)}
    История питания: ${JSON.stringify(mealHistory)}

    Формат ответа должен быть в виде массива объектов JSON:
    [
      {
        "type": "aromatherapy",
        "content": "рекомендация по ароматерапии"
      },
      {
        "type": "nutrition",
        "content": "рекомендация по питанию"
      },
      {
        "type": "exercise",
        "content": "рекомендация по упражнениям"
      },
      {
        "type": "mindfulness",
        "content": "рекомендация по осознанности"
      }
    ]`

    const result = await model.generateContent(prompt)
    const response = result.response
    const recommendations = JSON.parse(response.text())

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error in AI coach recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
