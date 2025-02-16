import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, recipe } = body

    // Формируем более точный поисковый запрос
    const searchTerms = [
      recipe.name,
      'рецепт приготовления',
      'как приготовить',
      recipe.cuisine ? `${recipe.cuisine} кухня` : '',
      recipe.mainIngredients?.slice(0, 3).join(' '), // Основные ингредиенты
      'пошаговый рецепт'
    ].filter(Boolean)

    const searchQuery = encodeURIComponent(searchTerms.join(' '))
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    const maxResults = 5 // Увеличиваем количество результатов для лучшего подбора
    const relevanceLanguage = 'ru'
    
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key is not configured')
      return NextResponse.json(
        { error: 'YouTube API is not configured' },
        { status: 500 }
      )
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}&type=video&relevanceLanguage=${relevanceLanguage}&videoDuration=medium`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch video')
    }

    if (data.items && data.items.length > 0) {
      // Ищем наиболее подходящее видео
      const bestMatch = findBestVideoMatch(data.items, recipe)
      const videoUrl = `https://www.youtube.com/embed/${bestMatch.id.videoId}`
      
      return NextResponse.json({ videoUrl })
    }

    return NextResponse.json({ videoUrl: null })

  } catch (error) {
    console.error('Error searching video:', error)
    return NextResponse.json(
      { error: 'Failed to search video' },
      { status: 500 }
    )
  }
}

function findBestVideoMatch(videos: any[], recipe: any) {
  return videos.map(video => {
    let score = 0
    const title = video.snippet.title.toLowerCase()
    const description = video.snippet.description.toLowerCase()
    const recipeName = recipe.name.toLowerCase()
    
    // Проверяем название рецепта
    if (title.includes(recipeName)) score += 10
    
    // Проверяем отдельные слова из названия рецепта
    const recipeWords = recipeName.split(' ')
    recipeWords.forEach(word => {
      if (title.includes(word)) score += 3
      if (description.includes(word)) score += 1
    })
    
    // Проверяем основные ингредиенты
    recipe.mainIngredients?.forEach((ingredient: string) => {
      const ing = ingredient.toLowerCase()
      if (title.includes(ing)) score += 2
      if (description.includes(ing)) score += 1
    })
    
    // Проверяем тип кухни
    if (recipe.cuisine && title.includes(recipe.cuisine.toLowerCase())) score += 5
    
    // Бонус за наличие слов "рецепт", "приготовление"
    if (title.includes('рецепт')) score += 2
    if (title.includes('готовим')) score += 2
    if (title.includes('как приготовить')) score += 3
    
    // Бонус за свежесть видео
    const publishedAt = new Date(video.snippet.publishedAt)
    const now = new Date()
    const monthsOld = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (monthsOld < 6) score += 3
    else if (monthsOld < 12) score += 2
    else if (monthsOld < 24) score += 1

    return { ...video, score }
  })
  .sort((a, b) => b.score - a.score)[0] // Возвращаем видео с наивысшим рейтингом
} 