'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ChevronDown, ChevronUp, Plus, Clock, Utensils, Users, Leaf, Sparkles, Heart, Flame, Shuffle, AlarmClock, Gauge, Thermometer, Share2, Printer, Timer, Calculator, StickyNote, Scale, Star, Camera, MessageSquare, Video, ThumbsUp, ThumbsDown, X, Settings2, ChevronLeft, ChevronRight, Volume2, Bookmark, Calendar, AlertTriangle, Lightbulb, Info, CheckCircle, ArrowRight, Circle, List, Play, ClipboardList } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { VoiceAssistant } from './VoiceAssistant'

interface Recipe {
  name: string
  description: string
  ingredients?: string[]
  instructions?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    fat: number
    carbs: number
    fiber: number
    additionalInfo: string
  }
  moodBenefits?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  seasonality?: string
  cuisine?: string
  complexity?: 'easy' | 'medium' | 'hard'
  preparationMethods?: string[]
  specialDiet?: string[]
  mainIngredients?: string[]
  healthBenefits: string[]
  tips: string[]
  storageInfo?: {
    method: string
    duration: string
  tips: string[]
  }
  mealPlanning?: {
    type: string
    servings: number
    reheatingInstructions?: string[]
  }
  dietaryFocus?: string[]
  alternatives?: {
    ingredients: Record<string, string[]>
    cookingMethods: string[]
  }
}

interface PersonalizedRecipeProps {}

interface DietaryRestriction {
  id: string
  label: string
  description: string
}

interface Cuisine {
  id: string
  label: string
}

interface FavoriteRecipe {
  id: string
  recipe: Recipe
  created_at: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  rating: number
  createdAt: string
}

const dietaryRestrictions: DietaryRestriction[] = [
  { id: 'gluten-free', label: 'Без глютена', description: 'Исключает продукты с глютеном' },
  { id: 'nut-free', label: 'Без орехов', description: 'Исключает все виды орехов' },
  { id: 'dairy-free', label: 'Без лактозы', description: 'Исключает молочные продукты' },
  { id: 'soy-free', label: 'Без сои', description: 'Исключает продукты из сои' },
  { id: 'egg-free', label: 'Без яиц', description: 'Исключает яйца и продукты с яйцами' },
  { id: 'sugar-free', label: 'Без сахара', description: 'Минимизирует содержание сахара' },
  { id: 'low-carb', label: 'Низкоуглеводный', description: 'Минимум углеводов' },
  { id: 'keto', label: 'Кето', description: 'Подходит для кето-диеты' },
  { id: 'paleo', label: 'Палео', description: 'Соответствует палео-диете' },
  { id: 'nightshade-free', label: 'Без пасленовых', description: 'Исключает помидоры, перцы, баклажаны' }
]

const cuisineIcons: Record<string, React.ReactNode> = {
  mediterranean: <span className="text-xl">🌊</span>,
  asian: <span className="text-xl">🍜</span>,
  european: <span className="text-xl">🏰</span>,
  mexican: <span className="text-xl">🌮</span>,
  indian: <span className="text-xl">🍛</span>,
  japanese: <span className="text-xl">🍱</span>,
  korean: <span className="text-xl">🍚</span>,
  thai: <span className="text-xl">🥘</span>,
  vietnamese: <span className="text-xl">🍜</span>,
  french: <span className="text-xl">🥖</span>,
  italian: <span className="text-xl">🍝</span>,
  greek: <span className="text-xl">🫒</span>
}

const cuisines: Cuisine[] = [
  { id: 'mediterranean', label: 'Средиземноморская' },
  { id: 'asian', label: 'Азиатская' },
  { id: 'european', label: 'Европейская' },
  { id: 'mexican', label: 'Мексиканская' },
  { id: 'indian', label: 'Индийская' },
  { id: 'japanese', label: 'Японская' },
  { id: 'korean', label: 'Корейская' },
  { id: 'thai', label: 'Тайская' },
  { id: 'vietnamese', label: 'Вьетнамская' },
  { id: 'french', label: 'Французская' },
  { id: 'italian', label: 'Итальянская' },
  { id: 'greek', label: 'Греческая' }
]

const cookingSkillLevels = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

const preparationMethods = [
  { id: 'baking', label: 'Запекание', icon: '🔥' },
  { id: 'frying', label: 'Жарка', icon: '🍳' },
  { id: 'steaming', label: 'На пару', icon: '♨️' },
  { id: 'grilling', label: 'Гриль', icon: '🔥' },
  { id: 'raw', label: 'Без термообработки', icon: '🥗' },
  { id: 'slowcooking', label: 'Томление', icon: '🍲' },
  { id: 'pressure', label: 'Скороварка', icon: '🥘' },
  { id: 'smoking', label: 'Копчение', icon: '💨' },
  { id: 'fermentation', label: 'Ферментация', icon: '🧪' },
  { id: 'sousvide', label: 'Су-вид', icon: '🌡️' }
]

const nutritionGoals = [
  { id: 'balanced', label: 'Сбалансированное питание', description: 'Оптимальное соотношение БЖУ' },
  { id: 'protein-rich', label: 'Богатое белком', description: 'Повышенное содержание белка' },
  { id: 'low-carb', label: 'Низкоуглеводное', description: 'Минимум углеводов' },
  { id: 'keto', label: 'Кето', description: 'Высокий процент жиров' },
  { id: 'mediterranean', label: 'Средиземноморское', description: 'Полезные жиры и цельные продукты' }
]

const equipmentOptions = [
  { id: 'basic', label: 'Базовое', description: 'Минимальный набор посуды' },
  { id: 'advanced', label: 'Продвинутое', description: 'Специальное оборудование' },
  { id: 'professional', label: 'Профессиональное', description: 'Полное оснащение' }
]

const textureOptions = [
  { id: 'crispy', label: 'Хрустящее', icon: '🥨' },
  { id: 'smooth', label: 'Нежное', icon: '🍮' },
  { id: 'crunchy', label: 'Хрустящее', icon: '🥜' },
  { id: 'creamy', label: 'Кремовое', icon: '🥛' },
  { id: 'juicy', label: 'Сочное', icon: '🍎' },
  { id: 'tender', label: 'Мягкое', icon: '🍖' }
]

const tasteOptions = [
  { id: 'sweet', label: 'Сладкое', icon: '🍯' },
  { id: 'salty', label: 'Солёное', icon: '🧂' },
  { id: 'sour', label: 'Кислое', icon: '🍋' },
  { id: 'bitter', label: 'Горькое', icon: '☕' },
  { id: 'umami', label: 'Умами', icon: '🍄' },
  { id: 'spicy', label: 'Острое', icon: '🌶️' }
]

const nutritionalFocusOptions = [
  { id: 'protein-rich', label: 'Богатое белком', icon: '🥩' },
  { id: 'low-carb', label: 'Низкоуглеводное', icon: '🥗' },
  { id: 'high-fiber', label: 'Богатое клетчаткой', icon: '🥬' },
  { id: 'omega3', label: 'Омега-3', icon: '🐟' },
  { id: 'vitamins', label: 'Витамины', icon: '🥕' },
  { id: 'minerals', label: 'Минералы', icon: '🥜' },
  { id: 'antioxidants', label: 'Антиоксиданты', icon: '🫐' }
]

const cookingTechniqueOptions = [
  { id: 'basic', label: 'Базовые техники', description: 'Простые методы приготовления' },
  { id: 'intermediate', label: 'Средние техники', description: 'Более сложные методы' },
  { id: 'advanced', label: 'Продвинутые техники', description: 'Профессиональные методы' }
]

const kitchenEquipmentOptions = [
  { id: 'stove', label: 'Плита', icon: '🔥' },
  { id: 'oven', label: 'Духовка', icon: '🔥' },
  { id: 'microwave', label: 'Микроволновка', icon: '📡' },
  { id: 'blender', label: 'Блендер', icon: '🔄' },
  { id: 'multicooker', label: 'Мультиварка', icon: '🍲' },
  { id: 'grill', label: 'Гриль', icon: '🔥' },
  { id: 'sous-vide', label: 'Су-вид', icon: '🌡️' },
  { id: 'food-processor', label: 'Кухонный комбайн', icon: '🔄' }
]

