'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward, Moon, Sun, Zap, Heart, Timer, Star, Plus, Save, Calendar, Cloud, Palette, Shield, Gift, HeartPulseIcon as Heartbeat } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Meditation {
  id: string
  name: string
  audio: string
  duration: number
  category: 'sleep' | 'energy' | 'relax' | 'focus' | 'love' | 'stress' | 'creativity' | 'confidence' | 'gratitude' | 'healing'
  description: string
  oils: {
    name: string
    description: string
    usage: string
  }[]
  background: string
  benefits: string[]
}

const categories = [
  { id: 'sleep', name: 'Сон', icon: Moon, color: 'bg-indigo-500' },
  { id: 'energy', name: 'Энергия', icon: Zap, color: 'bg-yellow-500' },
  { id: 'relax', name: 'Расслабление', icon: Heart, color: 'bg-pink-500' },
  { id: 'focus', name: 'Концентрация', icon: Sun, color: 'bg-orange-500' },
  { id: 'love', name: 'Любовь', icon: Heart, color: 'bg-red-500' },
  { id: 'stress', name: 'Антистресс', icon: Cloud, color: 'bg-blue-500' },
  { id: 'creativity', name: 'Творчество', icon: Palette, color: 'bg-purple-500' },
  { id: 'confidence', name: 'Уверенность', icon: Shield, color: 'bg-green-500' },
  { id: 'gratitude', name: 'Благодарность', icon: Gift, color: 'bg-yellow-600' },
  { id: 'healing', name: 'Исцеление', icon: Heartbeat, color: 'bg-red-600' }
]

