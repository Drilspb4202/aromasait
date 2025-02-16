'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplet, Loader2, Plus, X, Save, Sparkles, ChevronDown, ChevronUp, Power, Book, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Recipe, checkOilsCompatibility, availableOils as allOils } from '@/lib/oils-data'
import { RecipeLibrary } from './RecipeLibrary'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

interface Oil {
  name: string
  color: string
  description: string
  icon: string
}

interface BlendedOil extends Oil {
  amount: number
}

interface Blend {
  name: string
  oils: BlendedOil[]
  effect: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  rotation: number
  wave: number
  glow: number
  sparkle: number
  lifespan: number
}

interface SeverityConfig {
  variant: 'destructive' | 'secondary' | 'outline'
  label: string
  className?: string
}

const getSeverityConfig = (severity: 'high' | 'medium' | 'low'): SeverityConfig => {
  switch (severity) {
    case 'high':
      return {
        variant: 'destructive',
        label: 'Высокий'
      }
    case 'medium':
      return {
        variant: 'secondary',
        label: 'Средний',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      }
    case 'low':
      return {
        variant: 'outline',
        label: 'Низкий'
      }
  }
}

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string') {
    return `rgba(0, 0, 0, ${alpha})`
  }
  const cleanHex = hex.replace('#', '')
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return `rgba(0, 0, 0, ${alpha})`
  }
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function VirtualDiffuser() {
  const [blendedOils, setBlendedOils] = useState<BlendedOil[]>([])
  const [selectedOil, setSelectedOil] = useState<string>('')
  const [blendEffect, setBlendEffect] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [savedBlends, setSavedBlends] = useState<Blend[]>([])
  const [blendName, setBlendName] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGeneratingAIBlend, setIsGeneratingAIBlend] = useState(false)
  const [hoveredOil, setHoveredOil] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const [showRecipeLibrary, setShowRecipeLibrary] = useState(false)
  const [incompatibilities, setIncompatibilities] = useState<Array<{ oil1: string; oil2: string; reason: string; severity: 'low' | 'medium' | 'high' }>>([])
  const { user } = useUser()
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [selectedPurpose, setSelectedPurpose] = useState<string>('')
  const [blendRecommendations, setBlendRecommendations] = useState<string>('')
  const [blendSynergy, setBlendSynergy] = useState<string>('')

  const moods = [
    { value: 'спокойствие', label: 'Спокойствие', icon: '😌' },
    { value: 'энергия', label: 'Энергичность', icon: '⚡' },
    { value: 'радость', label: 'Радость', icon: '😊' },
    { value: 'фокус', label: 'Концентрация', icon: '🎯' },
    { value: 'расслабление', label: 'Расслабление', icon: '🌙' },
    { value: 'гармония', label: 'Гармония', icon: '☯️' }
  ]

  const purposes = [
    { value: 'meditation', label: 'Для медитации', icon: '🧘‍♀️' },
    { value: 'work', label: 'Для работы', icon: '💼' },
    { value: 'sleep', label: 'Для сна', icon: '😴' },
    { value: 'energy', label: 'Для энергии', icon: '✨' },
    { value: 'relaxation', label: 'Для отдыха', icon: '🛋️' },
    { value: 'creativity', label: 'Для творчества', icon: '🎨' }
  ]

  const toggleDiffuser = () => {
    setIsRunning(!isRunning)
    toast.success(isRunning ? 'Диффузор остановлен' : 'Диффузор запущен')
  }

  const addOil = async () => {
    if (selectedOil && blendedOils.length < 5) {
      const oilToAdd = allOils.find(oil => oil.name === selectedOil)
      if (oilToAdd) {
        // Проверяем совместимость
        const newIncompatibilities = checkOilsCompatibility([...blendedOils.map(o => o.name), oilToAdd.name])
        setIncompatibilities(newIncompatibilities)

        if (newIncompatibilities.length > 0) {
          const severity = Math.max(...newIncompatibilities.map(inc => 
            inc.severity === 'high' ? 3 : inc.severity === 'medium' ? 2 : 1
          ))

          if (severity === 3) {
            toast.error('Это масло несовместимо с текущей смесью!')
            return
          } else {
            toast('Внимание: некоторые масла могут конфликтовать между собой', {
              icon: '⚠️',
              style: {
                background: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeeba'
              }
            })
          }
        }

        setBlendedOils([...blendedOils, { 
          name: oilToAdd.name,
          color: oilToAdd.color,
          description: oilToAdd.description,
          icon: oilToAdd.icon,
          amount: 1 
        }])
        setSelectedOil('')
      } else {
        toast.error('Выбранное масло не найдено')
      }
    } else if (blendedOils.length >= 5) {
      toast.error('Максимум 5 масел в смеси')
    }
  }

  const removeOil = (index: number) => {
    setBlendedOils(blendedOils.filter((_, i) => i !== index))
  }

  const updateOilAmount = (index: number, amount: number) => {
    const updatedOils = [...blendedOils]
    updatedOils[index].amount = amount
    setBlendedOils(updatedOils)
  }

  const getBlendEffect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/blend-effect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blend: blendedOils }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBlendEffect(data.effect)
    } catch (error) {
      console.error('Error fetching blend effect:', error)
      toast.error('Не удалось получить эффект смеси. Пожалуйста, попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  const saveBlend = async () => {
    if (!user) {
      toast.error('Пожалуйста, войдите в систему чтобы сохранять рецепты')
      return
    }

    if (blendName.trim() === '') {
      toast.error('Пожалуйста, введите название смеси')
      return
    }
    if (blendedOils.length === 0) {
      toast.error('Добавьте хотя бы одно масло в смесь')
      return
    }

    try {
      // Определяем настроение и время суток на основе эффекта и состава
      const currentHour = new Date().getHours()
      let timeOfDay: string[] = []
      if (currentHour >= 5 && currentHour < 12) timeOfDay = ['morning']
      else if (currentHour >= 12 && currentHour < 17) timeOfDay = ['afternoon']
      else if (currentHour >= 17 && currentHour < 22) timeOfDay = ['evening']
      else timeOfDay = ['night']

      // Определяем настроение и преимущества на основе свойств масел
      const moods = new Set<string>()
      const benefits = new Set<string>()
      
      blendedOils.forEach(oil => {
        const fullOil = allOils.find(o => o.name === oil.name)
        if (fullOil) {
          fullOil.mood?.forEach(m => moods.add(m))
          fullOil.properties?.forEach(p => benefits.add(p))
        }
      })

      const recipe = {
        user_id: user.id,
      name: blendName,
      oils: blendedOils,
        effect: blendEffect || 'Эффект уточняется',
        mood: Array.from(moods),
        time_of_day: timeOfDay,
        benefits: Array.from(benefits),
        category: 'Пользовательский'
      }

      console.log('Saving recipe:', recipe) // Для отладки

      const { error } = await supabase
        .from('user_recipes')
        .insert([recipe])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      toast.success('Рецепт успешно сохранен')
      setBlendName('')
    } catch (error) {
      console.error('Error saving recipe:', error)
      if (error instanceof Error) {
        toast.error(`Не удалось сохранить рецепт: ${error.message}`)
      } else {
        toast.error('Не удалось сохранить рецепт. Попробуйте еще раз.')
      }
    }
  }

  const generateAIBlend = async () => {
    setIsGeneratingAIBlend(true)
    try {
      const response = await fetch('/api/generate-blend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mood: selectedMood,
          purpose: selectedPurpose
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate blend')
      }

      const data = await response.json()
      
      const selectedOils = data.oils.map((oil: { name: string; amount: number }) => {
        const fullOil = allOils.find(o => o.name === oil.name)
        if (!fullOil) throw new Error(`Oil ${oil.name} not found`)
        return {
          name: oil.name,
          color: fullOil.color,
          description: fullOil.description,
          icon: fullOil.icon,
          amount: oil.amount
        }
      })

      setBlendedOils(selectedOils)
      setBlendName(data.name)
      setBlendEffect(data.effect)
      setBlendRecommendations(data.recommendations)
      setBlendSynergy(data.synergy)
      toast.success('AI создала новую смесь!')
    } catch (error) {
      console.error('Error generating blend:', error)
      toast.error(error instanceof Error ? error.message : 'Не удалось создать смесь. Попробуйте еще раз.')
    } finally {
      setIsGeneratingAIBlend(false)
    }
  }

  const handleApplyRecipe = (recipe: Recipe) => {
    if (blendedOils.length > 0) {
      if (window.confirm('Текущая смесь будет заменена. Продолжить?')) {
        setBlendedOils(recipe.oils.map(oil => {
          const fullOil = allOils.find(o => o.name === oil.name)
          if (!fullOil) throw new Error(`Oil ${oil.name} not found`)
          return { ...fullOil, amount: oil.amount }
        }))
        setShowRecipeLibrary(false)
        toast.success('Рецепт применен')
      }
    } else {
      setBlendedOils(recipe.oils.map(oil => {
        const fullOil = allOils.find(o => o.name === oil.name)
        if (!fullOil) throw new Error(`Oil ${oil.name} not found`)
        return { ...fullOil, amount: oil.amount }
      }))
      setShowRecipeLibrary(false)
      toast.success('Рецепт применен')
    }
  }

  useEffect(() => {
    if (blendedOils.length > 0) {
      getBlendEffect()
    } else {
      setBlendEffect('')
    }
  }, [blendedOils])

  const createParticle = (canvas: HTMLCanvasElement, colors: string[]): Particle => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const x = canvas.width / 2 + (Math.random() - 0.5) * 60
    const y = canvas.height - 20 + (Math.random() - 0.5) * 10
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8
    const speed = 0.3 + Math.random() * 1.2
    
          return {
            x,
            y,
            vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      color,
      alpha: 0.1 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      wave: Math.random() * Math.PI * 2,
      glow: 0.5 + Math.random() * 0.5,
      sparkle: Math.random(),
      lifespan: 1.0
    }
  }

  const drawDiffuser = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Фоновый градиент с анимацией
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    const alpha1 = 0.05 + Math.sin(time / 2000) * 0.02
    const alpha2 = 0.15 + Math.sin(time / 1800) * 0.03
    gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha1})`)
    gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha2})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Анимированное основание диффузора
    const baseGlow = 0.3 + Math.sin(time / 1000) * 0.1
    
    // Рисуем тень основания
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetY = 5
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height - 8, 45, 18, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fill()
    ctx.restore()

    // Основание диффузора с градиентом
    const baseGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height - 10, 0,
      canvas.width / 2, canvas.height - 10, 45
    )
    baseGradient.addColorStop(0, `rgba(240, 240, 240, ${baseGlow + 0.3})`)
    baseGradient.addColorStop(0.7, `rgba(200, 200, 200, ${baseGlow + 0.2})`)
    baseGradient.addColorStop(1, `rgba(180, 180, 180, ${baseGlow + 0.1})`)

    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height - 10, 40, 15, 0, 0, Math.PI * 2)
    ctx.fillStyle = baseGradient
    ctx.fill()

    // Светящийся контур
    ctx.strokeStyle = `rgba(255, 255, 255, ${baseGlow + 0.2})`
    ctx.lineWidth = 2
    ctx.stroke()

    // Внутренний блик
    const innerGlow = ctx.createRadialGradient(
      canvas.width / 2 - 10, canvas.height - 15, 0,
      canvas.width / 2 - 10, canvas.height - 15, 25
    )
    innerGlow.addColorStop(0, `rgba(255, 255, 255, ${baseGlow + 0.3})`)
    innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = innerGlow
    ctx.fill()

    // Множественные волны на поверхности
    const waveCount = 3
    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - 35, canvas.height - 10)
      for (let i = 0; i <= 70; i++) {
        const x = canvas.width / 2 - 35 + i
        const phase = time / (1000 + w * 200)
        const amplitude = 2 - w * 0.5
        const y = canvas.height - 10 + Math.sin(phase + i / (10 - w * 2)) * amplitude
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - w * 0.08})`
      ctx.stroke()
    }

    // Добавляем динамические световые блики
    const highlights = 3
    for (let h = 0; h < highlights; h++) {
      const angle = (time / (1000 + h * 200)) + (h * Math.PI * 2 / highlights)
      const radius = 20 + Math.sin(time / 800 + h) * 5
      const highlightX = canvas.width / 2 + Math.cos(angle) * radius
      const highlightY = canvas.height - 10 + Math.sin(angle) * 5
      
      const highlightGradient = ctx.createRadialGradient(
        highlightX, highlightY, 0,
        highlightX, highlightY, 8 + Math.sin(time / 600) * 2
      )
      highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 + Math.sin(time / 400 + h) * 0.1})`)
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(highlightX, highlightY, 8 + Math.sin(time / 600) * 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const updateAndDrawParticles = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    particles: Particle[],
    isRunning: boolean,
    time: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawDiffuser(ctx, canvas, time)

    if (!isRunning) return

    particles.forEach((particle, index) => {
      // Обновление позиции с более плавным движением
      particle.x += particle.vx
      particle.y += particle.vy * (1 - Math.sin(particle.wave) * 0.3)
      particle.vy -= 0.015 // Более медленное замедление
      particle.wave += 0.03
      particle.rotation += 0.01
      particle.lifespan -= 0.003

      // Волнообразное движение
      particle.x += Math.sin(particle.wave + time / 1000) * 0.2

      // Эффект мерцания
      const flicker = 0.7 + Math.sin(time / 100 + particle.sparkle * 10) * 0.3

      // Эффект свечения с пульсацией
      const glowIntensity = 10 + Math.sin(time / 200 + particle.sparkle * 5) * 5
      ctx.shadowBlur = glowIntensity
      ctx.shadowColor = particle.color

      // Отрисовка частицы
      ctx.beginPath()
            ctx.save()
            ctx.translate(particle.x, particle.y)
            ctx.rotate(particle.rotation)
            
      // Создаем градиент для частицы
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size)
      const alpha = particle.alpha * particle.lifespan * flicker
      const color = particle.color || '#ffffff' // Добавляем проверку на случай отсутствия цвета
      
      try {
        gradient.addColorStop(0, hexToRgba(color, alpha * particle.glow))
        gradient.addColorStop(0.6, hexToRgba(color, alpha * 0.5))
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      } catch (error) {
        console.error('Gradient error:', error)
        // Используем запасной вариант в случае ошибки
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * particle.glow})`)
        gradient.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      }

      // Рисуем частицу с градиентом
            ctx.fillStyle = gradient
      
      // Рисуем каплю вместо прямоугольника
            ctx.beginPath()
      const dropSize = particle.size
      ctx.moveTo(0, -dropSize)
      // Верхняя часть капли
      ctx.bezierCurveTo(
        dropSize * 0.5, -dropSize,
        dropSize, -dropSize * 0.5,
        dropSize, 0
      )
      // Нижняя часть капли
      ctx.bezierCurveTo(
        dropSize, dropSize * 0.5,
        dropSize * 0.5, dropSize,
        0, dropSize
      )
      // Левая сторона капли
            ctx.bezierCurveTo(
        -dropSize * 0.5, dropSize,
        -dropSize, dropSize * 0.5,
        -dropSize, 0
      )
      // Завершающая кривая
            ctx.bezierCurveTo(
        -dropSize, -dropSize * 0.5,
        -dropSize * 0.5, -dropSize,
        0, -dropSize
      )
      ctx.closePath()
      ctx.fill()

      // Добавляем блики
      if (particle.sparkle > 0.8) {
        const sparkleGradient = ctx.createRadialGradient(
          -particle.size * 0.3, -particle.size * 0.3, 0,
          -particle.size * 0.3, -particle.size * 0.3, particle.size * 0.5
        )
        sparkleGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.7})`)
        sparkleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = sparkleGradient
            ctx.fill()
      }

      ctx.restore()
      ctx.shadowBlur = 0

      // Обновление частицы при достижении верха или окончании жизненного цикла
      if (particle.y < 50 || particle.lifespan <= 0) {
        particles[index] = createParticle(canvas, blendedOils.map(oil => oil.color))
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Установка размеров canvas
    canvas.width = 300
    canvas.height = 400

    // Инициализация частиц
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 60 }, () =>
        createParticle(canvas, blendedOils.map(oil => oil.color))
      )
    }

    let animationId: number
    let startTime = Date.now()

    const animate = () => {
      if (ctx && canvas) {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime
        updateAndDrawParticles(ctx, canvas, particlesRef.current, isRunning, elapsedTime)
      }
      animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isRunning, blendedOils])

  return (
    <div className="relative">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Виртуальный аромадиффузор</CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={showRecipeLibrary} onOpenChange={setShowRecipeLibrary}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setShowRecipeLibrary(true)}>
                    <Book className="mr-2 h-4 w-4" />
                    Открыть библиотеку рецептов
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Библиотека рецептов</DialogTitle>
                    <DialogDescription>
                      Выберите рецепт из библиотеки
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh]">
                    <RecipeLibrary onApplyRecipe={handleApplyRecipe} />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isRunning ? "destructive" : "default"}
                      size="icon"
                      onClick={toggleDiffuser}
                    >
                      <Power className={`h-4 w-4 ${isRunning ? 'animate-pulse' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRunning ? 'Выключить' : 'Включить'} диффузор</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <Select value={selectedOil} onValueChange={setSelectedOil}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите масло" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[300px]">
                      {allOils.map((oil) => (
                      <SelectItem key={oil.name} value={oil.name}>
                          <div className="flex items-center gap-2">
                            <span>{oil.icon}</span>
                            <div>
                              <div className="font-medium">{oil.name}</div>
                              <div className="text-xs text-gray-500">{oil.description}</div>
                            </div>
                        </div>
                      </SelectItem>
                    ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Настроение</Label>
                      <Select value={selectedMood} onValueChange={setSelectedMood}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите настроение" />
                        </SelectTrigger>
                        <SelectContent>
                          {moods.map((mood) => (
                            <SelectItem key={mood.value} value={mood.value}>
                              <div className="flex items-center gap-2">
                                <span>{mood.icon}</span>
                                <span>{mood.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Цель использования</Label>
                      <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите цель" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposes.map((purpose) => (
                            <SelectItem key={purpose.value} value={purpose.value}>
                              <div className="flex items-center gap-2">
                                <span>{purpose.icon}</span>
                                <span>{purpose.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 space-x-2">
                  <Button onClick={addOil} className="flex-1 bg-gradient-to-r from-green-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600">
                    <Plus className="w-4 h-4 mr-2" /> Добавить масло
                  </Button>
                  <Button onClick={generateAIBlend} className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600" disabled={isGeneratingAIBlend}>
                    {isGeneratingAIBlend ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isGeneratingAIBlend ? 'Генерация...' : 'AI смесь'}
                  </Button>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <AnimatePresence>
                  {blendedOils.map((oil, index) => (
                    <motion.div
                      key={oil.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
                      onMouseEnter={() => setHoveredOil(oil.name)}
                      onMouseLeave={() => setHoveredOil(null)}
                    >
                      <div className="text-2xl">{oil.icon}</div>
                      <div className="flex-grow">
                        <div className="font-medium">{oil.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{oil.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[oil.amount]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => updateOilAmount(index, value[0])}
                          className="w-24"
                        />
                        <span className="w-8 text-center">{oil.amount}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeOil(index)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mb-6">
                <Label htmlFor="blendName">Название смеси</Label>
                <div className="flex mt-1">
                  <Input
                    id="blendName"
                    value={blendName}
                    onChange={(e) => setBlendName(e.target.value)}
                    placeholder="Введите название смеси"
                    className="flex-grow"
                  />
                  <Button onClick={saveBlend} className="ml-2 bg-green-500 hover:bg-green-600 text-white">
                    <Save className="w-4 h-4 mr-2" /> Сохранить
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Визуализация смеси</h3>
                <div className="relative">
                  <canvas ref={canvasRef} width="400" height="400" className="w-full h-auto bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-lg shadow-inner" />
                  {hoveredOil && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg">
                              <p className="font-semibold">{hoveredOil}</p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{allOils.find(oil => oil.name === hoveredOil)?.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              {isLoading ? (
                <div className="mt-4 flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Loader2 className="h-6 w-6 animate-spin mr-2 text-teal-500" />
                  <span>Анализ смеси...</span>
                </div>
              ) : (blendEffect || blendRecommendations || blendSynergy) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 space-y-4"
                >
                  {blendEffect && (
                    <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">Эффект смеси:</h3>
                      <p className="text-gray-800 dark:text-gray-200">{blendEffect}</p>
                    </div>
                  )}
                  {blendSynergy && (
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Синергия масел:</h3>
                      <p className="text-gray-800 dark:text-gray-200">{blendSynergy}</p>
                    </div>
                  )}
                  {blendRecommendations && (
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Рекомендации по использованию:</h3>
                      <p className="text-gray-800 dark:text-gray-200">{blendRecommendations}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
          {incompatibilities.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Предупреждения о совместимости
              </h3>
              <ul className="mt-2 space-y-2">
                {incompatibilities.map((inc, index) => {
                  const severityConfig = getSeverityConfig(inc.severity)
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <Badge 
                        variant={severityConfig.variant}
                        className={severityConfig.className}
                      >
                        {severityConfig.label}
                      </Badge>
                      <span>
                        {inc.oil1} + {inc.oil2}: {inc.reason}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const darkModeStyles = `
  .dark .bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
  }
  .dark .from-green-900 {
    --tw-gradient-from: #064e3b;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(6, 78, 59, 0));
  }
  .dark .to-teal-800 {
    --tw-gradient-to: #115e59;
  }
`

const style = document.createElement('style')
style.textContent = darkModeStyles
document.head.appendChild(style)

