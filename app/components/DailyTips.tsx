'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, RefreshCw } from 'lucide-react'

const tips = [
  "Попробуйте добавить несколько капель лавандового масла в диффузор перед сном для лучшего отдыха.",
  "Включите в свой рацион больше зеленых листовых овощей для повышения энергии.",
  "Используйте масло мяты перечной для повышения концентрации во время работы.",
  "Приготовьте смузи из шпината, банана и миндального молока для заряда витаминами.",
  "Добавьте несколько капель масла чайного дерева в шампунь для здоровья кожи головы.",
  "Попробуйте веганский рецепт чечевичного супа для уютного и питательного обеда.",
  "Используйте масло эвкалипта в паровой бане для облегчения дыхания.",
  "Приготовьте веганские энергетические шарики из фиников и орехов для перекуса.",
  "Добавьте масло розмарина в лосьон для тела для тонизирующего эффекта.",
  "Экспериментируйте с веганскими заменителями в любимых рецептах, например, используйте аквафабу вместо яиц.",
  "Практикуйте медитацию с использованием масла ладана для глубокой релаксации.",
  "Попробуйте веганский боул с киноа, авокадо и овощами для сбалансированного обеда.",
  "Используйте масло бергамота в аромалампе для поднятия настроения.",
  "Добавьте семена чиа в свой утренний смузи для дополнительной энергии.",
  "Попробуйте йогу с использованием масла иланг-иланг для расслабления и гармонизации.",
  "Приготовьте веганские блинчики из банана и овсянки на завтрак.",
  "Используйте масло грейпфрута для бодрящего массажа по утрам.",
  "Экспериментируйте с веганскими десертами, используя кокосовые сливки вместо молочных.",
  "Добавьте масло лимона в воду для естественной детоксикации организма.",
  "Попробуйте веганский пад-тай с тофу для разнообразия в меню."
]

export default function DailyTips() {
  const [currentTip, setCurrentTip] = useState('')

  useEffect(() => {
    getRandomTip()
  }, [])

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <Lightbulb className="mr-2" />
          Совет дня
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          key={currentTip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          {currentTip}
        </motion.p>
        <div className="flex justify-center">
          <Button onClick={getRandomTip} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Новый совет
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