const meditations: Meditation[] = [
  // Sleep meditations
  {
    id: 'sleep1',
    name: 'Спокойный сон',
    audio: 'https://www.dropbox.com/s/your-file-path/sleep1.mp3?raw=1',
    duration: 900,
    category: 'sleep',
    description: 'Мягкая медитация для спокойного сна',
    oils: [{ name: 'Лаванда', description: 'Успокаивающий аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/sleep1.jpg', 
    benefits: ['Улучшение сна', 'Снятие стресса']
  },
  {
    id: 'sleep2',
    name: 'Глубокий сон',
    audio: 'https://www.dropbox.com/s/your-file-path/sleep2.mp3?raw=1',
    duration: 1200,
    category: 'sleep',
    description: 'Медитация для глубокого и качественного сна',
    oils: [{ name: 'Ромашка', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/sleep2.jpg',
    benefits: ['Глубокий сон', 'Восстановление']
  },
  {
    id: 'sleep3',
    name: 'Сновидения',
    audio: 'https://www.dropbox.com/s/your-file-path/sleep3.mp3?raw=1',
    duration: 1500,
    category: 'sleep',
    description: 'Медитация для осознанных сновидений',
    oils: [{ name: 'Ваниль', description: 'Расслабляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/sleep3.jpg',
    benefits: ['Осознанные сны', 'Спокойный сон']
  },
  {
    id: 'sleep4',
    name: 'Ночной покой',
    audio: 'https://www.dropbox.com/s/your-file-path/sleep4.mp3?raw=1',
    duration: 720,
    category: 'sleep',
    description: 'Медитация для спокойной ночи',
    oils: [{ name: 'Кедр', description: 'Заземляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/sleep4.jpg',
    benefits: ['Успокоение ума', 'Глубокий сон']
  },
  {
    id: 'sleep5',
    name: 'Сладкие грезы',
    audio: 'https://www.dropbox.com/s/your-file-path/sleep5.mp3?raw=1',
    duration: 840,
    category: 'sleep',
    description: 'Медитация для сладких снов',
    oils: [{ name: 'Иланг-иланг', description: 'Расслабляющий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/sleep5.jpg',
    benefits: ['Снятие тревоги', 'Приятные сновидения']
  },
  {
    id: 'energy1',
    name: 'Утренняя зарядка',
    audio: 'https://www.dropbox.com/s/your-file-path/energy1.mp3?raw=1',
    duration: 480,
    category: 'energy',
    description: 'Бодрящая медитация для начала дня',
    oils: [{ name: 'Лимон', description: 'Бодрящий аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/energy1.jpg',
    benefits: ['Повышение энергии', 'Улучшение настроения']
  },
  {
    id: 'energy2',
    name: 'Энергия дня',
    audio: 'https://www.dropbox.com/s/your-file-path/energy2.mp3?raw=1',
    duration: 360,
    category: 'energy',
    description: 'Медитация для наполнения энергией',
    oils: [{ name: 'Апельсин', description: 'Бодрящий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/energy2.jpg',
    benefits: ['Прилив сил', 'Хорошее настроение']
  },
  {
    id: 'energy3',
    name: 'Сила воли',
    audio: 'https://www.dropbox.com/s/your-file-path/energy3.mp3?raw=1',
    duration: 540,
    category: 'energy',
    description: 'Медитация для укрепления силы воли',
    oils: [{ name: 'Грейпфрут', description: 'Тонизирующий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/energy3.jpg',
    benefits: ['Уверенность', 'Энергичность']
  },
  {
    id: 'energy4',
    name: 'Творческая энергия',
    audio: 'https://www.dropbox.com/s/your-file-path/energy4.mp3?raw=1',
    duration: 600,
    category: 'energy',
    description: 'Медитация для повышения творческой энергии',
    oils: [{ name: 'Бергамот', description: 'Вдохновляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/energy4.jpg',
    benefits: ['Вдохновение', 'Креативность']
  },
  {
    id: 'energy5',
    name: 'Активность и бодрость',
    audio: 'https://www.dropbox.com/s/your-file-path/energy5.mp3?raw=1',
    duration: 420,
    category: 'energy',
    description: 'Медитация для повышения активности и бодрости',
    oils: [{ name: 'Мята перечная', description: 'Освежающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/energy5.jpg',
    benefits: ['Активность', 'Бодрость']
  },
  {
    id: 'energy6',
    name: 'Утренняя бодрость',
    audio: 'https://www.dropbox.com/s/your-file-path/energy6.mp3?raw=1',
    duration: 480,
    category: 'energy',
    description: 'Медитация для пробуждения и энергии',
    oils: [{ name: 'Грейпфрут', description: 'Бодрящий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/energy6.jpg',
    benefits: ['Бодрость', 'Энергичность']
  },
  {
    id: 'energy7',
    name: 'Солнечная энергия',
    audio: 'https://www.dropbox.com/s/your-file-path/energy7.mp3?raw=1',
    duration: 600,
    category: 'energy',
    description: 'Медитация для наполнения солнечной энергией',
    oils: [{ name: 'Апельсин', description: 'Солнечный аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/energy7.jpg',
    benefits: ['Энергия', 'Оптимизм']
  },
  {
    id: 'relax1',
    name: 'Глубокое расслабление',
    audio: 'https://www.dropbox.com/s/your-file-path/relax1.mp3?raw=1',
    duration: 600,
    category: 'relax',
    description: 'Медитация для глубокого расслабления',
    oils: [{ name: 'Лаванда', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/relax1.jpg',
    benefits: ['Снятие стресса', 'Расслабление мышц']
  },
  {
    id: 'relax2',
    name: 'Расслабление тела',
    audio: 'https://www.dropbox.com/s/your-file-path/relax2.mp3?raw=1',
    duration: 720,
    category: 'relax',
    description: 'Медитация для расслабления тела',
    oils: [{ name: 'Ромашка', description: 'Расслабляющий аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/relax2.jpg',
    benefits: ['Расслабление', 'Успокоение']
  },
  {
    id: 'relax3',
    name: 'Умиротворение',
    audio: 'https://www.dropbox.com/s/your-file-path/relax3.mp3?raw=1',
    duration: 480,
    category: 'relax',
    description: 'Медитация для достижения умиротворения',
    oils: [{ name: 'Сандал', description: 'Успокаивающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/relax3.jpg',
    benefits: ['Успокоение', 'Гармония']
  },
  {
    id: 'relax4',
    name: 'Спокойствие и мир',
    audio: 'https://www.dropbox.com/s/your-file-path/relax4.mp3?raw=1',
    duration: 660,
    category: 'relax',
    description: 'Медитация для обретения спокойствия и мира',
    oils: [{ name: 'Иланг-иланг', description: 'Расслабляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/relax4.jpg',
    benefits: ['Спокойствие', 'Расслабление']
  },
  {
    id: 'relax5',
    name: 'Внутренняя гармония',
    audio: 'https://www.dropbox.com/s/your-file-path/relax5.mp3?raw=1',
    duration: 900,
    category: 'relax',
    description: 'Медитация для достижения внутренней гармонии',
    oils: [{ name: 'Кедр', description: 'Заземляющий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/relax5.jpg',
    benefits: ['Гармония', 'Равновесие']
  },
  {
    id: 'relax6',
    name: 'Океан спокойствия',
    audio: 'https://www.dropbox.com/s/your-file-path/relax6.mp3?raw=1',
    duration: 720,
    category: 'relax',
    description: 'Медитация с звуками океана',
    oils: [{ name: 'Иланг-иланг', description: 'Расслабляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/relax6.jpg',
    benefits: ['Спокойствие', 'Умиротворение']
  },
  {
    id: 'relax7',
    name: 'Лесная тишина',
    audio: 'https://www.dropbox.com/s/your-file-path/relax7.mp3?raw=1',
    duration: 840,
    category: 'relax',
    description: 'Медитация в окружении природы',
    oils: [{ name: 'Кедр', description: 'Лесной аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/relax7.jpg',
    benefits: ['Единение с природой', 'Расслабление']
  },
  {
    id: 'focus1',
    name: 'Ясный ум',
    audio: 'https://www.dropbox.com/s/your-file-path/focus1.mp3?raw=1',
    duration: 420,
    category: 'focus',
    description: 'Медитация для повышения концентрации',
    oils: [{ name: 'Мята', description: 'Освежающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/focus1.jpg',
    benefits: ['Улучшение фокуса', 'Повышение внимания']
  },
  {
    id: 'focus2',
    name: 'Концентрация',
    audio: 'https://www.dropbox.com/s/your-file-path/focus2.mp3?raw=1',
    duration: 540,
    category: 'focus',
    description: 'Медитация для улучшения концентрации',
    oils: [{ name: 'Розмарин', description: 'Стимулирующий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/focus2.jpg',
    benefits: ['Фокус', 'Концентрация']
  },
  {
    id: 'focus3',
    name: 'Ментальная ясность',
    audio: 'https://www.dropbox.com/s/your-file-path/focus3.mp3?raw=1',
    duration: 360,
    category: 'focus',
    description: 'Медитация для достижения ментальной ясности',
    oils: [{ name: 'Лимон', description: 'Освежающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/focus3.jpg',
    benefits: ['Ясность ума', 'Острота мысли']
  },
  {
    id: 'focus4',
    name: 'Продуктивность',
    audio: 'https://www.dropbox.com/s/your-file-path/focus4.mp3?raw=1',
    duration: 480,
    category: 'focus',
    description: 'Медитация для повышения продуктивности',
    oils: [{ name: 'Эвкалипт', description: 'Стимулирующий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/focus4.jpg',
    benefits: ['Продуктивность', 'Эффективность']
  },
  {
    id: 'focus5',
    name: 'Внимательность',
    audio: 'https://www.dropbox.com/s/your-file-path/focus5.mp3?raw=1',
    duration: 600,
    category: 'focus',
    description: 'Медитация для развития внимательности',
    oils: [{ name: 'Базилик', description: 'Стимулирующий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/focus5.jpg',
    benefits: ['Внимательность', 'Сосредоточенность']
  },
  {
    id: 'focus6',
    name: 'Острый разум',
    audio: 'https://www.dropbox.com/s/your-file-path/focus6.mp3?raw=1',
    duration: 540,
    category: 'focus',
    description: 'Медитация для обострения разума',
    oils: [{ name: 'Розмарин', description: 'Стимулирующий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/focus6.jpg',
    benefits: ['Ясность ума', 'Концентрация']
  },
  {
    id: 'focus7',
    name: 'Поток внимания',
    audio: 'https://www.dropbox.com/s/your-file-path/focus7.mp3?raw=1',
    duration: 480,
    category: 'focus',
    description: 'Медитация для устойчивого внимания',
    oils: [{ name: 'Лимон', description: 'Освежающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/focus7.jpg',
    benefits: ['Внимательность', 'Сосредоточенность']
  },
  {
    id: 'love1',
    name: 'Любовь к себе',
    audio: 'https://www.dropbox.com/s/your-file-path/love1.mp3?raw=1',
    duration: 600,
    category: 'love',
    description: 'Медитация для развития любви к себе',
    oils: [{ name: 'Роза', description: 'Романтический аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/love1.jpg',
    benefits: ['Самолюбовь', 'Уверенность']
  },
  {
    id: 'love2',
    name: 'Открытие сердца',
    audio: 'https://www.dropbox.com/s/your-file-path/love2.mp3?raw=1',
    duration: 720,
    category: 'love',
    description: 'Медитация для открытия сердца',
    oils: [{ name: 'Жасмин', description: 'Романтический аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/love2.jpg',
    benefits: ['Сострадание', 'Эмпатия']
  },
  {
    id: 'love3',
    name: 'Гармония отношений',
    audio: 'https://www.dropbox.com/s/your-file-path/love3.mp3?raw=1',
    duration: 480,
    category: 'love',
    description: 'Медитация для гармонии в отношениях',
    oils: [{ name: 'Иланг-иланг', description: 'Романтический аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/love3.jpg',
    benefits: ['Гармония', 'Любовь']
  },
  {
    id: 'love4',
    name: 'Принятие',
    audio: 'https://www.dropbox.com/s/your-file-path/love4.mp3?raw=1',
    duration: 660,
    category: 'love',
    description: 'Медитация для принятия себя и других',
    oils: [{ name: 'Сандал', description: 'Успокаивающий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/love4.jpg',
    benefits: ['Принятие', 'Прощение']
  },
  {
    id: 'love5',
    name: 'Благодарность',
    audio: 'https://www.dropbox.com/s/your-file-path/love5.mp3?raw=1',
    duration: 900,
    category: 'love',
    description: 'Медитация для развития благодарности',
    oils: [{ name: 'Пачули', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/love5.jpg',
    benefits: ['Благодарность', 'Радость']
  },
  {
    id: 'love6',
    name: 'Безусловная любовь',
    audio: 'https://www.dropbox.com/s/your-file-path/love6.mp3?raw=1',
    duration: 720,
    category: 'love',
    description: 'Медитация для развития безусловной любви',
    oils: [{ name: 'Роза', description: 'Аромат любви', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/love6.jpg',
    benefits: ['Безусловная любовь', 'Принятие']
  },
  {
    id: 'love7',
    name: 'Сердечная мудрость',
    audio: 'https://www.dropbox.com/s/your-file-path/love7.mp3?raw=1',
    duration: 840,
    category: 'love',
    description: 'Медитация для раскрытия мудрости сердца',
    oils: [{ name: 'Нероли', description: 'Чувственный аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/love7.jpg',
    benefits: ['Мудрость сердца', 'Любовь']
  },
  {
    id: 'stress1',
    name: 'Снятие стресса',
    audio: 'https://www.dropbox.com/s/your-file-path/stress1.mp3?raw=1',
    duration: 600,
    category: 'stress',
    description: 'Медитация для снятия стресса',
    oils: [{ name: 'Лаванда', description: 'Успокаивающий аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/stress1.jpg',
    benefits: ['Снятие стресса', 'Расслабление']
  },
  {
    id: 'stress2',
    name: 'Успокоение ума',
    audio: 'https://www.dropbox.com/s/your-file-path/stress2.mp3?raw=1',
    duration: 720,
    category: 'stress',
    description: 'Медитация для успокоения ума',
    oils: [{ name: 'Ромашка', description: 'Расслабляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/stress2.jpg',
    benefits: ['Успокоение', 'Расслабление']
  },
  {
    id: 'stress3',
    name: 'Внутренний покой',
    audio: 'https://www.dropbox.com/s/your-file-path/stress3.mp3?raw=1',
    duration: 480,
    category: 'stress',
    description: 'Медитация для обретения внутреннего покоя',
    oils: [{ name: 'Сандал', description: 'Успокаивающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/stress3.jpg',
    benefits: ['Покой', 'Спокойствие']
  },
  {
    id: 'stress4',
    name: 'Расслабление мышц',
    audio: 'https://www.dropbox.com/s/your-file-path/stress4.mp3?raw=1',
    duration: 660,
    category: 'stress',
    description: 'Медитация для расслабления мышц',
    oils: [{ name: 'Иланг-иланг', description: 'Расслабляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/stress4.jpg',
    benefits: ['Расслабление', 'Успокоение']
  },
  {
    id: 'stress5',
    name: 'Снятие напряжения',
    audio: 'https://www.dropbox.com/s/your-file-path/stress5.mp3?raw=1',
    duration: 900,
    category: 'stress',
    description: 'Медитация для снятия напряжения',
    oils: [{ name: 'Кедр', description: 'Заземляющий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/stress5.jpg',
    benefits: ['Снятие напряжения', 'Расслабление']
  },
  {
    id: 'stress6',
    name: 'Антистресс 2.0',
    audio: 'https://www.dropbox.com/s/your-file-path/stress6.mp3?raw=1',
    duration: 720,
    category: 'stress',
    description: 'Продвинутая медитация для борьбы со стрессом',
    oils: [{ name: 'Лаванда', description: 'Успокаивающий аромат', usage: '3 капли в диффузор' }],
    background: '/meditation-backgrounds/stress6.jpg',
    benefits: ['Спокойствие', 'Баланс']
  },
  {
    id: 'stress7',
    name: 'Защита от стресса',
    audio: 'https://www.dropbox.com/s/your-file-path/stress7.mp3?raw=1',
    duration: 600,
    category: 'stress',
    description: 'Медитация для создания защиты от стресса',
    oils: [{ name: 'Бергамот', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/stress7.jpg',
    benefits: ['Защита', 'Устойчивость']
  },
  {
    id: 'creativity1',
    name: 'Раскрытие творческого потенциала',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity1.mp3?raw=1',
    duration: 600,
    category: 'creativity',
    description: 'Медитация для раскрытия творческого потенциала',
    oils: [{ name: 'Бергамот', description: 'Вдохновляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/creativity1.jpg',
    benefits: ['Вдохновение', 'Креативность']
  },
  {
    id: 'creativity2',
    name: 'Поиск идей',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity2.mp3?raw=1',
    duration: 720,
    category: 'creativity',
    description: 'Медитация для поиска новых идей',
    oils: [{ name: 'Лимон', description: 'Освежающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/creativity2.jpg',
    benefits: ['Новые идеи', 'Вдохновение']
  },
  {
    id: 'creativity3',
    name: 'Творческий поток',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity3.mp3?raw=1',
    duration: 480,
    category: 'creativity',
    description: 'Медитация для поддержания творческого потока',
    oils: [{ name: 'Мята', description: 'Освежающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/creativity3.jpg',
    benefits: ['Творческий поток', 'Вдохновение']
  },
  {
    id: 'creativity4',
    name: 'Вдохновение',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity4.mp3?raw=1',
    duration: 660,
    category: 'creativity',
    description: 'Медитация для получения вдохновения',
    oils: [{ name: 'Розмарин', description: 'Стимулирующий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/creativity4.jpg',
    benefits: ['Вдохновение', 'Креативность']
  },
  {
    id: 'creativity5',
    name: 'Самовыражение',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity5.mp3?raw=1',
    duration: 900,
    category: 'creativity',
    description: 'Медитация для самовыражения',
    oils: [{ name: 'Эвкалипт', description: 'Стимулирующий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/creativity5.jpg',
    benefits: ['Самовыражение', 'Творчество']
  },
  {
    id: 'creativity6',
    name: 'Креативный прорыв',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity6.mp3?raw=1',
    duration: 720,
    category: 'creativity',
    description: 'Медитация для творческого прорыва',
    oils: [{ name: 'Бергамот', description: 'Вдохновляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/creativity6.jpg',
    benefits: ['Вдохновение', 'Прорыв']
  },
  {
    id: 'creativity7',
    name: 'Муза творчества',
    audio: 'https://www.dropbox.com/s/your-file-path/creativity7.mp3?raw=1',
    duration: 600,
    category: 'creativity',
    description: 'Медитация для привлечения музы',
    oils: [{ name: 'Жасмин', description: 'Творческий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/creativity7.jpg',
    benefits: ['Вдохновение', 'Творчество']
  },
  {
    id: 'confidence1',
    name: 'Уверенность в себе',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence1.mp3?raw=1',
    duration: 600,
    category: 'confidence',
    description: 'Медитация для повышения уверенности в себе',
    oils: [{ name: 'Грейпфрут', description: 'Тонизирующий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/confidence1.jpg',
    benefits: ['Уверенность', 'Самооценка']
  },
  {
    id: 'confidence2',
    name: 'Сила духа',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence2.mp3?raw=1',
    duration: 720,
    category: 'confidence',
    description: 'Медитация для укрепления силы духа',
    oils: [{ name: 'Черный перец', description: 'Стимулирующий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/confidence2.jpg',
    benefits: ['Сила', 'Уверенность']
  },
  {
    id: 'confidence3',
    name: 'Внутренняя сила',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence3.mp3?raw=1',
    duration: 480,
    category: 'confidence',
    description: 'Медитация для обретения внутренней силы',
    oils: [{ name: 'Имбирь', description: 'Согревающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/confidence3.jpg',
    benefits: ['Сила', 'Уверенность']
  },
  {
    id: 'confidence4',
    name: 'Самооценка',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence4.mp3?raw=1',
    duration: 660,
    category: 'confidence',
    description: 'Медитация для повышения самооценки',
    oils: [{ name: 'Пачули', description: 'Успокаивающий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/confidence4.jpg',
    benefits: ['Самооценка', 'Уверенность']
  },
  {
    id: 'confidence5',
    name: 'Успех',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence5.mp3?raw=1',
    duration: 900,
    category: 'confidence',
    description: 'Медитация для достижения успеха',
    oils: [{ name: 'Кедр', description: 'Заземляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/confidence5.jpg',
    benefits: ['Успех', 'Достижения']
  },
  {
    id: 'confidence6',
    name: 'Внутренний лидер',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence6.mp3?raw=1',
    duration: 720,
    category: 'confidence',
    description: 'Медитация для развития лидерских качеств',
    oils: [{ name: 'Кедр', description: 'Укрепляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/confidence6.jpg',
    benefits: ['Лидерство', 'Уверенность']
  },
  {
    id: 'confidence7',
    name: 'Харизма',
    audio: 'https://www.dropbox.com/s/your-file-path/confidence7.mp3?raw=1',
    duration: 600,
    category: 'confidence',
    description: 'Медитация для развития харизмы',
    oils: [{ name: 'Сандал', description: 'Укрепляющий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/confidence7.jpg',
    benefits: ['Харизма', 'Уверенность']
  },
  {
    id: 'gratitude1',
    name: 'Благодарность за жизнь',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude1.mp3?raw=1',
    duration: 600,
    category: 'gratitude',
    description: 'Медитация для благодарности за жизнь',
    oils: [{ name: 'Мандарин', description: 'Радостный аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/gratitude1.jpg',
    benefits: ['Благодарность', 'Радость']
  },
  {
    id: 'gratitude2',
    name: 'Цени каждый момент',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude2.mp3?raw=1',
    duration: 720,
    category: 'gratitude',
    description: 'Медитация для ценить каждый момент',
    oils: [{ name: 'Корица', description: 'Теплый аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/gratitude2.jpg',
    benefits: ['Благодарность', 'Радость']
  },
  {
    id: 'gratitude3',
    name: 'Радость бытия',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude3.mp3?raw=1',
    duration: 480,
    category: 'gratitude',
    description: 'Медитация для радости бытия',
    oils: [{ name: 'Апельсин', description: 'Радостный аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/gratitude3.jpg',
    benefits: ['Радость', 'Благодарность']
  },
  {
    id: 'gratitude4',
    name: 'Позитивное мышление',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude4.mp3?raw=1',
    duration: 660,
    category: 'gratitude',
    description: 'Медитация для позитивного мышления',
    oils: [{ name: 'Пачули', description: 'Успокаивающий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/gratitude4.jpg',
    benefits: ['Позитив', 'Благодарность']
  },
  {
    id: 'gratitude5',
    name: 'Благословение',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude5.mp3?raw=1',
    duration: 900,
    category: 'gratitude',
    description: 'Медитация для чувства благословения',
    oils: [{ name: 'Сандал', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/gratitude5.jpg',
    benefits: ['Благословение', 'Благодарность']
  },
  {
    id: 'gratitude6',
    name: 'Изобилие благодарности',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude6.mp3?raw=1',
    duration: 720,
    category: 'gratitude',
    description: 'Медитация для привлечения изобилия',
    oils: [{ name: 'Корица', description: 'Теплый аромат', usage: '1 капля в диффузор' }],
    background: '/meditation-backgrounds/gratitude6.jpg',
    benefits: ['Изобилие', 'Благодарность']
  },
  {
    id: 'gratitude7',
    name: 'Дары вселенной',
    audio: 'https://www.dropbox.com/s/your-file-path/gratitude7.mp3?raw=1',
    duration: 600,
    category: 'gratitude',
    description: 'Медитация благодарности вселенной',
    oils: [{ name: 'Ладан', description: 'Духовный аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/gratitude7.jpg',
    benefits: ['Благодарность', 'Духовность']
  },
  {
    id: 'healing1',
    name: 'Внутреннее исцеление',
    audio: 'https://www.dropbox.com/s/your-file-path/healing1.mp3?raw=1',
    duration: 600,
    category: 'healing',
    description: 'Медитация для внутреннего исцеления',
    oils: [{ name: 'Чайное дерево', description: 'Очищающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/healing1.jpg',
    benefits: ['Исцеление', 'Очищение']
  },
  {
    id: 'healing2',
    name: 'Гармония тела и души',
    audio: 'https://www.dropbox.com/s/your-file-path/healing2.mp3?raw=1',
    duration: 720,
    category: 'healing',
    description: 'Медитация для гармонии тела и души',
    oils: [{ name: 'Эвкалипт', description: 'Освежающий аромат', usage: '1 капля на запястье' }],
    background: '/meditation-backgrounds/healing2.jpg',
    benefits: ['Гармония', 'Исцеление']
  },
  {
    id: 'healing3',
    name: 'Восстановление',
    audio: 'https://www.dropbox.com/s/your-file-path/healing3.mp3?raw=1',
    duration: 480,
    category: 'healing',
    description: 'Медитация для восстановления сил',
    oils: [{ name: 'Лаванда', description: 'Успокаивающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/healing3.jpg',
    benefits: ['Восстановление', 'Исцеление']
  },
  {
    id: 'healing4',
    name: 'Очищение',
    audio: 'https://www.dropbox.com/s/your-file-path/healing4.mp3?raw=1',
    duration: 660,
    category: 'healing',
    description: 'Медитация для очищения организма',
    oils: [{ name: 'Розмарин', description: 'Стимулирующий аромат', usage: '1 капля на подушку' }],
    background: '/meditation-backgrounds/healing4.jpg',
    benefits: ['Очищение', 'Исцеление']
  },
  {
    id: 'healing5',
    name: 'Здоровье',
    audio: 'https://www.dropbox.com/s/your-file-path/healing5.mp3?raw=1',
    duration: 900,
    category: 'healing',
    description: 'Медитация для укрепления здоровья',
    oils: [{ name: 'Имбирь', description: 'Согревающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/healing5.jpg',
    benefits: ['Здоровье', 'Исцеление']
  },
  {
    id: 'healing6',
    name: 'Квантовое исцеление',
    audio: 'https://www.dropbox.com/s/your-file-path/healing6.mp3?raw=1',
    duration: 720,
    category: 'healing',
    description: 'Медитация для глубокого исцеления',
    oils: [{ name: 'Мирра', description: 'Целебный аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/healing6.jpg',
    benefits: ['Исцеление', 'Трансформация']
  },
  {
    id: 'healing7',
    name: 'Регенерация',
    audio: 'https://www.dropbox.com/s/your-file-path/healing7.mp3?raw=1',
    duration: 600,
    category: 'healing',
    description: 'Медитация для восстановления организма',
    oils: [{ name: 'Франкинценс', description: 'Восстанавливающий аромат', usage: '2 капли в диффузор' }],
    background: '/meditation-backgrounds/healing7.jpg',
    benefits: ['Регенерация', 'Исцеление']
  }
]

export default function AromaMeditation() {
  const [currentMeditation, setCurrentMeditation] = useState<Meditation>(meditations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timerDuration, setTimerDuration] = useState(10)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('player')
  const [meditationStats, setMeditationStats] = useState<{
    totalTime: number
    sessionsCompleted: number
    lastSession: string | null
  }>({
    totalTime: 0,
    sessionsCompleted: 0,
    lastSession: null
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    const handleAudioEnd = () => {
      setIsPlaying(false)
      updateStats()
    }

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', handleAudioEnd)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', handleAudioEnd)
    }
  }, [currentMeditation])

  useEffect(() => {
    // Загрузка избранного из localStorage
    const savedFavorites = localStorage.getItem('meditationFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Загрузка статистики из localStorage
    const savedStats = localStorage.getItem('meditationStats')
    if (savedStats) {
      setMeditationStats(JSON.parse(savedStats))
    }
  }, [])

  useEffect(() => {
    if (remainingTime === 0) {
      stopTimer()
      audioRef.current?.pause()
      setIsPlaying(false)
      toast.success('Медитация завершена!')
      updateStats()
    }
  }, [remainingTime])

  const updateStats = () => {
    const newStats = {
      totalTime: meditationStats.totalTime + currentMeditation.duration,
      sessionsCompleted: meditationStats.sessionsCompleted + 1,
      lastSession: new Date().toISOString()
    }
    setMeditationStats(newStats)
    localStorage.setItem('meditationStats', JSON.stringify(newStats))
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      stopTimer()
    } else {
      audioRef.current?.play()
      startTimer()
    }
    setIsPlaying(!isPlaying)
  }

  const startTimer = () => {
    if (!remainingTime) {
      setRemainingTime(timerDuration * 60)
    }
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => prev !== null ? prev - 1 : null)
    }, 1000)
  }

  const stopTimer = () => {
    if(timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      setIsPlaying(false)
      setCurrentTime(0)
      setRemainingTime(null)
      stopTimer()
    }
  }

  const changeMeditation = (meditation: Meditation) => {
    setCurrentMeditation(meditation)
    resetAudio()
  }

  const handleTimeChange = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0]
      setCurrentTime(newTime[0])
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0]
      setVolume(newVolume[0])
    }
  }

  const skipTrack = (direction: 'forward' | 'backward') => {
    const filteredMeditations = selectedCategory === 'all' 
      ? meditations 
      : meditations.filter(m => m.category === selectedCategory)
    
    const currentIndex = filteredMeditations.findIndex(m => m.id === currentMeditation.id)
    let newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1

    if (newIndex < 0) newIndex = filteredMeditations.length - 1
    if (newIndex >= filteredMeditations.length) newIndex = 0

    changeMeditation(filteredMeditations[newIndex])
  }

  const toggleFavorite = (meditationId: string) => {
    const newFavorites = favorites.includes(meditationId)
      ? favorites.filter(id => id !== meditationId)
      : [...favorites, meditationId]
    
    setFavorites(newFavorites)
    localStorage.setItem('meditationFavorites', JSON.stringify(newFavorites))
    
    toast.success(
      favorites.includes(meditationId)
        ? 'Удалено из избранного'
        : 'Добавлено в избранное'
    )
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const filteredMeditations = selectedCategory === 'all'
    ? meditations
    : meditations.filter(m => m.category === selectedCategory)

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
        <CardTitle className="text-2xl text-center">Медитация с ароматерапией</CardTitle>
        <CardDescription className="text-white/80 text-center">
          Погрузитесь в мир спокойствия и гармонии
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="player">Плеер</TabsTrigger>
            <TabsTrigger value="library">Библиотека</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-4">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${currentMeditation.background})`,
                  filter: 'blur(2px)'
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{currentMeditation.name}</h3>
                  <p className="text-white/80">{currentMeditation.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {currentMeditation.oils.map(oil => (
                    <Badge key={oil.name} variant="secondary" className="bg-white/20">
                      {oil.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Таймер медитации (минуты)</Label>
                  <Input
                    type="number"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-24"
                  />
                </div>
                {remainingTime !== null && (
                  <div className="text-2xl font-bold">
                    {formatTime(remainingTime)}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                  <Button onClick={() => skipTrack('backward')} className="bg-purple-500 hover:bg-purple-600">
                    <SkipBack className="h-6 w-6" />
                  </Button>
                  <Button onClick={togglePlay} className="bg-purple-500 hover:bg-purple-600">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button onClick={resetAudio} className="bg-pink-500 hover:bg-pink-600">
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                  <Button onClick={() => skipTrack('forward')} className="bg-purple-500 hover:bg-purple-600">
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                <audio ref={audioRef} src={currentMeditation.audio} onError={() => toast.error('Ошибка воспроизведения аудио')} />
                
                <div className="w-full flex items-center space-x-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleTimeChange}
                    className="flex-grow"
                  />
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>

                <div className="w-full flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-gray-500" />
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Рекомендации по использованию масел:</h4>
                {currentMeditation.oils.map(oil => (
                  <div key={oil.name} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium">{oil.name}</h5>
                    <p className="text-sm text-gray-600">{oil.description}</p>
                    <p className="text-sm text-gray-600 mt-1">{oil.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <div className="space-y-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mb-6">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <category.icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredMeditations.map((meditation) => (
                    <motion.div
                      key={meditation.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div 
                          className="h-40 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${meditation.background})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col h-full justify-end text-white">
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-white/90 uppercase tracking-wider">Преимущества</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {meditation.benefits.map((benefit, index) => (
                                      <span 
                                        key={index} 
                                        className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm"
                                      >
                                        {benefit}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-white/90 uppercase tracking-wider">Масла</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {meditation.oils.map((oil, index) => (
                                      <span 
                                        key={index} 
                                        className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm"
                                      >
                                        {oil.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base font-medium line-clamp-1">{meditation.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(meditation.id)}
                              className="hover:bg-pink-50 -mt-1 -mr-2"
                            >
                              <Star 
                                className={`h-4 w-4 ${
                                  favorites.includes(meditation.id) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge 
                              className={`${categories.find(c => c.id === meditation.category)?.color} 
                                        px-2 py-0.5 text-[10px]`}
                            >
                              {categories.find(c => c.id === meditation.category)?.name}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="px-2 py-0.5 text-[10px]"
                            >
                              {Math.floor(meditation.duration / 60)} мин
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{meditation.description}</p>
                          <Button 
                            onClick={() => {
                              changeMeditation(meditation)
                              setActiveTab('player')
                            }}
                            className="w-full h-8 text-sm bg-gradient-to-r from-purple-500 to-pink-500 
                                     hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                          >
                            Начать медитацию
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {meditations
                  .filter(meditation => favorites.includes(meditation.id))
                  .map((meditation) => (
                    <motion.div
                      key={meditation.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div 
                          className="h-40 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${meditation.background})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col h-full justify-end text-white">
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-white/90 uppercase tracking-wider">Преимущества</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {meditation.benefits.map((benefit, index) => (
                                      <span 
                                        key={index} 
                                        className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm"
                                      >
                                        {benefit}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-white/90 uppercase tracking-wider">Масла</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {meditation.oils.map((oil, index) => (
                                      <span 
                                        key={index} 
                                        className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm"
                                      >
                                        {oil.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base font-medium line-clamp-1">{meditation.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(meditation.id)}
                              className="hover:bg-pink-50 -mt-1 -mr-2"
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge 
                              className={`${categories.find(c => c.id === meditation.category)?.color} 
                                        px-2 py-0.5 text-[10px]`}
                            >
                              {categories.find(c => c.id === meditation.category)?.name}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="px-2 py-0.5 text-[10px]"
                            >
                              {Math.floor(meditation.duration / 60)} мин
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{meditation.description}</p>
                          <Button 
                            onClick={() => {
                              changeMeditation(meditation)
                              setActiveTab('player')
                            }}
                            className="w-full h-8 text-sm bg-gradient-to-r from-purple-500 to-pink-500 
                                     hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                          >
                            Начать медитацию
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                {favorites.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    У вас пока нет избранных медитаций
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Timer className="h-8 w-8 text-purple-500" />
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Общее время</p>
                        <p className="text-2xl font-bold">
                          {Math.floor(meditationStats.totalTime / 60)} мин
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Calendar className="h-8 w-8 text-purple-500" />
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Сессий завершено</p>
                        <p className="text-2xl font-bold">{meditationStats.sessionsCompleted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Star className="h-8 w-8 text-purple-500" />
                      <div className="text-right">
                        <p className="text-sm text-gray-500">В избранном</p>
                        <p className="text-2xl font-bold">{favorites.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {meditationStats.lastSession && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Последняя медитация</h3>
                    <p className="text-gray-600">
                      {new Date(meditationStats.lastSession).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Статистика по категориям</h3>
                  <div className="space-y-4">
                    {categories.map(category => {
                      const categoryMeditations = meditations.filter(m => m.category === category.id)
                      const completedInCategory = categoryMeditations.length
                      const progress = (completedInCategory / meditations.length) * 100

                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <category.icon className="h-4 w-4 mr-2" />
                              <span>{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {completedInCategory} медитаций
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