const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-orange-500" />
        </motion.div>
      </div>
      <p className="text-lg font-medium text-orange-700">{message}</p>
    </motion.div>
  </motion.div>
)

// Добавим новый компонент для таймера
const CookingTimer = ({ initialMinutes, onComplete }: { initialMinutes: number, onComplete?: () => void }) => {
  const [timerState, setTimerState] = useState({
    isRunning: false,
    timeLeft: initialMinutes * 60,
    totalTime: initialMinutes * 60
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            const audio = new Audio('/sounds/timer-end.mp3');
            audio.play();
            onComplete?.();
            return {
              ...prev,
              isRunning: false,
              timeLeft: 0
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState.isRunning, timerState.timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono">{formatTime(timerState.timeLeft)}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
          >
            {timerState.isRunning ? 'Пауза' : 'Старт'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimerState({
              isRunning: false,
              timeLeft: initialMinutes * 60,
              totalTime: initialMinutes * 60
            })}
          >
            Сброс
          </Button>
        </div>
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-1">
        <motion.div 
          className="bg-orange-500 rounded-full h-full"
          style={{ width: `${(timerState.timeLeft / timerState.totalTime) * 100}%` }}
          initial={false}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

// Добавим новые опции для расширенных настроек
const seasonalityOptions = [
  { id: 'all-year', label: 'Всесезонное', icon: '🗓️' },
  { id: 'spring', label: 'Весеннее', icon: '🌱' },
  { id: 'summer', label: 'Летнее', icon: '☀️' },
  { id: 'autumn', label: 'Осеннее', icon: '🍂' },
  { id: 'winter', label: 'Зимнее', icon: '❄️' }
]

const mealPlanningOptions = [
  { id: 'single', label: 'Одноразовое приготовление', description: 'Для одного приема пищи' },
  { id: 'batch', label: 'Готовка впрок', description: 'Для нескольких приемов пищи' },
  { id: 'meal-prep', label: 'Подготовка на неделю', description: 'Планирование на всю неделю' },
  { id: 'freezer', label: 'Заморозка', description: 'Можно замораживать порции' }
]

const storageOptions = [
  { id: 'fresh', label: 'Свежее употребление', icon: '🍽️' },
  { id: 'fridge', label: 'Холодильник (до 5 дней)', icon: '❄️' },
  { id: 'freezer', label: 'Морозилка (до 3 месяцев)', icon: '🧊' }
]

const dietaryFocusOptions = [
  { id: 'balanced', label: 'Сбалансированное', icon: '⚖️' },
  { id: 'protein-rich', label: 'Богатое белком', icon: '🥩' },
  { id: 'low-carb', label: 'Низкоуглеводное', icon: '🥗' },
  { id: 'keto', label: 'Кето', icon: '🥑' },
  { id: 'mediterranean', label: 'Средиземноморское', icon: '🫒' },
  { id: 'vegetarian', label: 'Вегетарианское', icon: '🥬' },
  { id: 'vegan', label: 'Веганское', icon: '🌱' }
]

// Добавим вспомогательную функцию для взвешенного случайного выбора
const weightedRandom = (weights: number[]) => {
  const sum = weights.reduce((a, b) => a + b)
  const normalized = weights.map(w => w / sum)
  const random = Math.random()
  let total = 0
  for (let i = 0; i < normalized.length; i++) {
    total += normalized[i]
    if (random <= total) return i
  }
  return normalized.length - 1
}

export default function PersonalizedRecipe() {
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState<'random' | 'custom' | false>(false)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast')
  const [dietPreference, setDietPreference] = useState(5)
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['mediterranean'])
  const [cookingSkillLevel, setCookingSkillLevel] = useState('intermediate')
  const [customizations, setCustomizations] = useState({
    spiciness: 'medium',
    portionSize: 'medium',
    cookingTime: 'medium',
    complexity: 'medium',
  })
  const [preferredIngredients, setPreferredIngredients] = useState<string>('')
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [advancedSettings, setAdvancedSettings] = useState({
    temperature: 'room',
    preparationMethod: 'any',
    maxIngredients: 10,
    seasonality: 'all-year',
    budget: 'medium',
    calorieRange: [200, 800],
    preferredTime: {
      breakfast: '',
      lunch: '',
      dinner: ''
    },
    flexibleTime: {
      breakfast: false,
      lunch: false,
      dinner: false
    },
    commonIngredientsOnly: false,
    localIngredientsOnly: false,
    substituteRare: false,
    texturePreferences: [] as string[],
    tastePreferences: [] as string[],
    excludedIngredients: [] as string[],
    nutritionalFocus: [] as string[],
    cookingMethods: [] as string[],
    mealPreparation: {
      prepAhead: false,
      batchCooking: false,
      quickAssembly: false,
      mealPrep: false
    },
    availableEquipment: [] as string[],
    cookingTechnique: 'basic',
    preferOneEquipment: false,
    preferSimpleTechniques: false,
    showTimer: false,
    mealPlanning: {
      type: 'single',
      batchCooking: false,
      mealPrep: false,
      freezerFriendly: false
    },
    storage: {
      method: 'fresh',
      duration: '1-day',
      requiresRefrigeration: false
    },
    dietaryFocus: [] as string[],
    alternatives: {
      enableSubstitutions: false,
      preferLocalIngredients: false,
      allowFrozenIngredients: false
    },
    cooking: {
      preferredMethods: [] as string[],
      avoidMethods: [] as string[],
      requireSpecificEquipment: false,
      maxSteps: 10,
      maxIngredients: 10
    },
    nutrition: {
      trackMacros: false,
      trackMicronutrients: false,
      calorieRange: [300, 800],
      proteinTarget: 20,
      carbTarget: 30,
      fatTarget: 50
    }
  })
  const [activeTab, setActiveTab] = useState('preferences')
  const tabsRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<string>('')
  const [portionMultiplier, setPortionMultiplier] = useState(1)
  const [timer, setTimer] = useState({
    isRunning: false,
    timeLeft: 0,
    totalTime: 0
  })
  const [videoUrl, setVideoUrl] = useState('')
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [plannedMeals, setPlannedMeals] = useState<{
    id: string
    date: Date
    recipe: Recipe
    mealType: 'breakfast' | 'lunch' | 'dinner'
    user_id: string
  }[]>([])
  const [selectedPlannedRecipe, setSelectedPlannedRecipe] = useState<any>(null)
  const [showAddToPlannerDialog, setShowAddToPlannerDialog] = useState(false)
  const [selectedPreparationMethods, setSelectedPreparationMethods] = useState<string[]>([])
  const [selectedNutritionGoal, setSelectedNutritionGoal] = useState('balanced')
  const [selectedEquipment, setSelectedEquipment] = useState('basic')
  const [macroTargets, setMacroTargets] = useState({
    protein: 20,
    fat: 30,
    carbs: 50
  })
  const [cookingMode, setCookingMode] = useState({
    isActive: false,
    currentStep: 0,
    stepTimer: null as number | null,
    voiceGuide: false,
    checkpoints: [] as number[],
    completedSteps: [] as number[],
    autoAdvance: false, // Автоматический переход к следующему шагу
    showIngredients: false, // Показывать список ингредиентов
    currentStepStartTime: null as Date | null,
    stepDurations: [] as number[], // Время, затраченное на каждый шаг
    notes: {} as Record<number, string>, // Заметки для каждого шага
    showTimer: false
  })
  const [cookingTips, setCookingTips] = useState<{
    stepIndex: number
    text: string
    type: 'tip' | 'warning' | 'info'
  }[]>([])
  const [cookingProgress, setCookingProgress] = useState({
    completedSteps: [] as number[],
    startTime: null as Date | null,
    totalTime: 0,
    estimatedEndTime: null as Date | null,
    currentStepStartTime: null as Date | null
  })

  // Добавим новые состояния для управления датами и пагинацией
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  // Функция для получения дат недели
  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay() + 1) // Начинаем с понедельника
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      dates.push(day)
    }
    return dates
  }

  // Функция для получения дат месяца
  const getMonthDates = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const dates = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    return dates
  }

  useEffect(() => {
    loadFavoriteRecipes()
    loadPlannedMeals()
  }, [])

  useEffect(() => {
    if (recipe && favoriteRecipes.length > 0) {
      const isCurrentRecipeFavorite = favoriteRecipes.some(
        favRecipe => favRecipe.recipe.name === recipe.name
      )
      setIsFavorite(isCurrentRecipeFavorite)
    }
  }, [recipe, favoriteRecipes])

  useEffect(() => {
    if (recipe) {
      setActiveTab('recipe')
    }
  }, [recipe])

  useEffect(() => {
    if (recipe?.instructions) {
      const allTips = recipe.instructions.flatMap((instruction, index) => 
        generateTipsForStep(index, instruction)
      )
      setCookingTips(allTips)
    }
  }, [recipe])

  const loadFavoriteRecipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Войдите в систему, чтобы видеть избранные рецепты",
          variant: "destructive"
        })
      return
    }

      const { data, error } = await supabase
        .from('favorite_recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setFavoriteRecipes(data || [])
    } catch (error) {
      console.error('Error loading favorite recipes:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить избранные рецепты",
        variant: "destructive"
      })
    }
  }

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Войдите в систему, чтобы добавлять рецепты в избранное",
          variant: "destructive"
        })
        return
      }

      if (!recipe) return

      if (isFavorite) {
        const favoriteToDelete = favoriteRecipes.find(
          favRecipe => favRecipe.recipe.name === recipe.name
        )
        if (favoriteToDelete) {
          const { error } = await supabase
            .from('favorite_recipes')
            .delete()
            .eq('id', favoriteToDelete.id)

          if (error) throw error

          setFavoriteRecipes(prev => prev.filter(fr => fr.id !== favoriteToDelete.id))
          setIsFavorite(false)
          toast({
            title: "Успешно",
            description: "Рецепт удален из избранного"
          })
        }
      } else {
        const { data, error } = await supabase
          .from('favorite_recipes')
          .insert({
            user_id: user.id,
            recipe
          })
          .select()
          .single()

        if (error) throw error

        setFavoriteRecipes(prev => [...prev, data])
        setIsFavorite(true)
        toast({
          title: "Успешно",
          description: "Рецепт добавлен в избранное"
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить избранное",
        variant: "destructive"
      })
    }
  }

  // Улучшим функцию generateRandomSettings
  const generateRandomSettings = () => {
    // Определяем текущий сезон
    const currentMonth = new Date().getMonth()
    const seasons = ['winter', 'spring', 'summer', 'autumn']
    const currentSeason = seasons[Math.floor(currentMonth / 3)]

    // Случайный выбор приема пищи с учетом времени суток
    const currentHour = new Date().getHours()
    let mealTypeWeights = [0.33, 0.33, 0.33] // равные веса по умолчанию
    if (currentHour < 11) mealTypeWeights = [0.6, 0.2, 0.2]
    else if (currentHour < 16) mealTypeWeights = [0.2, 0.6, 0.2]
    else mealTypeWeights = [0.2, 0.2, 0.6]
    
    const mealTypes = ['breakfast', 'lunch', 'dinner']
    const randomMealType = mealTypes[weightedRandom(mealTypeWeights)] as 'breakfast' | 'lunch' | 'dinner'

    // Выбираем случайные ограничения с учетом совместимости
    const compatibleRestrictions = getCompatibleRestrictions(dietaryRestrictions)
    const randomRestrictions = compatibleRestrictions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map(r => r.id)

    // Выбираем совместимые кухни
    const compatibleCuisines = getCompatibleCuisines(cuisines, randomMealType)
    const randomCuisines = compatibleCuisines
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map(c => c.id)

    // Случайный уровень готовки с учетом вероятностей
    const skillLevels = ['beginner', 'intermediate', 'advanced']
    const skillWeights = [0.4, 0.4, 0.2]
    const randomSkillLevel = skillLevels[weightedRandom(skillWeights)]

    // Выбираем совместимые текстуры и вкусы
    const randomTextures = getCompatibleTextures(textureOptions, randomMealType)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(t => t.id)

    const randomTastes = getCompatibleTastes(tasteOptions, randomMealType)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(t => t.id)

    // Выбираем сезонные настройки
    const randomSeasonality = Math.random() > 0.3 ? currentSeason : seasons[Math.floor(Math.random() * 4)]

    // Выбираем подходящий диетический фокус
    const randomDietaryFocus = getCompatibleDietaryFocus(dietaryFocusOptions, randomRestrictions)
      .sort(() => Math.random() - 0.5)
      .slice(0, 1)
      .map(d => d.id)

    // Применяем все настройки
    setMealType(randomMealType)
    setDietPreference(Math.floor(Math.random() * 10) + 1)
    setSelectedRestrictions(randomRestrictions)
    setSelectedCuisines(randomCuisines)
    setCookingSkillLevel(randomSkillLevel)

    // Настраиваем кастомизации с учетом времени приготовления
    const timeWeights = [0.4, 0.4, 0.2]
    const cookingTimes = ['quick', 'medium', 'long']
    const randomCookingTime = cookingTimes[weightedRandom(timeWeights)]

    setCustomizations({
      spiciness: getRandomSpiciness(randomCuisines),
      portionSize: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
      cookingTime: randomCookingTime,
      complexity: ['easy', 'medium', 'hard'][weightedRandom([0.4, 0.4, 0.2])]
    })

    // Обновляем расширенные настройки
    setAdvancedSettings(prev => ({
      ...prev,
      seasonality: randomSeasonality,
      texturePreferences: randomTextures,
      tastePreferences: randomTastes,
      dietaryFocus: randomDietaryFocus,
      storage: {
        ...prev.storage,
        method: getRandomStorageMethod(randomMealType)
      },
      mealPlanning: {
        ...prev.mealPlanning,
        type: getRandomMealPlanningType(randomMealType)
      },
      alternatives: {
        ...prev.alternatives,
        enableSubstitutions: Math.random() > 0.5,
        preferLocalIngredients: Math.random() > 0.3,
        allowFrozenIngredients: Math.random() > 0.4
      },
      cooking: {
        ...prev.cooking,
        maxSteps: Math.floor(Math.random() * 5) + 4, // 4-8 шагов
        maxIngredients: Math.floor(Math.random() * 5) + 5, // 5-9 ингредиентов
        preferredMethods: getCompatibleCookingMethods(preparationMethods, randomMealType)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map(m => m.id)
      },
      nutrition: {
        ...prev.nutrition,
        calorieRange: getCalorieRange(randomMealType),
        proteinTarget: getProteinTarget(randomDietaryFocus),
        carbTarget: getCarbTarget(randomDietaryFocus),
        fatTarget: getFatTarget(randomDietaryFocus)
      }
    }))
  }

  // Вспомогательные функции для генерации случайных настроек
  const getCompatibleRestrictions = (restrictions: typeof dietaryRestrictions) => {
    return restrictions.filter(r => {
      // Исключаем конфликтующие ограничения
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getCompatibleCuisines = (availableCuisines: typeof cuisines, mealType: string) => {
    return availableCuisines.filter(cuisine => {
      // Фильтруем кухни по типу приема пищи
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getCompatibleTextures = (textures: typeof textureOptions, mealType: string) => {
    return textures.filter(texture => {
      // Фильтруем текстуры по типу приема пищи
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getCompatibleTastes = (tastes: typeof tasteOptions, mealType: string) => {
    return tastes.filter(taste => {
      // Фильтруем вкусы по типу приема пищи
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getCompatibleDietaryFocus = (focuses: typeof dietaryFocusOptions, restrictions: string[]) => {
    return focuses.filter(focus => {
      // Фильтруем фокусы по ограничениям
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getRandomSpiciness = (selectedCuisines: string[]) => {
    const spicyCuisines = ['indian', 'thai', 'korean']
    const hasSpicyCuisine = selectedCuisines.some(cuisine => spicyCuisines.includes(cuisine))
    
    if (hasSpicyCuisine) {
      return ['medium', 'spicy'][Math.floor(Math.random() * 2)]
    }
    return ['mild', 'medium'][Math.floor(Math.random() * 2)]
  }

  const getRandomStorageMethod = (mealType: string) => {
    if (mealType === 'breakfast') {
      return 'fresh'
    }
    return storageOptions[Math.floor(Math.random() * storageOptions.length)].id
  }

  const getRandomMealPlanningType = (mealType: string) => {
    if (mealType === 'breakfast') {
      return ['single', 'batch'][Math.floor(Math.random() * 2)]
    }
    return mealPlanningOptions[Math.floor(Math.random() * mealPlanningOptions.length)].id
  }

  const getCompatibleCookingMethods = (methods: typeof preparationMethods, mealType: string) => {
    return methods.filter(method => {
      // Фильтруем методы по типу приема пищи
      return true // Здесь можно добавить логику совместимости
    })
  }

  const getCalorieRange = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return [300, 500]
      case 'lunch':
        return [500, 800]
      case 'dinner':
        return [400, 700]
      default:
        return [300, 800]
    }
  }

  const getProteinTarget = (dietaryFocus: string[]) => {
    if (dietaryFocus.includes('protein-rich')) {
      return Math.floor(Math.random() * 10) + 25 // 25-35%
    }
    return Math.floor(Math.random() * 10) + 15 // 15-25%
  }

  const getCarbTarget = (dietaryFocus: string[]) => {
    if (dietaryFocus.includes('low-carb')) {
      return Math.floor(Math.random() * 10) + 20 // 20-30%
    }
    return Math.floor(Math.random() * 15) + 45 // 45-60%
  }

  const getFatTarget = (dietaryFocus: string[]) => {
    if (dietaryFocus.includes('keto')) {
      return Math.floor(Math.random() * 10) + 60 // 60-70%
    }
    return Math.floor(Math.random() * 15) + 25 // 25-40%
  }

  const switchToRecipeTab = () => {
    setActiveTab('recipe')
    const recipeTab = tabsRef.current?.querySelector('[data-state="inactive"][value="recipe"]') as HTMLButtonElement
    if (recipeTab) {
      recipeTab.click()
    }
  }

  const generateRecipe = async () => {
    setLoading('custom')
    try {
      const userPreferences = {
        dietaryRestrictions: selectedRestrictions,
        favoriteIngredients: preferredIngredients.split(',').map(i => i.trim()).filter(i => i),
        cookingSkillLevel,
        preferredCuisines: selectedCuisines,
        portionSize: customizations.portionSize,
        spiciness: customizations.spiciness,
        cookingTime: customizations.cookingTime,
        complexity: customizations.complexity,
        dietPreference,
        preparationMethods: selectedPreparationMethods,
        nutritionGoal: selectedNutritionGoal,
        equipment: selectedEquipment,
        macroTargets: {
          protein: macroTargets.protein,
          fat: macroTargets.fat,
          carbs: macroTargets.carbs
        }
      }

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userPreferences, 
          mealType,
          customizations
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось создать рецепт')
      }

      setRecipe(data)
      setActiveTab('recipe')
      
      toast({
        title: "Успешно",
        description: "Рецепт успешно создан!"
      })

    } catch (error) {
      console.error('Error generating recipe:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать рецепт",
        variant: "destructive"
      })
      setActiveTab('preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleRandomRecipe = () => {
    setLoading('random')
    generateRandomSettings()
    generateRecipe()
  }

  const handleTabChange = (value: string) => {
    if (value === 'recipe' && !recipe) {
      toast({
        title: "Внимание",
        description: "Сначала создайте рецепт",
        variant: "warning"
      })
      return
    }
    setActiveTab(value)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTimer = (minutes: number) => {
    const seconds = minutes * 60
    setTimer({
      isRunning: true,
      timeLeft: seconds,
      totalTime: seconds
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            // Play sound when timer ends
            const audio = new Audio('/sounds/timer-end.mp3')
            audio.play()
            
            return {
              ...prev,
              isRunning: false,
              timeLeft: 0
            }
          }
          return {
          ...prev,
          timeLeft: prev.timeLeft - 1
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timer.isRunning, timer.timeLeft])

  // Добавим функцию для голосовых подсказок
  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    if (cookingMode.isActive && cookingMode.voiceGuide && recipe?.instructions) {
      const currentInstruction = recipe.instructions[cookingMode.currentStep]
      if (currentInstruction) {
        speakInstruction(currentInstruction)
      }
    }
  }, [cookingMode.currentStep, cookingMode.voiceGuide, cookingMode.isActive])

  const printRecipe = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !recipe) return

    const content = `
      <html>
        <head>
          <title>${recipe.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #f97316; }
            .section { margin: 20px 0; }
            .ingredients { margin-left: 20px; }
            .instructions { margin-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${recipe.name}</h1>
          <p>${recipe.description}</p>
          
          <div class="section">
            <h2>Ингредиенты:</h2>
            <ul class="ingredients">
              ${recipe.ingredients?.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h2>Инструкции:</h2>
            <ol class="instructions">
              ${recipe.instructions?.map(i => `<li>${i}</li>`).join('')}
            </ol>
          </div>
          
          <div class="section">
            <h2>Пищевая ценность:</h2>
            <p>Калории: ${recipe.nutritionalInfo?.calories}</p>
            <p>Белки: ${recipe.nutritionalInfo?.protein}г</p>
            <p>Жиры: ${recipe.nutritionalInfo?.fat}г</p>
            <p>Углеводы: ${recipe.nutritionalInfo?.carbs}г</p>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  const calculateIngredient = (ingredient: string, multiplier: number) => {
    return ingredient.replace(/(\d+(\.\d+)?)/g, (match) => {
      const number = parseFloat(match)
      return (number * multiplier).toFixed(1)
    })
  }

  const searchVideo = async () => {
    if (!recipe) return

    try {
      setVideoUrl('') // Сбрасываем URL видео перед новым поиском
      setShowVideoDialog(true) // Сразу показываем диалог с состоянием загрузки
      
      // Формируем точный поисковый запрос на основе названия рецепта и его характеристик
      const searchQuery = [
        recipe.name,
        'рецепт приготовления',
        'как приготовить',
        recipe.cuisine ? `${recipe.cuisine} кухня` : '',
        recipe.preparationMethods?.join(' '),
        recipe.mainIngredients?.slice(0, 3).join(' '), // Добавляем основные ингредиенты
        'пошаговый рецепт'
      ].filter(Boolean).join(' ')

      const response = await fetch('/api/search-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          recipe: {
            name: recipe.name,
            mainIngredients: recipe.mainIngredients,
            preparationMethods: recipe.preparationMethods,
            cuisine: recipe.cuisine,
            cookTime: recipe.cookTime,
            preferredDuration: {
              min: 180, // минимум 3 минуты
              max: 900  // максимум 15 минут
            },
            language: 'ru' // предпочитаем русский язык
          }
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }

      if (data.videoUrl) {
      setVideoUrl(data.videoUrl)
      } else {
        toast({
          title: "Видео не найдено",
          description: "К сожалению, не удалось найти подходящее видео для этого рецепта",
          variant: "destructive"
        })
        setShowVideoDialog(false)
      }

    } catch (error) {
      console.error('Error searching video:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось найти видео-инструкцию",
        variant: "destructive"
      })
      setShowVideoDialog(false)
    }
  }

  const loadPlannedMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('planned_meals')
        .select('*')
        .eq('user_id', user.id)
        .order('planned_date', { ascending: true })

      if (error) throw error

      const formattedMeals = data.map(meal => ({
        id: meal.id,
        date: new Date(meal.planned_date),
        recipe: meal.recipe,
        mealType: meal.meal_type,
        user_id: meal.user_id
      }))

      setPlannedMeals(formattedMeals)
    } catch (error) {
      console.error('Error loading planned meals:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить запланированные рецепты",
        variant: "destructive"
      })
    }
  }

  const addToPlanner = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Войдите в систему, чтобы сохранять рецепты",
          variant: "destructive"
        })
        return
      }

      if (!recipe) {
        toast({
          title: "Ошибка",
          description: "Сначала создайте рецепт",
          variant: "destructive"
        })
        return
      }

      // Форматируем дату для сохранения
      const formattedDate = new Date(selectedDate)
      formattedDate.setHours(0, 0, 0, 0)

      const plannedMeal = {
          user_id: user.id,
          recipe: recipe,
        planned_date: formattedDate.toISOString(),
        meal_type: mealType,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('planned_meals')
        .insert(plannedMeal)
        .select('*')
        .single()

      if (error) {
        console.error('Error details:', error)
        throw error
      }

      if (data) {
      const newMeal = {
        id: data.id,
        date: new Date(data.planned_date),
        recipe: data.recipe,
          mealType: data.meal_type as 'breakfast' | 'lunch' | 'dinner',
        user_id: data.user_id
      }

      setPlannedMeals(prev => [...prev, newMeal])
      setShowAddToPlannerDialog(false)
      
      toast({
        title: "Успешно",
        description: "Рецепт добавлен в планировщик"
      })

        // Обновляем список запланированных блюд
        loadPlannedMeals()
      }
    } catch (error) {
      console.error('Error saving planned meal:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить рецепт в планировщик",
        variant: "destructive"
      })
    }
  }

  const removePlannerMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('planned_meals')
        .delete()
        .eq('id', mealId)

      if (error) throw error

      setPlannedMeals(prev => prev.filter(meal => meal.id !== mealId))
      toast({
        title: "Успешно",
        description: "Рецепт удален из планировщика"
      })
    } catch (error) {
      console.error('Error removing planned meal:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить рецепт из планировщика",
        variant: "destructive"
      })
    }
  }

  // Добавим функцию для генерации подсказок
  const generateTipsForStep = (stepIndex: number, instruction: string) => {
    const tips = []
    
    // Анализируем текст инструкции для определения возможных подсказок
    if (instruction.toLowerCase().includes('нарезать')) {
      tips.push({
        stepIndex,
        text: 'Убедитесь, что нож хорошо заточен для безопасной и эффективной нарезки',
        type: 'warning'
      })
    }
    
    if (instruction.toLowerCase().includes('жарить')) {
      tips.push({
        stepIndex,
        text: 'Дождитесь, пока сковорода хорошо разогреется, прежде чем начать жарку',
        type: 'tip'
      })
    }
    
    if (instruction.toLowerCase().includes('варить')) {
      tips.push({
        stepIndex,
        text: 'Следите за уровнем воды и температурой во время варки',
        type: 'info'
      })
    }
    
    return tips
  }

  // Добавим функцию для обновления прогресса
  const updateCookingProgress = (stepIndex: number, completed: boolean) => {
    setCookingProgress(prev => {
      const newCompletedSteps = completed
        ? [...prev.completedSteps, stepIndex]
        : prev.completedSteps.filter(step => step !== stepIndex)

      // Если это первый шаг и он только что начат
      if (stepIndex === 0 && !prev.startTime && completed) {
        const now = new Date()
        const totalTime = (recipe?.cookTime || 30) * 60 * 1000 // в миллисекундах
        return {
          ...prev,
          completedSteps: newCompletedSteps,
          startTime: now,
          totalTime,
          estimatedEndTime: new Date(now.getTime() + totalTime),
          currentStepStartTime: now
        }
      }

      // Если переходим к новому шагу
      if (completed && !prev.completedSteps.includes(stepIndex)) {
        return {
          ...prev,
          completedSteps: newCompletedSteps,
          currentStepStartTime: new Date()
        }
      }

      return {
        ...prev,
        completedSteps: newCompletedSteps
      }
    })
  }

  // Добавим функцию для управления заметками к шагам
  const updateStepNote = (stepIndex: number, note: string) => {
    setCookingMode(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [stepIndex]: note
      }
    }))
  }

  // Обновим компонент CookingModeOverlay
  const CookingModeOverlay = () => {
    if (!recipe || !cookingMode.isActive) return null;

    const currentInstruction = recipe.instructions?.[cookingMode.currentStep];
    const totalSteps = recipe.instructions?.length || 0;
    const progress = ((cookingMode.currentStep + 1) / totalSteps) * 100;
    const currentTips = cookingTips.filter(tip => tip.stepIndex === cookingMode.currentStep);

    const formatEstimatedTime = () => {
      if (!cookingProgress.estimatedEndTime) return ''
      const now = new Date()
      const remaining = cookingProgress.estimatedEndTime.getTime() - now.getTime()
      if (remaining <= 0) return 'Время вышло'
      
      const minutes = Math.floor(remaining / (60 * 1000))
      return `Осталось примерно ${minutes} мин`
    }

    // Функция для автоматического перехода к следующему шагу
    const autoAdvanceStep = () => {
      if (cookingMode.autoAdvance && cookingMode.currentStep < (totalSteps - 1)) {
        const delay = recipe.cookTime ? (recipe.cookTime * 60000) / totalSteps : 300000; // 5 минут по умолчанию
        setTimeout(() => {
          handleNextStep();
        }, delay);
      }
    }

    const handleNextStep = () => {
      if (cookingMode.currentStep < (totalSteps - 1)) {
        // Сохраняем время, затраченное на текущий шаг
        if (cookingMode.currentStepStartTime) {
          const duration = new Date().getTime() - cookingMode.currentStepStartTime.getTime();
          setCookingMode(prev => ({
            ...prev,
            stepDurations: [...prev.stepDurations, duration]
          }));
        }

        updateCookingProgress(cookingMode.currentStep, true);
        
        setCookingMode(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          completedSteps: [...prev.completedSteps, prev.currentStep],
          currentStepStartTime: new Date()
        }));

        autoAdvanceStep();
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut",
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Заголовок */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-6 bg-gradient-to-r from-orange-400 to-pink-500"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Готовим: {recipe.name}</h3>
              <div className="flex items-center gap-3">
                <VoiceAssistant
                  text={currentInstruction || ''}
                  isActive={cookingMode.voiceGuide}
                  onToggle={() => setCookingMode(prev => ({ ...prev, voiceGuide: !prev.voiceGuide }))}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCookingMode(prev => ({ ...prev, isActive: false }))}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="mt-4">
              <div className="flex justify-between text-white/90 text-sm mb-1">
                <span>Прогресс приготовления</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center text-white">
              <span className="text-sm">Шаг {cookingMode.currentStep + 1} из {totalSteps}</span>
              {cookingProgress.estimatedEndTime && (
                <span className="text-sm">
                  {formatEstimatedTime()}
                </span>
              )}
            </div>
          </motion.div>

          {/* Основной контент */}
          <div className="flex-1 overflow-hidden flex">
            {/* Левая панель с ингредиентами */}
            <AnimatePresence mode="wait">
              {cookingMode.showIngredients && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut",
                    opacity: { duration: 0.2 }
                  }}
                  className="bg-orange-50 p-4 border-r overflow-y-auto"
                >
                  <h4 className="font-medium text-orange-700 mb-3">Ингредиенты</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input 
                          type="checkbox" 
                          className="rounded border-orange-300 text-orange-500"
                        />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Правая панель с инструкциями */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-6">
                {/* Текущий шаг */}
                <motion.div
                  key={cookingMode.currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-orange-50 rounded-lg p-6"
                >
                  <h4 className="text-lg font-medium text-orange-700 mb-3">Текущий шаг</h4>
                  <p className="text-xl">{currentInstruction}</p>
                  
                  {/* Заметки к шагу */}
                  <div className="mt-4">
                    <textarea
                      placeholder="Добавьте заметку к этому шагу..."
                      value={cookingMode.notes[cookingMode.currentStep] || ''}
                      onChange={(e) => updateStepNote(cookingMode.currentStep, e.target.value)}
                      className="w-full p-2 rounded-md border border-orange-200 text-sm"
                      rows={2}
                    />
                  </div>
                </motion.div>

                {/* Следующий шаг */}
                {recipe.instructions?.[cookingMode.currentStep + 1] && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Следующий шаг</h4>
                    <p className="text-gray-600">{recipe.instructions[cookingMode.currentStep + 1]}</p>
                  </motion.div>
                )}

                {/* Подсказки */}
                <AnimatePresence mode="wait">
                  {currentTips.length > 0 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="space-y-3"
                    >
                      {currentTips.map((tip, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg flex items-start gap-3 ${
                            tip.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                            tip.type === 'tip' ? 'bg-blue-50 text-blue-700' :
                            'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {tip.type === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                          ) : tip.type === 'tip' ? (
                            <Lightbulb className="w-5 h-5 flex-shrink-0" />
                          ) : (
                            <Info className="w-5 h-5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium">
                              {tip.type === 'warning' ? 'Внимание' :
                               tip.type === 'tip' ? 'Совет' : 'Информация'}
                            </p>
                            <p className="text-sm mt-1">{tip.text}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Нижняя панель управления */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="p-6 border-t bg-gray-50"
          >
            <div className="flex items-center justify-between">
              {/* Навигация по шагам */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (cookingMode.currentStep > 0) {
                      setCookingMode(prev => ({
                        ...prev,
                        currentStep: prev.currentStep - 1
                      }))
                    }
                  }}
                  disabled={cookingMode.currentStep === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextStep}
                  disabled={cookingMode.currentStep === totalSteps - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Дополнительные функции */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCookingMode(prev => ({ 
                    ...prev, 
                    showIngredients: !prev.showIngredients 
                  }))}
                  className={cookingMode.showIngredients ? 'text-orange-500 border-orange-500' : ''}
                >
                  <List className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCookingMode(prev => ({
                    ...prev,
                    autoAdvance: !prev.autoAdvance
                  }))}
                  className={cookingMode.autoAdvance ? 'text-orange-500 border-orange-500' : ''}
                >
                  <Play className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCookingMode(prev => ({
                    ...prev,
                    checkpoints: [...prev.checkpoints, prev.currentStep]
                  }))}
                  className={cookingMode.checkpoints.includes(cookingMode.currentStep) ? 'text-orange-500 border-orange-500' : ''}
                >
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCookingMode(prev => ({ ...prev, showTimer: !prev.showTimer }))}
                  className={cookingMode.showTimer ? 'text-orange-500 border-orange-500' : ''}
                >
                  <Timer className="w-5 h-5 mr-2" />
                  Таймер
                </Button>
              </div>
            </div>

            {/* Таймер */}
            <AnimatePresence mode="wait">
              {cookingMode.showTimer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CookingTimer 
                    initialMinutes={recipe.cookTime || 30}
                    onComplete={() => {
                      toast({
                        title: "Время вышло!",
                        description: "Проверьте ваше блюдо"
                      });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingOverlay 
            message={
              loading === 'random' 
                ? "Создаем случайный рецепт..." 
                : "Создаем рецепт по вашим предпочтениям..."
            }
          />
        )}
        {cookingMode.isActive && <CookingModeOverlay />}
      </AnimatePresence>
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <Sparkles className="mr-2" />
          Персонализированный рецепт
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
          <div className="flex justify-end gap-4 mb-4">
            <Button
              variant="default"
              onClick={generateRecipe}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? 'Генерация...' : 'Создать рецепт'}
            </Button>
            <Button
              variant="outline"
              onClick={handleRandomRecipe}
              className="flex items-center gap-2 hover:bg-orange-100"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shuffle className="w-4 h-4" />
              )}
              {loading ? 'Генерация...' : 'Случайный рецепт'}
            </Button>
          </div>

          <Tabs 
            ref={tabsRef}
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Настройки</TabsTrigger>
              <TabsTrigger value="recipe">Рецепт</TabsTrigger>
              <TabsTrigger value="planner">Планировщик</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mealType">Прием пищи</Label>
              <Select value={mealType} onValueChange={(value: 'breakfast' | 'lunch' | 'dinner') => setMealType(value)}>
                <SelectTrigger>
                        <SelectValue placeholder="Выберите прием пищи" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Завтрак</SelectItem>
                  <SelectItem value="lunch">Обед</SelectItem>
                  <SelectItem value="dinner">Ужин</SelectItem>
                </SelectContent>
              </Select>
            </div>

                  <div className="mt-4">
                    <Label>Предпочитаемое время</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Input
                          type="time"
                          value={advancedSettings.preferredTime?.[mealType] || ''}
                          onChange={(e) => 
                            setAdvancedSettings(prev => ({
                              ...prev,
                              preferredTime: {
                                ...prev.preferredTime,
                                [mealType]: e.target.value
                              }
                            }))
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={advancedSettings.flexibleTime?.[mealType] || false}
                          onCheckedChange={(checked) =>
                            setAdvancedSettings(prev => ({
                              ...prev,
                              flexibleTime: {
                                ...prev.flexibleTime,
                                [mealType]: checked
                              }
                            }))
                          }
                        />
                        <Label className="ml-2">Гибкое время</Label>
                      </div>
                    </div>
            </div>

              <div>
                    <Label>Тип питания</Label>
                    <div className="mt-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[dietPreference]}
                        onValueChange={(value) => setDietPreference(value[0])}
                        className="w-full"
                      />
                      <div className="mt-2 flex justify-between text-xs text-gray-600">
                        <span>Здоровое питание</span>
                        <span>Веганское питание</span>
                      </div>
                      <div className="mt-2 text-center text-sm text-gray-600">
                        {dietPreference <= 3 ? 'Предпочтение здорового питания' :
                         dietPreference <= 7 ? 'Сбалансированный подход' :
                         'Предпочтение веганского питания'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Уровень готовки</Label>
                    <Select value={cookingSkillLevel} onValueChange={setCookingSkillLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите уровень" />
                      </SelectTrigger>
                      <SelectContent>
                        {cookingSkillLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Ограничения в питании</Label>
                    <div className="mt-2 space-y-2">
                      {dietaryRestrictions.map(restriction => (
                        <div key={restriction.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={restriction.id}
                            checked={selectedRestrictions.includes(restriction.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRestrictions([...selectedRestrictions, restriction.id])
                              } else {
                                setSelectedRestrictions(selectedRestrictions.filter(id => id !== restriction.id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={restriction.id} className="text-sm">
                            {restriction.label}
                            <span className="text-xs text-gray-500 ml-1">
                              ({restriction.description})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Предпочитаемые кухни</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {cuisines.map(cuisine => (
                        <Badge
                          key={cuisine.id}
                          variant={selectedCuisines.includes(cuisine.id) ? "default" : "outline"}
                          className={`cursor-pointer flex items-center gap-2 px-3 py-2 transition-all duration-300 ${
                            selectedCuisines.includes(cuisine.id)
                              ? 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white'
                              : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50'
                          }`}
                          onClick={() => {
                            if (selectedCuisines.includes(cuisine.id)) {
                              setSelectedCuisines(selectedCuisines.filter(id => id !== cuisine.id))
                            } else {
                              setSelectedCuisines([...selectedCuisines, cuisine.id])
                            }
                          }}
                        >
                          {cuisineIcons[cuisine.id]}
                          {cuisine.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Любимые ингредиенты</Label>
                  <textarea
                    value={preferredIngredients}
                    onChange={(e) => setPreferredIngredients(e.target.value)}
                    placeholder="Введите ингредиенты через запятую (например: авокадо, киноа, шпинат)"
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Острота</Label>
                <Select
                  value={customizations.spiciness}
                      onValueChange={(value) => setCustomizations(prev => ({ ...prev, spiciness: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень остроты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Мягкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="spicy">Острый</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                    <Label>Размер порции</Label>
                <Select
                  value={customizations.portionSize}
                      onValueChange={(value) => setCustomizations(prev => ({ ...prev, portionSize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите размер порции" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Маленькая</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="large">Большая</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                  <div>
                    <Label>Время приготовления</Label>
                    <Select
                      value={customizations.cookingTime}
                      onValueChange={(value) => setCustomizations(prev => ({ ...prev, cookingTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите время приготовления" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Быстро (до 30 мин)</SelectItem>
                        <SelectItem value="medium">Средне (30-60 мин)</SelectItem>
                        <SelectItem value="long">Долго (более 60 мин)</SelectItem>
                      </SelectContent>
                    </Select>
            </div>

                  <div>
                    <Label>Сложность приготовления</Label>
                    <Select
                      value={customizations.complexity}
                      onValueChange={(value) => setCustomizations(prev => ({ ...prev, complexity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сложность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Простой</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="hard">Сложный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-orange-500" />
                  Расширенные настройки
                </h4>
                
                {/* Сезонность */}
                <div className="space-y-2">
                  <Label>Сезонность блюда</Label>
                  <div className="flex flex-wrap gap-2">
                    {seasonalityOptions.map(option => (
                          <Badge
                        key={option.id}
                        variant={advancedSettings.seasonality === option.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setAdvancedSettings(prev => ({ ...prev, seasonality: option.id }))}
                      >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                {/* Планирование питания */}
                <div className="space-y-2">
                  <Label>Планирование питания</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mealPlanningOptions.map(option => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${
                          advancedSettings.mealPlanning.type === option.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                        onClick={() => setAdvancedSettings(prev => ({
                          ...prev,
                          mealPlanning: { ...prev.mealPlanning, type: option.id }
                        }))}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                              </div>
                          ))}
                    </div>
                  </div>

                {/* Хранение */}
                <div className="space-y-2">
                  <Label>Способ хранения</Label>
                  <div className="flex flex-wrap gap-2">
                    {storageOptions.map(option => (
                      <Badge
                        key={option.id}
                        variant={advancedSettings.storage.method === option.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setAdvancedSettings(prev => ({
                          ...prev,
                          storage: { ...prev.storage, method: option.id }
                        }))}
                      >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                    </div>

                {/* Диетический фокус */}
                <div className="space-y-2">
                  <Label>Диетический фокус</Label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryFocusOptions.map(option => (
                      <Badge
                        key={option.id}
                        variant={advancedSettings.dietaryFocus.includes(option.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setAdvancedSettings(prev => ({
                            ...prev,
                            dietaryFocus: prev.dietaryFocus.includes(option.id)
                              ? prev.dietaryFocus.filter(id => id !== option.id)
                              : [...prev.dietaryFocus, option.id]
                          }))
                        }}
                      >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                      </Badge>
                    ))}
                          </div>
                </div>

                {/* Альтернативы и замены */}
                <div className="space-y-2">
                  <Label>Альтернативы и замены</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={advancedSettings.alternatives.enableSubstitutions}
                        onCheckedChange={(checked) =>
                          setAdvancedSettings(prev => ({
                            ...prev,
                            alternatives: { ...prev.alternatives, enableSubstitutions: checked }
                          }))
                        }
                      />
                      <Label>Предлагать замены ингредиентов</Label>
                        </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={advancedSettings.alternatives.preferLocalIngredients}
                        onCheckedChange={(checked) =>
                          setAdvancedSettings(prev => ({
                            ...prev,
                            alternatives: { ...prev.alternatives, preferLocalIngredients: checked }
                          }))
                        }
                      />
                      <Label>Предпочитать локальные ингредиенты</Label>
                        </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={advancedSettings.alternatives.allowFrozenIngredients}
                        onCheckedChange={(checked) =>
                          setAdvancedSettings(prev => ({
                            ...prev,
                            alternatives: { ...prev.alternatives, allowFrozenIngredients: checked }
                          }))
                        }
                      />
                      <Label>Разрешить замороженные ингредиенты</Label>
                        </div>
                      </div>
                    </div>
                  </div>
            </TabsContent>

            <TabsContent value="recipe">
              {recipe && recipe.name ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-bold text-orange-600">{recipe.name}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600"
                        onClick={() => setCookingMode(prev => ({ ...prev, isActive: true }))}
                      >
                        <Utensils className="w-4 h-4 mr-2" />
                        Начать готовить
                      </Button>

                      <Dialog open={showAddToPlannerDialog} onOpenChange={setShowAddToPlannerDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => setShowAddToPlannerDialog(true)}
                          >
                            <Plus className="w-4 h-4" />
                            Добавить в планировщик
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Добавить в планировщик</DialogTitle>
                            <DialogDescription>
                              Выберите дату и время приема пищи для добавления рецепта в планировщик
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Выберите дату</Label>
                              <Input
                                type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={(e) => {
                                  const newDate = new Date(e.target.value)
                                  newDate.setHours(0, 0, 0, 0)
                                  setSelectedDate(newDate)
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Прием пищи</Label>
                              <Select value={mealType} onValueChange={(value: 'breakfast' | 'lunch' | 'dinner') => setMealType(value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите прием пищи" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="breakfast">Завтрак</SelectItem>
                                  <SelectItem value="lunch">Обед</SelectItem>
                                  <SelectItem value="dinner">Ужин</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={async () => {
                                await addToPlanner()
                                setShowAddToPlannerDialog(false)
                              }}
                              className="w-full"
                            >
                              Добавить в планировщик
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href)
                          toast({
                            title: "Ссылка скопирована",
                            description: "Теперь вы можете поделиться рецептом"
                          })
                        }}
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={printRecipe}
                      >
                        <Printer className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFavorite}
                        className={`transition-colors ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="secondary" className="flex items-center bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 px-3 py-1 hover:from-orange-200 hover:to-pink-200 transition-all duration-300">
                    <Clock className="w-4 h-4 mr-1" />
                      Подготовка: {recipe.prepTime || 'N/A'} мин
                  </Badge>
                    <Badge variant="secondary" className="flex items-center bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 px-3 py-1 hover:from-orange-200 hover:to-pink-200 transition-all duration-300">
                    <Utensils className="w-4 h-4 mr-1" />
                      Приготовление: {recipe.cookTime || 'N/A'} мин
                  </Badge>
                    <Badge variant="secondary" className="flex items-center bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 px-3 py-1 hover:from-orange-200 hover:to-pink-200 transition-all duration-300">
                    <Users className="w-4 h-4 mr-1" />
                      Порций: {recipe.servings || 'N/A'}
                  </Badge>
                    <Badge variant="secondary" className="flex items-center bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 px-3 py-1 hover:from-orange-200 hover:to-pink-200 transition-all duration-300">
                    <Leaf className="w-4 h-4 mr-1" />
                      Сложность: {recipe.difficulty || 'N/A'}
                  </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Calculator className="w-4 h-4 mr-2" />
                          Пересчитать порции
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Калькулятор порций</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center gap-4">
                            <Label>Множитель порций:</Label>
                            <Input
                              type="number"
                              min="0.5"
                              max="10"
                              step="0.5"
                              value={portionMultiplier}
                              onChange={(e) => setPortionMultiplier(Number(e.target.value))}
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Пересчитанные ингредиенты:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {recipe.ingredients?.map((ingredient, index) => (
                                <li key={index}>{calculateIngredient(ingredient, portionMultiplier)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Ингредиенты</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {recipe.ingredients?.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-700">
                        <ClipboardList className="w-5 h-5" />
                        Инструкции по приготовлению
                      </h4>
                      <div className="space-y-4">
                        {recipe.instructions?.map((instruction, index) => (
                          <div 
                            key={index}
                            className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">{instruction}</p>
                              {recipe.tips && recipe.tips[index] && (
                                <div className="mt-2 flex items-start gap-2 text-sm text-orange-600 bg-white/50 p-2 rounded-md">
                                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <p>{recipe.tips[index]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-3">Пищевая ценность</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 font-semibold">{recipe.nutritionalInfo?.calories}</p>
                        <p className="text-sm text-gray-600">Калории</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 font-semibold">{recipe.nutritionalInfo?.protein}г</p>
                        <p className="text-sm text-gray-600">Белки</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 font-semibold">{recipe.nutritionalInfo?.fat}г</p>
                        <p className="text-sm text-gray-600">Жиры</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 font-semibold">{recipe.nutritionalInfo?.carbs}г</p>
                        <p className="text-sm text-gray-600">Углеводы</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-3 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 font-semibold">{recipe.nutritionalInfo?.fiber}г</p>
                        <p className="text-sm text-gray-600">Клетчатка</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{recipe.nutritionalInfo?.additionalInfo}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-3">Польза для здоровья</h4>
                    <ul className="space-y-2">
                      {recipe.healthBenefits?.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Heart className="w-4 h-4 mr-2 text-pink-500" />
                          {benefit}
                        </li>
                              ))}
                            </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-3">Влияние на настроение</h4>
                    <p className="text-gray-700">{recipe.moodBenefits}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-3">Полезные советы</h4>
                    <ul className="space-y-2">
                      {recipe.tips?.map((tip, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Flame className="w-4 h-4 mr-2 text-orange-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-6">
                    <h4 className="text-2xl font-semibold mb-4 flex items-center text-orange-700">
                      <Video className="w-6 h-6 mr-3" />
                      Видео-инструкция по приготовлению
                    </h4>
                    <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
                      <DialogTrigger asChild>
                    <Button
                          variant="outline"
                          className="w-full h-48 flex flex-col items-center justify-center gap-3 bg-white/50 hover:bg-white/80 transition-all duration-300 border-2 border-orange-200 hover:border-orange-400"
                          onClick={searchVideo}
                        >
                          <div className="relative">
                            <Video className="w-12 h-12 text-orange-500" />
                            <div className="absolute -top-1 -right-1">
                              <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                      </span>
                            </div>
                          </div>
                          <span className="text-lg font-medium text-orange-700">Посмотреть видео-инструкцию</span>
                          <p className="text-sm text-orange-600 opacity-75">Нажмите, чтобы найти видео с пошаговым приготовлением</p>
                    </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-orange-700">
                            Видео-инструкция: {recipe.name}
                          </DialogTitle>
                          <DialogDescription>
                            Пошаговая видео-инструкция по приготовлению рецепта
                          </DialogDescription>
                        </DialogHeader>
                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                          {!videoUrl ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-50 to-pink-50">
                              <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                  <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                                  <div className="absolute -top-1 -right-1">
                                    <span className="flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                    </span>
                                  </div>
                                </div>
                                <p className="text-orange-700 font-medium">Поиск видео-инструкции...</p>
                                <p className="text-orange-600 text-sm text-center">
                                  Подбираем наиболее подходящее видео для вашего рецепта
                                </p>
                              </div>
                            </div>
                          ) : (
                            <iframe
                              width="100%"
                              height="100%"
                              src={videoUrl}
                              title="Видео-инструкция"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-lg"
                            />
                      )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-3">Похожие рецепты</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {similarRecipes.map((similarRecipe) => (
                        <div
                          key={similarRecipe.name}
                          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setRecipe(similarRecipe)}
                        >
                          <h5 className="font-medium mb-2">{similarRecipe.name}</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{similarRecipe.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {similarRecipe.cookTime} мин
                      </span>
                          </div>
                        </div>
                      ))}
                    </div>
                          </div>
                        </motion.div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  Настройте параметры и создайте рецепт во вкладке "Настройки"
                </div>
              )}
            </TabsContent>

            <TabsContent value="planner">
              <Card>
                <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <AlarmClock className="w-6 h-6" />
                    Планировщик питания
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Организуйте свое меню на неделю
                  </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex bg-white/20 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-white hover:bg-white/20 ${viewMode === 'week' ? 'bg-white/30' : ''}`}
                          onClick={() => setViewMode('week')}
                        >
                          Неделя
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-white hover:bg-white/20 ${viewMode === 'month' ? 'bg-white/30' : ''}`}
                          onClick={() => setViewMode('month')}
                        >
                          Месяц
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => {
                            const newDate = new Date(currentWeek)
                            newDate.setDate(newDate.getDate() - (viewMode === 'week' ? 7 : 30))
                            setCurrentWeek(newDate)
                          }}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="font-medium">
                          {currentWeek.toLocaleDateString('ru-RU', { 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => {
                            const newDate = new Date(currentWeek)
                            newDate.setDate(newDate.getDate() + (viewMode === 'week' ? 7 : 30))
                            setCurrentWeek(newDate)
                          }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(() => {
                      const dates = viewMode === 'week' ? getWeekDates(currentWeek) : getMonthDates(currentWeek)
                      
                      return dates.map(date => {
                        const dayMeals = plannedMeals.filter(meal => {
                          const mealDate = new Date(meal.date)
                          return mealDate.getDate() === date.getDate() &&
                                 mealDate.getMonth() === date.getMonth() &&
                                 mealDate.getFullYear() === date.getFullYear()
                        })

                        if (dayMeals.length === 0 && viewMode === 'month') return null

                        return (
                          <div key={date.toISOString()} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-semibold ${
                                date.toDateString() === new Date().toDateString() 
                                  ? 'text-orange-600' 
                                  : 'text-gray-600'
                              }`}>
                                {date.toLocaleDateString('ru-RU', {
                              weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                            })}
                                {date.toDateString() === new Date().toDateString() && (
                                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                                    Сегодня
                                  </Badge>
                                )}
                          </h3>
                              {dayMeals.length > 0 && (
                                <Badge variant="outline" className="text-gray-500">
                                  {dayMeals.length} {dayMeals.length === 1 ? 'рецепт' : 
                                   dayMeals.length < 5 ? 'рецепта' : 'рецептов'}
                                </Badge>
                              )}
                            </div>
                            
                          <div className="grid gap-4">
                              {dayMeals.length > 0 ? (
                                dayMeals.map((meal, index) => (
                                  <motion.div
                                    key={meal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h4 className="font-medium text-lg text-orange-700">{meal.recipe.name}</h4>
                                    <p className="text-sm text-orange-600">
                                      {meal.mealType === 'breakfast' ? '🌅 Завтрак' :
                                       meal.mealType === 'lunch' ? '🌝 Обед' : '🌙 Ужин'}
                                    </p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {meal.recipe.cookTime} мин
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {meal.recipe.servings} порц.
                                      </span>
                  </div>
                                  </div>
                                  <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="bg-white hover:bg-orange-50"
                                          onClick={() => {
                                            setRecipe(meal.recipe);
                                            setCookingMode(prev => ({ ...prev, isActive: true }));
                                          }}
                                        >
                                          <Utensils className="w-4 h-4 mr-2" />
                                          Начать готовить
                                        </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="bg-white hover:bg-orange-50"
                                        >
                                          Подробнее
                                        </Button>
                                      </DialogTrigger>
                                          {/* ... существующий код диалога ... */}
                                    </Dialog>
                <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => removePlannerMeal(meal.id)}
                                    >
                                      <X className="w-4 h-4" />
                </Button>
                                  </div>
                                </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <p className="text-gray-500">Нет запланированных рецептов на этот день</p>
                              </div>
                              )}
                          </div>
                        </div>
                        )
                      }).filter(Boolean)
                    })()}
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </>
  )
}

