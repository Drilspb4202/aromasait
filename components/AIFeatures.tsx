import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Utensils, Droplet, TrendingUp } from 'lucide-react'

const aiFeatures = [
  {
    title: "Умный анализ настроения",
    description: "AI анализирует ваше эмоциональное состояние и предлагает персонализированные рекомендации",
    icon: Brain
  },
  {
    title: "Персонализированные рецепты",
    description: "AI создает веганские рецепты, учитывая ваше настроение и предпочтения",
    icon: Utensils
  },
  {
    title: "Умный подбор масел",
    description: "AI рекомендует оптимальные комбинации эфирных масел",
    icon: Droplet
  },
  {
    title: "Прогнозирование состояния",
    description: "AI анализирует тренды и помогает предупреждать негативные состояния",
    icon: TrendingUp
  }
]

export default function AIFeatures() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Преимущества AI</h2>
          <p className="text-gray-600">
            Наш искусственный интеллект работает для вашего благополучия
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <feature.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold ml-3">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

