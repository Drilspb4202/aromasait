'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { default as NextImage } from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { ArrowRight, Droplet, Leaf, Heart, Zap, Star, ChevronRight, Check, Menu, X, Smartphone, Cloud, Smile } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const Image = (props) => (
  <NextImage
    {...props}
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  />
)

export default function LandingPage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState('')
  const [email, setEmail] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  const features = [
    { icon: Droplet, title: 'Ароматерапия', description: 'Откройте силу эфирных масел для улучшения вашего самочувствия' },
    { icon: Leaf, title: 'Веганство', description: 'Питание на растительной основе для здоровья и этичного образа жизни' },
    { icon: Heart, title: 'Благополучие', description: 'Улучшите свое физическое и ментальное здоровье с нашими рекомендациями' },
    { icon: Zap, title: 'Энергия', description: 'Повысьте свою жизненную энергию с помощью натуральных методов' },
  ]

  const testimonials = [
    { name: 'Анна С.', text: 'Это приложение изменило мою жизнь! Я чувствую себя более энергичной и счастливой.', avatar: '/placeholder.svg?height=60&width=60' },
    { name: 'Михаил Д.', text: 'Рекомендации по ароматерапии действительно помогают мне справляться со стрессом.', avatar: '/placeholder.svg?height=60&width=60' },
    { name: 'Елена В.', text: 'Веганские рецепты просто потрясающие. Я даже не знала, что здоровая еда может быть такой вкусной!', avatar: '/placeholder.svg?height=60&width=60' },
  ]

  const faqItems = [
    { question: 'Что такое ароматерапия?', answer: 'Ароматерапия - это использование эфирных масел растений для улучшения физического и эмоционального благополучия.' },
    { question: 'Как начать веганский образ жизни?', answer: 'Начните с постепенной замены животных продуктов растительными альтернативами. Наше приложение предоставит вам рекомендации и рецепты.' },
    { question: 'Нужно ли мне специальное оборудование для ароматерапии?', answer: 'Нет, вы можете начать с простого диффузора или даже с нанесения разбавленных масел на кожу. Наше приложение подскажет, как безопасно использовать эфирные масла.' },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика подписки на рассылку
    console.log('Subscribed:', email)
    setEmail('')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const FeatureCard = ({ feature, index }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card 
          className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
        >
          <CardContent className="flex flex-col items-center p-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <feature.icon className="h-12 w-12 text-teal-500 mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-center text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <nav aria-label="Основная навигация" className="bg-white/80 backdrop-blur-md shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">АВБ</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                О нас
              </motion.button>
              <motion.button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Услуги
              </motion.button>
              <motion.button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Контакты
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => router.push('/login')} variant="ghost">
                  Войти
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => router.push('/register')} variant="default">
                  Регистрация
                </Button>
              </motion.div>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label="Открыть меню">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="menu"
            aria-labelledby="mobile-menu-button"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg rounded-b-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">О нас</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Услуги</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Контакты</a>
              <Button onClick={() => router.push('/login')} variant="ghost" className="w-full justify-start">
                Войти
              </Button>
              <Button onClick={() => router.push('/register')} variant="default" className="w-full">
                Регистрация
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-400 to-teal-500 text-white py-20 overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: smoothY }}
          >
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </motion.div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Арома и Веган-Баланс
              </motion.h1>
              <motion.p 
                className="text-xl mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Откройте для себя гармонию через ароматерапию и веганское питание
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button onClick={() => router.push('/register')} size="lg" className="bg-white text-teal-600 hover:bg-teal-100 transform hover:scale-105 transition duration-300">
                  Начать путешествие <ChevronRight className="ml-2" />
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Ароматерапия и веганство"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-center text-teal-800 mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Наши преимущества
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-center text-teal-800 mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Как это работает
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Smartphone, title: 'Установите приложение', description: 'Скачайте наше приложение из App Store или Google Play' },
                { icon: Cloud, title: 'Получайте рекомендации', description: 'Наш ИИ анализирует ваши предпочтения и дает персонализированные советы' },
                { icon: Smile, title: 'Наслаждайтесь результатами', description: 'Следуйте рекомендациям и ощутите положительные изменения' }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-teal-100 rounded-full p-4 mb-4">
                    <step.icon className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">Что говорят наши пользователи</h2>
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: `-${currentTestimonial * 100}%` }}
                  transition={{ duration: 0.5 }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.name} className="w-full flex-shrink-0">
                      <Card className="mx-auto max-w-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={60}
                              height={60}
                              className="rounded-full mr-4"
                            />
                            <div>
                              <p className="font-semibold">{testimonial.name}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className="flex justify-center mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full mx-1 ${
                      currentTestimonial === index ? 'bg-teal-600' : 'bg-teal-200'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">Часто задаваемые вопросы</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-teal-600 text-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Готовы начать свой путь к гармонии?</h2>
            <p className="text-xl mb-8">Присоединяйтесь к нам сегодня и откройте для себя мир ароматерапии и веганского образа жизни.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => router.push('/register')} size="lg" className="bg-white text-teal-600 hover:bg-teal-100">
                Зарегистрироваться бесплатно <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-green-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-teal-800 mb-4">Подпишитесь на наши новости</h2>
            <p className="text-xl text-gray-600 mb-8">Получайте последние советы по ароматерапии и веганским рецептам прямо на вашу почту.</p>
            <form onSubmit={handleSubscribe} aria-labelledby="newsletter-heading" className="flex flex-col sm:flex-row justify-center items-center">
              <h2 id="newsletter-heading" className="sr-only">Подписка на новости</h2>
              <Input
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Подписаться <Check className="ml-2" />
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-teal-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">О нас</h3>
              <p className="text-teal-200">Арома и Веган-Баланс - ваш путеводитель в мире ароматерапии и веганского образа жизни.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-200 hover:text-white transition duration-300">Главная</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition duration-300">О нас</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition duration-300">Блог</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white transition duration-300">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Свяжитесь с нами</h3>
              <p className="text-teal-200">Email: info@aromavegan.com</p>
              <p className="text-teal-200">Телефон: +7 (999) 123-45-67</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-700 text-center">
            <p>&copy; 2023 Арома и Веган-Баланс. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

