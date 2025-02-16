export interface Oil {
  name: string
  color: string
  description: string
  icon: string
  properties: string[]
  benefits: string[]
  mood: string[]
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[]
  safetyNotes?: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  mood: string[]
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[]
  oils: {
    name: string
    amount: number
  }[]
  effects: string[]
  tags: string[]
  rating?: number
  reviews?: number
}

export interface Incompatibility {
  oil1: string
  oil2: string
  reason: string
  severity: 'low' | 'medium' | 'high'
}

export const availableOils: Oil[] = [
  {
    name: 'Лаванда',
    color: '#8A2BE2',
    description: 'Успокаивающий и расслабляющий аромат',
    icon: '💜',
    properties: ['успокаивающее', 'расслабляющее', 'антистресс'],
    benefits: ['улучшение сна', 'снижение тревожности', 'расслабление'],
    mood: ['спокойствие', 'умиротворение', 'релаксация'],
    timeOfDay: ['evening', 'night'],
    safetyNotes: ['Избегать при низком давлении']
  },
  {
    name: 'Мята',
    color: '#00FF7F',
    description: 'Освежающий и бодрящий аромат',
    icon: '🍃',
    properties: ['тонизирующее', 'освежающее', 'охлаждающее'],
    benefits: ['ясность ума', 'концентрация', 'свежесть'],
    mood: ['бодрость', 'энергичность', 'концентрация'],
    timeOfDay: ['morning', 'afternoon'],
    safetyNotes: ['Не использовать перед сном']
  },
  {
    name: 'Эвкалипт',
    color: '#00CED1',
    description: 'Очищающий и прохладный аромат',
    icon: '🌳',
    properties: ['очищающее', 'антисептическое', 'тонизирующее'],
    benefits: ['очищение воздуха', 'дыхательная система', 'иммунитет'],
    mood: ['свежесть', 'чистота', 'здоровье'],
    timeOfDay: ['morning', 'afternoon'],
    safetyNotes: ['Не использовать при астме']
  },
  {
    name: 'Лимон',
    color: '#FFD700',
    description: 'Энергичный и поднимающий настроение аромат',
    icon: '🍋',
    properties: ['тонизирующее', 'освежающее', 'очищающее'],
    benefits: ['повышение настроения', 'концентрация', 'бодрость'],
    mood: ['радость', 'оптимизм', 'энергичность'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Розмарин',
    color: '#228B22',
    description: 'Стимулирующий и укрепляющий аромат',
    icon: '🌱',
    properties: ['стимулирующее', 'тонизирующее', 'укрепляющее'],
    benefits: ['память', 'концентрация', 'умственная активность'],
    mood: ['сосредоточенность', 'ясность', 'энергичность'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Ромашка',
    color: '#F0E68C',
    description: 'Успокаивающий и расслабляющий аромат',
    icon: '🌼',
    properties: ['успокаивающее', 'противовоспалительное', 'расслабляющее'],
    benefits: ['снятие стресса', 'улучшение сна', 'успокоение'],
    mood: ['спокойствие', 'умиротворение', 'релаксация'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Иланг-иланг',
    color: '#FF1493',
    description: 'Чувственный и расслабляющий аромат',
    icon: '🌺',
    properties: ['расслабляющее', 'афродизиак', 'антидепрессант'],
    benefits: ['снятие напряжения', 'улучшение настроения', 'гармонизация'],
    mood: ['романтика', 'радость', 'спокойствие'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Чайное дерево',
    color: '#008080',
    description: 'Очищающий и антисептический аромат',
    icon: '🍵',
    properties: ['антисептическое', 'противовоспалительное', 'иммуномодулирующее'],
    benefits: ['укрепление иммунитета', 'очищение воздуха', 'защита'],
    mood: ['чистота', 'здоровье', 'свежесть'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Сандал',
    color: '#8B4513',
    description: 'Заземляющий и успокаивающий аромат',
    icon: '🌲',
    properties: ['успокаивающее', 'заземляющее', 'медитативное'],
    benefits: ['медитация', 'концентрация', 'духовные практики'],
    mood: ['умиротворение', 'гармония', 'медитация'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Бергамот',
    color: '#FFD700',
    description: 'Освежающий и поднимающий настроение аромат',
    icon: '🍊',
    properties: ['антидепрессант', 'тонизирующее', 'освежающее'],
    benefits: ['улучшение настроения', 'снятие тревоги', 'бодрость'],
    mood: ['радость', 'оптимизм', 'спокойствие'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Герань',
    color: '#FF69B4',
    description: 'Балансирующий и гармонизирующий аромат',
    icon: '🌸',
    properties: ['балансирующее', 'гармонизирующее', 'успокаивающее'],
    benefits: ['эмоциональный баланс', 'гормональный баланс', 'красота'],
    mood: ['гармония', 'баланс', 'женственность'],
    timeOfDay: ['morning', 'afternoon', 'evening']
  },
  {
    name: 'Грейпфрут',
    color: '#FFA07A',
    description: 'Освежающий и тонизирующий аромат',
    icon: '🍊',
    properties: ['тонизирующее', 'освежающее', 'очищающее'],
    benefits: ['бодрость', 'концентрация', 'детокс'],
    mood: ['бодрость', 'оптимизм', 'свежесть'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Жасмин',
    color: '#FFF0F5',
    description: 'Чувственный и романтичный аромат',
    icon: '🌸',
    properties: ['афродизиак', 'антидепрессант', 'расслабляющее'],
    benefits: ['романтическое настроение', 'уверенность', 'радость'],
    mood: ['романтика', 'чувственность', 'радость'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Кедр',
    color: '#8B4513',
    description: 'Заземляющий и укрепляющий аромат',
    icon: '🌲',
    properties: ['заземляющее', 'укрепляющее', 'тонизирующее'],
    benefits: ['концентрация', 'уверенность', 'сила'],
    mood: ['сила', 'уверенность', 'стабильность'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Корица',
    color: '#D2691E',
    description: 'Согревающий и стимулирующий аромат',
    icon: '🌿',
    properties: ['согревающее', 'стимулирующее', 'тонизирующее'],
    benefits: ['концентрация', 'энергия', 'тепло'],
    mood: ['тепло', 'уют', 'энергичность'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Пачули',
    color: '#8B4513',
    description: 'Экзотический и заземляющий аромат',
    icon: '🌿',
    properties: ['заземляющее', 'афродизиак', 'успокаивающее'],
    benefits: ['заземление', 'чувственность', 'медитация'],
    mood: ['медитация', 'чувственность', 'гармония'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Апельсин',
    color: '#FFA500',
    description: 'Солнечный и радостный аромат',
    icon: '🍊',
    properties: ['антидепрессант', 'тонизирующее', 'освежающее'],
    benefits: ['радость', 'оптимизм', 'энергия'],
    mood: ['радость', 'оптимизм', 'бодрость'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Ваниль',
    color: '#F4A460',
    description: 'Теплый и уютный аромат',
    icon: '🌺',
    properties: ['успокаивающее', 'расслабляющее', 'афродизиак'],
    benefits: ['уют', 'комфорт', 'расслабление'],
    mood: ['уют', 'спокойствие', 'романтика'],
    timeOfDay: ['evening', 'night']
  },
  {
    name: 'Можжевельник',
    color: '#2E8B57',
    description: 'Свежий и очищающий аромат',
    icon: '🌲',
    properties: ['очищающее', 'тонизирующее', 'освежающее'],
    benefits: ['очищение', 'бодрость', 'концентрация'],
    mood: ['свежесть', 'чистота', 'энергичность'],
    timeOfDay: ['morning', 'afternoon']
  },
  {
    name: 'Нероли',
    color: '#FFB6C1',
    description: 'Нежный и успокаивающий аромат',
    icon: '🌸',
    properties: ['антидепрессант', 'успокаивающее', 'расслабляющее'],
    benefits: ['спокойствие', 'гармония', 'радость'],
    mood: ['спокойствие', 'радость', 'гармония'],
    timeOfDay: ['morning', 'evening']
  }
]

export const predefinedRecipes: Recipe[] = [
  {
    id: 'morning-boost',
    name: 'Утренний заряд',
    description: 'Бодрящая смесь для энергичного начала дня',
    mood: ['бодрость', 'энергичность', 'оптимизм'],
    timeOfDay: ['morning'],
    oils: [
      { name: 'Лимон', amount: 3 },
      { name: 'Мята', amount: 2 },
      { name: 'Розмарин', amount: 1 }
    ],
    effects: ['повышение концентрации', 'бодрость', 'ясность ума'],
    tags: ['утро', 'энергия', 'концентрация'],
    rating: 4.8,
    reviews: 125
  },
  {
    id: 'evening-relax',
    name: 'Вечерняя релаксация',
    description: 'Расслабляющая смесь для спокойного вечера',
    mood: ['спокойствие', 'расслабление', 'умиротворение'],
    timeOfDay: ['evening', 'night'],
    oils: [
      { name: 'Лаванда', amount: 3 },
      { name: 'Ромашка', amount: 2 }
    ],
    effects: ['расслабление', 'снятие стресса', 'улучшение сна'],
    tags: ['вечер', 'релаксация', 'сон'],
    rating: 4.9,
    reviews: 198
  },
  {
    id: 'focus-blend',
    name: 'Концентрация и фокус',
    description: 'Помогает сосредоточиться на важных задачах',
    mood: ['концентрация', 'ясность', 'сосредоточенность'],
    timeOfDay: ['morning', 'afternoon'],
    oils: [
      { name: 'Розмарин', amount: 2 },
      { name: 'Лимон', amount: 2 },
      { name: 'Мята', amount: 1 }
    ],
    effects: ['улучшение памяти', 'концентрация', 'ментальная ясность'],
    tags: ['работа', 'учеба', 'концентрация'],
    rating: 4.7,
    reviews: 156
  },
  {
    id: 'stress-relief',
    name: 'Антистресс',
    description: 'Помогает справиться со стрессом и тревожностью',
    mood: ['спокойствие', 'расслабление', 'гармония'],
    timeOfDay: ['afternoon', 'evening'],
    oils: [
      { name: 'Лаванда', amount: 2 },
      { name: 'Сандал', amount: 2 },
      { name: 'Бергамот', amount: 1 }
    ],
    effects: ['снижение стресса', 'эмоциональный баланс', 'спокойствие'],
    tags: ['антистресс', 'релаксация', 'баланс'],
    rating: 4.9,
    reviews: 234
  },
  {
    id: 'immune-boost',
    name: 'Иммунитет',
    description: 'Укрепляет защитные силы организма',
    mood: ['здоровье', 'свежесть', 'бодрость'],
    timeOfDay: ['morning', 'afternoon'],
    oils: [
      { name: 'Эвкалипт', amount: 2 },
      { name: 'Чайное дерево', amount: 2 },
      { name: 'Лимон', amount: 1 }
    ],
    effects: ['укрепление иммунитета', 'очищение воздуха', 'защита'],
    tags: ['здоровье', 'иммунитет', 'очищение'],
    rating: 4.8,
    reviews: 167
  },
  {
    id: 'creative-inspiration',
    name: 'Творческое вдохновение',
    description: 'Стимулирует креативность и вдохновение',
    mood: ['вдохновение', 'творчество', 'радость'],
    timeOfDay: ['morning', 'afternoon'],
    oils: [
      { name: 'Бергамот', amount: 2 },
      { name: 'Иланг-иланг', amount: 2 },
      { name: 'Лимон', amount: 1 }
    ],
    effects: ['креативность', 'вдохновение', 'позитивное мышление'],
    tags: ['творчество', 'вдохновение', 'позитив'],
    rating: 4.6,
    reviews: 143
  }
]

export const oilIncompatibilities: Incompatibility[] = [
  {
    oil1: 'Лаванда',
    oil2: 'Мята',
    reason: 'Противоположные эффекты: расслабляющий и бодрящий',
    severity: 'medium'
  },
  {
    oil1: 'Эвкалипт',
    oil2: 'Мята',
    reason: 'Слишком интенсивный охлаждающий эффект',
    severity: 'low'
  },
  {
    oil1: 'Лаванда',
    oil2: 'Розмарин',
    reason: 'Противоположные эффекты: расслабляющий и стимулирующий',
    severity: 'medium'
  },
  {
    oil1: 'Мята',
    oil2: 'Ромашка',
    reason: 'Противоположные эффекты: бодрящий и успокаивающий',
    severity: 'medium'
  },
  {
    oil1: 'Иланг-иланг',
    oil2: 'Мята',
    reason: 'Конфликт ароматов и эффектов',
    severity: 'low'
  },
  {
    oil1: 'Лаванда',
    oil2: 'Чайное дерево',
    reason: 'Слишком резкий контраст ароматов',
    severity: 'low'
  },
  {
    oil1: 'Корица',
    oil2: 'Мята',
    reason: 'Слишком интенсивное сочетание',
    severity: 'high'
  },
  {
    oil1: 'Пачули',
    oil2: 'Цитрусовые',
    reason: 'Конфликт ароматов',
    severity: 'medium'
  },
  {
    oil1: 'Эвкалипт',
    oil2: 'Ромашка',
    reason: 'Противоположные эффекты',
    severity: 'low'
  },
  {
    oil1: 'Жасмин',
    oil2: 'Чайное дерево',
    reason: 'Несочетаемые ароматы',
    severity: 'medium'
  },
  {
    oil1: 'Корица',
    oil2: 'Лаванда',
    reason: 'Противоположные температурные эффекты',
    severity: 'high'
  },
  {
    oil1: 'Можжевельник',
    oil2: 'Ваниль',
    reason: 'Конфликт ароматов',
    severity: 'low'
  }
]

export function checkOilsCompatibility(oils: string[]): Incompatibility[] {
  const incompatibilities: Incompatibility[] = []
  
  for (let i = 0; i < oils.length; i++) {
    for (let j = i + 1; j < oils.length; j++) {
      const found = oilIncompatibilities.find(
        inc => (inc.oil1 === oils[i] && inc.oil2 === oils[j]) ||
               (inc.oil1 === oils[j] && inc.oil2 === oils[i])
      )
      if (found) {
        incompatibilities.push(found)
      }
    }
  }
  
  return incompatibilities
}

// Улучшенная система рекомендаций
interface RecommendationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  mood?: string[]
  activity?: string
  previousBlends?: string[]
  healthConditions?: string[]
}

export function getRecommendations(context: RecommendationContext): Recipe[] {
  let recommendations = predefinedRecipes

  // Фильтрация по времени суток
  recommendations = recommendations.filter(recipe =>
    recipe.timeOfDay.includes(context.timeOfDay)
  )

  // Фильтрация по настроению
  if (context.mood && context.mood.length > 0) {
    recommendations = recommendations.filter(recipe =>
      recipe.mood.some(m => context.mood?.includes(m))
    )
  }

  // Фильтрация по активности
  if (context.activity) {
    const activityTags = {
      work: ['концентрация', 'фокус', 'работа'],
      rest: ['релаксация', 'отдых', 'сон'],
      creativity: ['творчество', 'вдохновение'],
      sport: ['энергия', 'бодрость', 'активность'],
      meditation: ['медитация', 'спокойствие', 'гармония']
    }[context.activity] || []

    recommendations = recommendations.filter(recipe =>
      recipe.tags.some(tag => activityTags.includes(tag))
    )
  }

  // Учет предыдущих смесей для разнообразия
  if (context.previousBlends && context.previousBlends.length > 0) {
    recommendations = recommendations.filter(recipe =>
      !context.previousBlends?.includes(recipe.id)
    )
  }

  // Учет состояния здоровья
  if (context.healthConditions && context.healthConditions.length > 0) {
    const healthSafetyCheck = (recipe: Recipe): boolean => {
      const oils = recipe.oils.map(o => availableOils.find(ao => ao.name === o.name))
      return oils.every(oil => 
        oil?.safetyNotes?.every(note => 
          !context.healthConditions?.some(condition => 
            note.toLowerCase().includes(condition.toLowerCase())
          )
        ) ?? true
      )
    }
    recommendations = recommendations.filter(healthSafetyCheck)
  }

  // Сортировка по релевантности
  recommendations.sort((a, b) => {
    let scoreA = a.rating || 0
    let scoreB = b.rating || 0

    // Бонус за соответствие текущему времени суток
    if (a.timeOfDay.includes(context.timeOfDay)) scoreA += 0.5
    if (b.timeOfDay.includes(context.timeOfDay)) scoreB += 0.5

    // Бонус за популярность
    scoreA += (a.reviews || 0) / 1000
    scoreB += (b.reviews || 0) / 1000

    return scoreB - scoreA
  })

  return recommendations
}

// Улучшенные функции поиска
export function suggestByMood(mood: string): Recipe[] {
  return predefinedRecipes
    .filter(recipe => recipe.mood.includes(mood))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
}

export function suggestByTimeOfDay(time: 'morning' | 'afternoon' | 'evening' | 'night'): Recipe[] {
  return getRecommendations({ timeOfDay: time })
}

// Функции для работы с личными рецептами
export interface UserRecipe extends Recipe {
  userId: string
  created: Date
  lastUsed?: Date
  notes?: string
  favorite: boolean
}

export function createUserRecipe(recipe: Omit<UserRecipe, 'id' | 'created'>): UserRecipe {
  return {
    ...recipe,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created: new Date(),
    rating: 0,
    reviews: 0
  }
} 