'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Leaf, 
  Brain, 
  Heart, 
  Moon, 
  Sun, 
  Wind, 
  Droplet,
  Sparkles
} from 'lucide-react'

const benefits = [
  {
    icon: Brain,
    title: 'Ментальное здоровье',
    description: 'Улучшает концентрацию, память и когнитивные функции',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    icon: Heart,
    title: 'Эмоциональный баланс',
    description: 'Помогает управлять стрессом и стабилизировать настроение',
    color: 'from-pink-400 to-rose-500'
  },
  {
    icon: Leaf,
    title: 'Природная сила',
    description: 'Использует целебные свойства натуральных эфирных масел',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: Moon,
    title: 'Качество сна',
    description: 'Способствует глубокому и восстанавливающему сну',
    color: 'from-purple-400 to-violet-500'
  },
  {
    icon: Wind,
    title: 'Чистый воздух',
    description: 'Очищает воздух и создает приятную атмосферу',
    color: 'from-cyan-400 to-teal-500'
  },
  {
    icon: Sun,
    title: 'Энергия и бодрость',
    description: 'Повышает жизненный тонус и работоспособность',
    color: 'from-yellow-400 to-amber-500'
  }
]

export default function AromaTherapySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 text-transparent bg-clip-text">
              Ароматерапия
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Древнее искусство использования эфирных масел для улучшения физического,
              эмоционального и духовного благополучия
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.color}`}>
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  <div className="absolute -right-6 -bottom-6 opacity-10">
                    <benefit.icon className="h-24 w-24" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-8 max-w-3xl mx-auto">
            <CardContent className="space-y-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Начните свой путь к гармонии</h3>
              <p className="text-lg opacity-90">
                Откройте для себя силу ароматерапии с нашим умным подбором масел и рецептов,
                основанным на ваших индивидуальных потребностях и целях
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Droplet className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h4 className="text-xl font-semibold mb-2">100% натуральные масла</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Мы используем только чистые эфирные масла высшего качества
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Brain className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h4 className="text-xl font-semibold mb-2">Научный подход</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Рекомендации основаны на исследованиях и опыте экспертов
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Heart className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h4 className="text-xl font-semibold mb-2">Индивидуальный подход</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Персонализированные рецепты с учетом ваших потребностей
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 