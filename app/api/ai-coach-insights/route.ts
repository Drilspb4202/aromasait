import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { goals, recommendations } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Проанализируйте следующие данные о целях пользователя и рекомендациях:

    Цели:
    ${JSON.stringify(goals)}

    Рекомендации:
    ${JSON.stringify(recommendations)}

    На основе этих данных, предоставьте 3-5 ключевых аналитических выводов о прогрессе пользователя, потенциальных областях для улучшения и как рекомендации соотносятся с целями. Формат ответа должен быть в виде массива строк.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const insights = JSON.parse(response.text())

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}

