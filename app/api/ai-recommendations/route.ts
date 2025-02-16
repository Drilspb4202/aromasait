import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
try {
  const { mood, userPreferences } = await request.json()
  if (!mood || !userPreferences) {
    return NextResponse.json({ error: 'Отсутствуют необходимые параметры' }, { status: 400 })
  }

  const parsedMood = JSON.parse(mood)
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  const prompt = `Как эксперт по ароматерапии и веганскому питанию, предоставьте персонализированные рекомендации для человека со следующими параметрами настроения и предпочтениями:

  Настроение:
  ${Object.entries(parsedMood).map(([key, value]) => `${key}: ${value}`).join('\n')}

  Учтите все аспекты настроения, включая энергичность, счастье, спокойствие, стресс, тревожность, концентрацию, креативность, мотивацию, качество сна и социальную связь.

  Предпочтения пользователя:
  Любимые масла: ${userPreferences.favoriteOils.join(', ')}
  Диетические ограничения: ${userPreferences.dietaryRestrictions.join(', ')}
  Уровень активности: ${userPreferences.activityLevel}

  Ответ должен быть в формате JSON:
  {
    "oil": {
      "name": "название эфирного масла",
      "description": "краткое описание эфирного масла",
      "benefits": "подробное описание пользы масла для текущего настроения",
      "howToUse": "инструкции по использованию масла"
    },
    "recipe": {
      "name": "название веганского рецепта",
      "description": "краткое описание рецепта",
      "benefits": "подробное описание пользы рецепта для текущего настроения",
      "howToUse": "инструкции по приготовлению блюда"
    },
    "activity": {
      "name": "название рекомендуемого занятия",
      "description": "краткое описание занятия",
      "benefits": "подробное описание пользы занятия для текущего настроения",
      "howToUse": "инструкции по выполнению занятия"
    }
  }`

  const result = await model.generateContent(prompt)
  const response = await result.response
  let text = response.text()
  
  // Remove any backticks and the "json" prefix if present
  text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim()
  
  try {
    const recommendations = JSON.parse(text)
    return NextResponse.json(recommendations)
  } catch (parseError) {
    console.error('Failed to parse JSON:', text)
    return NextResponse.json({ error: 'Неверный формат ответа' }, { status: 500 })
  }
} catch (error) {
  console.error('Error generating recommendations:', error)
  return NextResponse.json({ error: 'Не удалось сгенерировать рекомендации' }, { status: 500 })
}
}

