'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowRight, Check, Sparkles, Star, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const router = useRouter()

  const plans = [
    {
      name: 'Базовый',
      description: 'Идеально для начинающих свой путь к гармонии',
      price: isAnnual ? '990' : '1490',
      period: isAnnual ? '/год' : '/месяц',
      discount: isAnnual ? 'Экономия 30%' : null,
      features: [
        'Персональные рекомендации по ароматерапии',
        'Базовые рецепты веганской кухни',
        'Ежедневные советы по велнесу',
        'Доступ к базе знаний',
        'Email поддержка',
      ],
      icon: Star,
      color: 'purple'
    },
    {
      name: 'Премиум',
      description: 'Расширенные возможности для достижения баланса',
      price: isAnnual ? '1990' : '2490',
      period: isAnnual ? '/год' : '/месяц',
      discount: isAnnual ? 'Экономия 35%' : null,
      features: [
        'Все функции Базового тарифа',
        'Расширенные AI-рекомендации',
        'Персональный план питания',
        'Видео-консультации',
        'Приоритетная поддержка 24/7',
        'Эксклюзивные мастер-классы',
      ],
      icon: Sparkles,
      color: 'pink',
      popular: true
    },
    {
      name: 'Бизнес',
      description: 'Комплексное решение для велнес-центров',
      price: isAnnual ? '4990' : '5990',
      period: isAnnual ? '/год' : '/месяц',
      discount: isAnnual ? 'Экономия 40%' : null,
      features: [
        'Все функции Премиум тарифа',
        'Мульти-аккаунт (до 10 пользователей)',
        'API интеграция',
        'Брендированный портал',
        'Аналитика и отчеты',
        'Персональный менеджер',
        'Обучение команды',
      ],
      icon: Zap,
      color: 'blue'
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium mb-4">
            <Star className="h-4 w-4 mr-2" />
            Тарифные планы
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Выберите свой план
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Гибкие тарифы для любых потребностей. Начните свой путь к гармонии сегодня
          </p>

          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Ежегодно
            </span>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Экономия до 40%
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border ${
                plan.popular ? 'border-purple-200 scale-105' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Популярный
                </div>
              )}
              
              <div className="p-8">
                <div className={`w-12 h-12 rounded-lg bg-${plan.color}-100 flex items-center justify-center mb-6`}>
                  <plan.icon className={`h-6 w-6 text-${plan.color}-600`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 mb-1">₽{plan.period}</span>
                  </div>
                  {plan.discount && (
                    <span className="text-sm text-green-600 font-medium">{plan.discount}</span>
                  )}
                </div>

                <Button
                  className={`w-full mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => router.push('/register')}
                >
                  Выбрать план
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full bg-${plan.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <Check className={`h-3 w-3 text-${plan.color}-600`} />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-gray-600">
            Все планы включают 14-дневный пробный период. Отмена подписки в любое время.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center text-sm text-gray-500">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Без скрытых платежей
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Безопасные платежи
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Поддержка 24/7
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-pink-100 rounded-full blur-3xl opacity-50" />
      </div>
    </section>
  )
}

