import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Ты - AI-ассистент для приложения "Арома и Веган-Баланс". Ответь на следующий вопрос пользователя, связанный с ароматерапией, веганством, здоровьем и благополучием:

    Вопрос пользователя: ${message}

    Дай краткий, но информативный ответ.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()
    
    return Response.json({ response: aiResponse })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

