import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Droplet, ThumbsUp, AlertTriangle, Zap, Heart, Sun, Moon, Cloud, Leaf, Flower, TreesIcon as Tree } from 'lucide-react'

interface AromaCategory {
  name: string
  color: string
  icon: React.ReactNode
  oils: AromaOil[]
}

interface AromaOil {
  name: string
  properties: string[]
  benefits: string[]
  blendsWith: string[]
}

interface AromaWheelProps {
  mood: Record<string, number> | null
}

const aromaCategories: AromaCategory[] = [
  {
    name: 'Цитрусовые',
    color: 'from-amber-300 to-orange-400',
    icon: <Sun className="w-6 h-6" />,
    oils: [
      {
        name: 'Лимон',
        properties: ['Освежающий', 'Бодрящий', 'Очищающий'],
        benefits: ['Улучшает настроение', 'Повышает концентрацию', 'Поддерживает иммунитет'],
        blendsWith: ['Лаванда', 'Розмарин', 'Мята']
      },
      {
        name: 'Апельсин',
        properties: ['Сладкий', 'Теплый', 'Радостный'],
        benefits: ['Снимает стресс', 'Улучшает пищеварение', 'Поднимает настроение'],
        blendsWith: ['Корица', 'Гвоздика', 'Иланг-иланг']
      },
      {
        name: 'Грейпфрут',
        properties: ['Тонизирующий', 'Освежающий', 'Бодрящий'],
        benefits: ['Способствует похудению', 'Улучшает кровообращение', 'Повышает энергию'],
        blendsWith: ['Бергамот', 'Кипарис', 'Розмарин']
      },
    ]
  },
  {
    name: 'Травяные',
    color: 'from-emerald-300 to-green-500',
    icon: <Leaf className="w-6 h-6" />,
    oils: [
      {
        name: 'Розмарин',
        properties: ['Свежий', 'Травянистый', 'Бодрящий'],
        benefits: ['Улучшает память', 'Снимает мышечное напряжение', 'Стимулирует кровообращение'],
        blendsWith: ['Лаванда', 'Мята', 'Базилик']
      },
      {
        name: 'Базилик',
        properties: ['Пряный', 'Свежий', 'Теплый'],
        benefits: ['Снимает головную боль', 'Улучшает концентрацию', 'Поддерживает нервную систему'],
        blendsWith: ['Лимон', 'Розмарин', 'Лаванда']
      },
      {
        name: 'Эвкалипт',
        properties: ['Освежающий', 'Прохладный', 'Очищающий'],
        benefits: ['Облегчает дыхание', 'Снимает мышечную боль', 'Повышает иммунитет'],
        blendsWith: ['Мята', 'Лимон', 'Чайное дерево']
      },
    ]
  },
  {
    name: 'Цветочные',
    color: 'from-pink-300 to-fuchsia-400',
    icon: <Flower className="w-6 h-6" />,
    oils: [
      {
        name: 'Лаванда',
        properties: ['Успокаивающий', 'Расслабляющий', 'Балансирующий'],
        benefits: ['Улучшает сон', 'Снимает стресс', 'Ухаживает за кожей'],
        blendsWith: ['Лимон', 'Розмарин', 'Мята']
      },
      {
        name: 'Иланг-иланг',
        properties: ['Сладкий', 'Экзотический', 'Чувственный'],
        benefits: ['Снимает напряжение', 'Улучшает настроение', 'Поддерживает здоровье кожи'],
        blendsWith: ['Бергамот', 'Жасмин', 'Сандаловое дерево']
      },
      {
        name: 'Жасмин',
        properties: ['Сладкий', 'Экзотический', 'Романтичный'],
        benefits: ['Повышает уверенность', 'Улучшает настроение', 'Афродизиак'],
        blendsWith: ['Роза', 'Бергамот', 'Сандаловое дерево']
      },
    ]
  },
  {
    name: 'Древесные',
    color: 'from-amber-600 to-yellow-700',
    icon: <Tree className="w-6 h-6" />,
    oils: [
      {
        name: 'Сандал',
        properties: ['Теплый', 'Древесный', 'Заземляющий'],
        benefits: ['Успокаивает ум', 'Поддерживает медитацию', 'Ухаживает за кожей'],
        blendsWith: ['Лаванда', 'Роза', 'Ветивер']
      },
      {
        name: 'Кедр',
        properties: ['Свежий', 'Древесный', 'Бальзамический'],
        benefits: ['Укрепляет дыхательную систему', 'Отпугивает насекомых', 'Успокаивает кожу'],
        blendsWith: ['Бергамот', 'Можжевельник', 'Розмарин']
      },
      {
        name: 'Пачули',
        properties: ['Землистый', 'Мускусный', 'Экзотический'],
        benefits: ['Заземляет эмоции', 'Ухаживает за кожей', 'Отпугивает насекомых'],
        blendsWith: ['Лаванда', 'Бергамот', 'Иланг-иланг']
      },
    ]
  },
  {
    name: 'Пряные',
    color: 'from-red-400 to-rose-600',
    icon: <Zap className="w-6 h-6" />,
    oils: [
      {
        name: 'Корица',
        properties: ['Теплый', 'Пряный', 'Сладкий'],
        benefits: ['Улучшает кровообращение', 'Повышает концентрацию', 'Поддерживает иммунитет'],
        blendsWith: ['Апельсин', 'Гвоздика', 'Ваниль']
      },
      {
        name: 'Имбирь',
        properties: ['Теплый', 'Пряный', 'Острый'],
        benefits: ['Улучшает пищеварение', 'Снимает мышечную боль', 'Повышает энергию'],
        blendsWith: ['Лимон', 'Бергамот', 'Эвкалипт']
      },
      {
        name: 'Кардамон',
        properties: ['Теплый', 'Пряный', 'Освежающий'],
        benefits: ['Улучшает пищеварение', 'Поднимает настроение', 'Афродизиак'],
        blendsWith: ['Корица', 'Апельсин', 'Роза']
      },
    ]
  },
  {
    name: 'Мятные',
    color: 'from-teal-300 to-cyan-500',
    icon: <Cloud className="w-6 h-6" />,
    oils: [
      {
        name: 'Мята',
        properties: ['Охлаждающий', 'Освежающий', 'Бодрящий'],
        benefits: ['Облегчает дыхание', 'Снимает головную боль', 'Повышает концентрацию'],
        blendsWith: ['Лаванда', 'Лимон', 'Эвкалипт']
      },
      {
        name: 'Мелисса',
        properties: ['Свежий', 'Травянистый', 'Цитрусовый'],
        benefits: ['Успокаивает нервную систему', 'Улучшает сон', 'Поднимает настроение'],
        blendsWith: ['Лаванда', 'Бергамот', 'Иланг-иланг']
      },
      {
        name: 'Шалфей',
        properties: ['Травянистый', 'Пряный', 'Свежий'],
        benefits: ['Улучшает память', 'Облегчает менопаузу', 'Поддерживает гормональный баланс'],
        blendsWith: ['Лаванда', 'Розмарин', 'Бергамот']
      },
    ]
  },
]

