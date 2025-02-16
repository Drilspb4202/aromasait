import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { oilName } = await request.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Как эксперт по ароматерапии, предоставьте информацию о свойствах и применении эфирного масла "${oilName}". Ответ должен быть в формате JSON:
{
  "properties": ["свойство1", "свойство2", ...],
  "uses": ["применение1", "применение2", ...],
  "benefits": ["польза1", "польза2", ...],
  "cautions": ["предостережение1", "предостережение2", ...],
  "usageInstructions": ["инструкция1", "инструкция2", ...]
}
Пожалуйста, укажите не менее 3 свойств и 3 применений.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    text = text.replace(/\`\`\`/g, '').replace(/^json/i, '').trim()
    
    try {
      const oilInfo = JSON.parse(text)
      return Response.json(oilInfo)
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
      { error: 'Failed to get oil information' },
      { status: 500 }
    )
  }
}

