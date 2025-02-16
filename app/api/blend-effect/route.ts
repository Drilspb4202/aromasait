import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { blend } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Как эксперт по ароматерапии, опиши эффект следующей смеси эфирных масел:
    ${blend.map((oil: any) => `${oil.name}: ${oil.amount} капель`).join('\n')}
    
    Опиши возможное влияние на настроение, самочувствие и общее состояние. Ответ должен быть кратким, но информативным, не более 2-3 предложений.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const effect = response.text()
    
    return Response.json({ effect })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to generate blend effect' },
      { status: 500 }
    )
  }
}