export function AromaWheel({ mood }: AromaWheelProps) {
  const [selectedOil, setSelectedOil] = useState<AromaOil | null>(null)
  const [aiRecommendation, setAiRecommendation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOilClick = async (oil: AromaOil) => {
    setSelectedOil(oil)
    setAiRecommendation(null)
    setIsLoading(true)

    if (mood) {
      try {
        const response = await fetch('/api/aroma-recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mood, oilName: oil.name }),
        })
        const data = await response.json()
        setAiRecommendation(data)
      } catch (error) {
        console.error('Error fetching AI recommendation:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[600px]">
        <defs>
          {aromaCategories.map((category, index) => (
            <radialGradient key={`gradient-${index}`} id={`gradient-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" className={`stop-color-${category.color.split(' ')[0]}`} />
              <stop offset="100%" className={`stop-color-${category.color.split(' ')[1]}`} />
            </radialGradient>
          ))}
        </defs>
        {aromaCategories.map((category, index) => {
          const angle = (index / aromaCategories.length) * Math.PI * 2 - Math.PI / 2
          const x = Math.cos(angle) * 150 + 200
          const y = Math.sin(angle) * 150 + 200

          return (
            <g key={category.name}>
              <motion.path
                d={`M 200 200 L ${x} ${y} A 150 150 0 0 1 ${
                  Math.cos((index + 1) / aromaCategories.length * Math.PI * 2 - Math.PI / 2) * 150 + 200
                } ${
                  Math.sin((index + 1) / aromaCategories.length * Math.PI * 2 - Math.PI / 2) * 150 + 200
                } Z`}
                fill={`url(#gradient-${index})`}
                stroke="#fff"
                strokeWidth="2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <foreignObject
                x={Math.cos(angle + Math.PI / aromaCategories.length) * 100 + 200 - 30}
                y={Math.sin(angle + Math.PI / aromaCategories.length) * 100 + 200 - 30}
                width="60"
                height="60"
              >
                <div className="flex items-center justify-center w-full h-full">
                  {React.cloneElement(category.icon, { className: "w-8 h-8 text-white drop-shadow-lg" })}
                </div>
              </foreignObject>
              <text
                x={Math.cos(angle + Math.PI / aromaCategories.length) * 100 + 200}
                y={Math.sin(angle + Math.PI / aromaCategories.length) * 100 + 200 + 25}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
                className="drop-shadow-md"
              >
                {category.name}
              </text>
              {category.oils.map((oil, oilIndex) => {
                const oilAngle = angle + (oilIndex + 0.5) / category.oils.length * (Math.PI * 2 / aromaCategories.length)
                const oilX = Math.cos(oilAngle) * 180 + 200
                const oilY = Math.sin(oilAngle) * 180 + 200

                return (
                  <motion.g key={oil.name} whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    <circle
                      cx={oilX}
                      cy={oilY}
                      r="15"
                      fill="#fff"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="2"
                      onClick={() => handleOilClick(oil)}
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={oilX}
                      y={oilY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontWeight="bold"
                      fill={`url(#gradient-${index})`}
                      onClick={() => handleOilClick(oil)}
                      style={{ cursor: 'pointer' }}
                    >
                      {oil.name.slice(0, 2)}
                    </text>
                  </motion.g>
                )
              })}
            </g>
          )
        })}
      </svg>
      <Dialog open={!!selectedOil} onOpenChange={() => setSelectedOil(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">{selectedOil?.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <Droplet className="w-5 h-5 mr-2 text-blue-500" />
                  Свойства:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedOil?.properties.map((prop, index) => (
                    <li key={index} className="text-gray-700">{prop}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
                  Преимущества:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedOil?.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Хорошо сочетается с:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedOil?.blendsWith.map((oil, index) => (
                    <li key={index} className="text-gray-700">{oil}</li>
                  ))}
                </ul>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg">Получение рекомендации...</span>
                </div>
              ) : aiRecommendation ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Персонализированная рекомендация:
                  </h4>
                  <p className="text-gray-700 mb-2">{aiRecommendation.recommendation}</p>
                  <p className="text-gray-700 mb-2"><strong>Совет по смешиванию:</strong> {aiRecommendation.blendSuggestion}</p>
                  {aiRecommendation.cautionaryNote && (
                    <p className="text-yellow-600 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <strong>Примечание:</strong> {aiRecommendation.cautionaryNote}
                    </p>
                  )}
                </div>
              ) : mood ? (
                <Button onClick={() => handleOilClick(selectedOil!)} className="w-full">
                  Получить персонализированную рекомендацию
                </Button>
              ) : (
                <p className="text-yellow-600 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Для получения персонализированной рекомендации, пожалуйста, сначала оцените свое настроение.
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

