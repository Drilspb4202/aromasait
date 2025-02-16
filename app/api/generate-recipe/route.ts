import { GoogleGenerativeAI } from '@google/generative-ai'

// Проверяем наличие API ключа
if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable')
}

// Создаем экземпляр API с обработкой ошибок
const createGeminiClient = () => {
  try {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!, {
      apiEndpoint: 'https://generativelanguage.googleapis.com',
      timeout: 120000,
    })
  } catch (error) {
    console.error('Error creating Gemini client:', error)
    throw new Error('Failed to initialize Gemini API')
  }
}

// Проверяем подключение к API
const checkGeminiConnection = async () => {
  try {
    const genAI = createGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    await model.generateContent('test connection')
    return true
  } catch (error) {
    console.error('Gemini connection test failed:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // Проверяем подключение перед генерацией
    const isConnected = await checkGeminiConnection()
    if (!isConnected) {
      return Response.json(
        { error: 'Сервис временно недоступен. Пожалуйста, попробуйте позже.' },
        { status: 503 }
      )
    }

    const { userPreferences, mealType, customizations } = await request.json()
    
    const genAI = createGeminiClient()
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })
    
    const dietType = userPreferences.dietPreference <= 3 ? 'здоровому' : 
                    userPreferences.dietPreference >= 8 ? 'веганскому' :
                    'смешанному здоровому и веганскому'

    const dietaryRestrictionsText = userPreferences.dietaryRestrictions.length > 0 
      ? `Обязательные ограничения в питании:\n${userPreferences.dietaryRestrictions.map(r => `- ${r}`).join('\n')}`
      : 'Без особых ограничений в питании'

    const favoriteIngredientsText = userPreferences.favoriteIngredients.length > 0
      ? `Предпочитаемые ингредиенты:\n${userPreferences.favoriteIngredients.map(i => `- ${i}`).join('\n')}`
      : 'Без особых предпочтений в ингредиентах'

    const cuisinesText = userPreferences.preferredCuisines.length > 0
      ? `Предпочитаемые кухни:\n${userPreferences.preferredCuisines.map(c => `- ${c}`).join('\n')}`
      : 'Без предпочтений по кухням'
    
    const complexity = userPreferences.cookingSkillLevel === 'beginner' ? 'легкий' :
                      userPreferences.cookingSkillLevel === 'advanced' ? 'сложный' : 'средний'

    const cookingTimeRange = customizations.cookingTime === 'quick' ? 'до 30 минут' :
                           customizations.cookingTime === 'long' ? 'более 60 минут' : '30-60 минут'

    const temperatureText = userPreferences.temperature === 'room' ? 'комнатной температуре' :
                          userPreferences.temperature === 'cold' ? 'холодным' : 'горячим'

    const budgetText = userPreferences.budget === 'low' ? 'экономичным' :
                      userPreferences.budget === 'high' ? 'премиальным' : 'средним'
    
    const prompt = `Как профессиональный шеф-повар и эксперт по здоровому питанию, создай персонализированный рецепт для ${
      mealType === 'breakfast' ? 'завтрака' : mealType === 'lunch' ? 'обеда' : 'ужина'
    }, который соответствует ${dietType} типу питания.

Учти следующие требования и предпочтения:

${dietaryRestrictionsText}

${favoriteIngredientsText}

${cuisinesText}

Параметры приготовления:
- Уровень кулинарного опыта: ${userPreferences.cookingSkillLevel}
- Желаемое время приготовления: ${cookingTimeRange}
- Сложность рецепта: ${complexity}
- Размер порции: ${customizations.portionSize}
- Уровень остроты: ${customizations.spiciness}

Дополнительные требования:
- Температура подачи: ${temperatureText}
- Способ приготовления: ${userPreferences.preparationMethod === 'any' ? 'любой' : userPreferences.preparationMethod}
- Максимальное количество ингредиентов: ${userPreferences.maxIngredients}
- Бюджет: ${budgetText}
${userPreferences.seasonal ? '- Использовать сезонные ингредиенты' : ''}

${userPreferences.dietPreference <= 3 
  ? 'Сделай акцент на здоровых ингредиентах, сбалансированном питании и оптимальном соотношении макронутриентов.' 
  : userPreferences.dietPreference >= 8 
    ? 'Используй только веганские ингредиенты, обеспечивая полноценное питание и необходимое количество белка.' 
    : 'Сбалансируй здоровые и веганские ингредиенты, уделяя внимание разнообразию и питательности блюда.'}

Рецепт должен быть:
1. Адаптирован под указанный уровень кулинарного опыта
2. Реалистичным для приготовления в домашних условиях
3. Содержать точные измерения и время приготовления
4. Включать советы по технике приготовления
5. Учитывать сезонность ингредиентов
6. Содержать информацию о пользе для здоровья
7. Соответствовать указанному бюджету
8. Иметь не более ${userPreferences.maxIngredients} ингредиентов
9. Подходить для указанного способа приготовления
10. Учитывать температуру подачи

Формат ответа должен быть в JSON:
{
  "name": "название рецепта",
  "description": "краткое описание рецепта, его особенностей и основной пользы",
  "prepTime": число (время подготовки в минутах),
  "cookTime": число (время приготовления в минутах),
  "servings": число (количество порций),
  "difficulty": "легкий/средний/сложный",
  "ingredients": [
    "ингредиент 1 с точным количеством",
    "ингредиент 2 с точным количеством"
  ],
  "instructions": [
    "подробный шаг 1",
    "подробный шаг 2"
  ],
  "nutritionalInfo": {
    "calories": число,
    "protein": число (в граммах),
    "fat": число (в граммах),
    "carbs": число (в граммах),
    "fiber": число (в граммах),
    "additionalInfo": "дополнительная информация о питательной ценности"
  },
  "healthBenefits": [
    "конкретная польза для здоровья 1",
    "конкретная польза для здоровья 2"
  ],
  "tips": [
    "практический совет по приготовлению 1",
    "практический совет по приготовлению 2"
  ]
}`

    try {
      const result = await model.generateContent(prompt)
      if (!result || !result.response) {
        throw new Error('Empty response from Gemini API')
      }

      const response = result.response
      let text = response.text()
      
      if (!text) {
        throw new Error('Empty text in response')
      }

      text = text.replace(/\`\`\`/g, '').replace(/^json/, '').trim()
      
      text = text.replace(/^[^{]*/, '')
                 .replace(/[^}]*$/, '')
                 .replace(/(\w+):/g, '"$1":')
                 .replace(/:\s*"?(\d+(?:\.\d+)?)\s*г"?/g, ': $1')
                 .replace(/,\s*}/g, '}')
                 .replace(/\(\d+[^)]*\)/g, '')
                 .replace(/:\s*"?([\d.]+)\s*[а-яА-Я]*"?,/g, ': $1,')
                 .replace(/([0-9]+)\s*минут/g, '$1')
                 .replace(/([0-9]+)\s*порц/g, '$1')

      const recipe = JSON.parse(text)
      
      if (!recipe || !recipe.name) {
        throw new Error('Invalid recipe format in response')
      }

      if (recipe.nutritionalInfo) {
        recipe.nutritionalInfo.calories = Number(recipe.nutritionalInfo.calories)
        recipe.nutritionalInfo.protein = Number(recipe.nutritionalInfo.protein)
        recipe.nutritionalInfo.fat = Number(recipe.nutritionalInfo.fat)
        recipe.nutritionalInfo.carbs = Number(recipe.nutritionalInfo.carbs)
        recipe.nutritionalInfo.fiber = Number(recipe.nutritionalInfo.fiber)
      }

      recipe.prepTime = Number(recipe.prepTime)
      recipe.cookTime = Number(recipe.cookTime)
      recipe.servings = Number(recipe.servings)
      
      return Response.json(recipe)
    } catch (generationError) {
      console.error('Generation error:', generationError)
      return Response.json(
        { 
          error: 'Не удалось сгенерировать рецепт. Пожалуйста, попробуйте еще раз через несколько минут.' 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { 
        error: 'Произошла ошибка при обработке запроса. Пожалуйста, проверьте подключение к интернету и попробуйте снова.'
      },
      { status: 500 }
    )
  }
}

