import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { userInput, category, priority, dueDate, reminder } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Как умный ассистент по постановке целей и личному развитию, помоги пользователю сформулировать конкретную цель и составить план ее достижения на основе следующего запроса и параметров:

    Запрос пользователя: "${userInput}"
    Категория: "${category}"
    Приоритет: "${priority}"
    Срок выполнения: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'Не указан'}
    Напоминание: ${reminder ? new Date(reminder).toLocaleDateString() : 'Не указано'}

    Пожалуйста, предоставь ответ в формате JSON:
    {
      "goal": "Четко сформулированная цель",
      "steps": [
        "Шаг 1 для достижения цели",
        "Шаг 2 для достижения цели",
        "Шаг 3 для достижения цели",
        "Шаг 4 для достижения цели",
        "Шаг 5 для достижения цели"
      ]
    }

    Цель должна быть конкретной, измеримой, достижимой, релевантной и ограниченной по времени (SMART). Шаги должны быть практичными и выполнимыми, соответствующими выбранной категории, приоритету и срокам.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Remove any backticks and the "json" prefix if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      const data = JSON.parse(text)
      return Response.json(data)
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
      { error: 'Failed to generate goal' },
      { status: 500 }
    )
  }
}

