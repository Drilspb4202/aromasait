import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { mood, oilName } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Как эксперт по ароматерапии, дай рекомендацию по использованию эфирного масла ${oilName} для человека с следующим настроением:
    ${Object.entries(mood).map(([key, value]) => `${key}: ${value}`).join('\n')}
    
    Формат ответа должен быть в JSON:
    {
      "recommendation": "краткая рекомендация по использованию масла",
      "blendSuggestion": "предложение по смешиванию с другим маслом для усиления эффекта",
      "cautionaryNote": "предостережение или совет по безопасному использованию (если применимо)"
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    text = text.replace(/```/g, '').replace(/^json/i, '').trim()
    
    try {
      const recommendation = JSON.parse(text)
      return Response.json(recommendation)
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
      { error: 'Failed to get recommendation' },
      { status: 500 }
    )
  }
}

