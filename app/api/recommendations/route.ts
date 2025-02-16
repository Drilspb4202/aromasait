import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { mood } = await request.json()
    const parsedMood = JSON.parse(mood)
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Как эксперт по ароматерапии и веганскому питанию, дай рекомендации для человека с следующими параметрами настроения:
    Энергичность: ${parsedMood.energy}
    Счастье: ${parsedMood.happiness}
    Спокойствие: ${parsedMood.calmness}
    Стресс: ${parsedMood.stress}
    Тревожность: ${parsedMood.anxiety}

    Формат ответа должен быть в JSON:
    {
      "oil": {
        "name": "название эфирного масла",
        "description": "описание эфирного масла и его влияния на текущее настроение"
      },
      "recipe": {
        "name": "название веганского рецепта",
        "description": "краткое описание рецепта и его пользы для текущего настроения"
      },
      "activity": {
        "name": "название рекомендуемого занятия",
        "description": "описание занятия и его влияния на улучшение настроения"
      }
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Remove any backticks, extra whitespace, and the "json" prefix if present
    text = text.replace(/```/g, '').replace(/^json/, '').trim()
    
    try {
      // Attempt to parse the JSON
      const recommendations = JSON.parse(text)
      return Response.json(recommendations)
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
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}

