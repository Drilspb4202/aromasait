import { GoogleGenerativeAI } from '@google/generative-ai'
import { availableOils } from '@/lib/oils-data'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { mood, purpose } = await request.json()
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
    
    // Get current time of day
    const currentHour = new Date().getHours()
    let timeOfDay = 'утро'
    if (currentHour >= 12 && currentHour < 17) {
      timeOfDay = 'день'
    } else if (currentHour >= 17 && currentHour < 22) {
      timeOfDay = 'вечер'
    } else if (currentHour >= 22 || currentHour < 5) {
      timeOfDay = 'ночь'
    }

    // Get all available oil names and their properties
    const oilDetails = availableOils.map(oil => 
      `${oil.name} (свойства: ${oil.properties?.join(', ')}, настроение: ${oil.mood?.join(', ')})`
    ).join('\n')
    
    const prompt = `Как опытный эксперт по ароматерапии с глубоким пониманием свойств эфирных масел и их влияния на организм, создайте уникальную смесь со следующими параметрами:

    Время суток: ${timeOfDay}
    ${mood ? `Желаемое настроение: ${mood}` : ''}
    ${purpose ? `Цель использования: ${purpose}` : ''}

    Доступные масла и их свойства:
    ${oilDetails}

    Пожалуйста, создайте смесь из 3-5 масел, учитывая:
    1. Совместимость масел между собой
    2. Соответствие времени суток
    3. Влияние на желаемое настроение
    4. Эффективность для указанной цели
    5. Оптимальные пропорции (от 1 до 5 капель каждого масла)

    Ответ должен быть в формате JSON:
    {
      "name": "Креативное название смеси на русском языке",
      "oils": [
        { "name": "Название масла 1", "amount": 2 },
        { "name": "Название масла 2", "amount": 3 }
      ],
      "effect": "Подробное описание эффекта смеси, включая объяснение выбора каждого масла и их синергию (2-3 предложения)",
      "recommendations": "Конкретные рекомендации по использованию: когда и как применять смесь, возможные противопоказания, ожидаемая длительность эффекта (1-2 предложения)",
      "synergy": "Объяснение, как масла усиливают действие друг друга (1 предложение)"
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    text = text.replace(/```/g, '').replace(/^json/i, '').trim()
    
    try {
      const blend = JSON.parse(text)
      return Response.json(blend)
    } catch (parseError) {
      console.error('Failed to parse JSON:', text)
      return Response.json(
        { error: 'Invalid response format' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to generate blend' },
      { status: 500 }
    )
  }
}

