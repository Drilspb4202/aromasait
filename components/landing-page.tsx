'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CalendarIcon, Leaf, Heart, Droplet, Star, Users, BookOpen, Brain, ArrowRight, Smile, BarChart2, Clock, Utensils, Feather, Bot, TrendingUp, Award, ClipboardList, Menu, X, Sparkles, Zap, Target, Check, Shield, Activity, Lock, Smartphone, Maximize2, ArrowUp } from 'lucide-react'
import BlogPreview from './BlogPreview'
import Testimonials from './Testimonials'
import ReviewForm from './ReviewForm'
import { useAuth } from '@/components/AuthProvider'
import ProfileMenu from '@/components/ProfileMenu'
import UserProfile from '@/components/UserProfile'
import AIFeatures from './AIFeatures'
import PricingSection from './PricingSection'
import { cn } from '@/lib/utils'

// Update the button styles
const buttonBaseStyles = "relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
const buttonPrimaryStyles = `${buttonBaseStyles} bg-gradient-to-r from-[#FF3366] to-[#4C35DE] hover:from-[#FF4D7F] hover:to-[#5842FF] text-white shadow-xl shadow-[#FF3366]/20 hover:shadow-2xl hover:shadow-[#4C35DE]/30`
const buttonSecondaryStyles = `${buttonBaseStyles} bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20`

// Update card styles
const cardBaseStyles = "relative overflow-hidden backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-2"
const cardPrimaryStyles = `${cardBaseStyles} bg-white/5 border border-white/10 hover:border-white/20 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-[#FF3366]/20`

// Update the navigation styles
const navLinkStyles = "relative text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#FF3366] after:to-[#4C35DE] hover:after:w-full after:transition-all after:duration-300"

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const countRef = useRef(null)
  const isCountInView = useInView(countRef)
  const [userCount, setUserCount] = useState(0)
  const { user } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const handleLogin = () => {
    router.push('/login')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика подписки на рассылку
    console.log('Subscribed:', email)
    setEmail('')
  }

  useEffect(() => {
    if (isCountInView) {
      const interval = setInterval(() => {
        setUserCount(prev => {
          const next = prev + Math.floor(Math.random() * 10)
          return next > 10000 ? 10000 : next
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isCountInView])

  const features = [
    { 
      icon: Brain, 
      title: "AI-анализ состояния", 
      description: "Передовые алгоритмы ИИ анализируют ваше эмоциональное и физическое состояние в реальном времени" 
    },
    { 
      icon: Sparkles, 
      title: "Персонализированные рекомендации", 
      description: "ИИ создает уникальные комбинации ароматерапии и веганского питания, идеально подходящие именно вам" 
    },
    { 
      icon: TrendingUp, 
      title: "Адаптивное обучение", 
      description: "Наша система постоянно учится и адаптируется к вашим потребностям, улучшая рекомендации с каждым использованием" 
    },
    { 
      icon: Zap, 
      title: "Мгновенная корректировка", 
      description: "ИИ мгновенно реагирует на изменения вашего состояния, предлагая своевременные решения" 
    },
    { 
      icon: Shield, 
      title: "Превентивное благополучие", 
      description: "Алгоритмы прогнозирования помогают предотвратить дисбаланс еще до его появления" 
    },
    { 
      icon: Droplet, 
      title: "Умный подбор ароматов", 
      description: "ИИ анализирует тысячи комбинаций эфирных масел для создания идеального аромата под ваше состояние" 
    },
    { 
      icon: Utensils, 
      title: "AI-оптимизированные рецепты", 
      description: "Каждый рецепт создается с учетом ваших потребностей, предпочтений и текущего состояния" 
    },
    { 
      icon: Activity, 
      title: "Динамическое отслеживание прогресса", 
      description: "ИИ визуализирует ваш прогресс и автоматически корректирует план для достижения оптимальных результатов" 
    },
    { 
      icon: Users, 
      title: "Коллективный интеллект", 
      description: "Наш ИИ учится на опыте всего сообщества, постоянно улучшая рекомендации для каждого пользователя" 
    },
    { 
      icon: Lock, 
      title: "Безопасность и конфиденциальность", 
      description: "Передовые алгоритмы шифрования и анонимизации данных обеспечивают полную защиту вашей личной информации" 
    }
  ]

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

  const faqItems = [
    {
      question: "Что такое Арома и Веган-Баланс?",
      answer: "Арома и Веган-Баланс - это инновационная платформа, использующая передовые технологии искусственного интеллекта для создания персонализированных рекомендаций по ароматерапии и веганскому питанию, направленных на достижение оптимального баланса тела и разума."
    },
    {
      question: "Как работает ИИ в вашей системе?",
      answer: "Наш ИИ анализирует ваши данные о настроении, физическом состоянии и предпочтениях, используя сложные алгоритмы машинного обучения. На основе этого анализа он создает уникальные рекомендации по ароматерапии и питанию, которые постоянно адаптируются и улучшаются с каждым использованием."
    },
    {
      question: "Насколько безопасно использование ИИ для анализа моих данных?",
      answer: "Безопасность и конфиденциальность - наш главный приоритет. Мы используем передовые методы шифрования и анонимизации данных. ИИ работает с обезличенной информацией, а все персональные данные хранятся в соответствии с самыми строгими стандартами безопасности."
    },
    {
      question: "Могу ли я использовать Арома и Веган-Баланс, если я не веган?",
      answer: "Абсолютно! Хотя наша платформа специализируется на веганских рецептах, ИИ адаптирует рекомендации под ваши индивидуальные потребности и предпочтения. Вы можете использовать систему для улучшения своего рациона и общего благополучия, независимо от вашего текущего типа питания."
    }
  ]

  const pricingPlans = [
    {
      name: "Базовый",
      price: "Бесплатно",
      features: [
        "Ежедневная оценка настроения",
        "Базовые рекомендации по ароматерапии",
        "5 веганских рецептов в неделю",
        "Доступ к сообществу"
      ],
      recommended: false
    },
    {
      name: "Премиум",
      price: "499 ₽/мес",
      features: [
        "Все функции Базового плана",
        "Неограниченные AI-рекомендации",
        "Персонализированные планы питания",
        "Эксклюзивные медитации с ароматерапией",
        "Приоритетная поддержка"
      ],
      recommended: true
    }
  ]

  const appScreenshots = [
    { src: "https://i.ibb.co/X5nQmhX/image-fx-8.png", alt: "Скриншот 1" },
    { src: "https://i.ibb.co/BPsPWBY/image-fx-9.png", alt: "Скриншот 2" },
    { src: "https://i.ibb.co/twGyykN/image-fx-10.png", alt: "Скриншот 3" },
    { src: "https://i.ibb.co/9HSzfXm/image-fx-11.png", alt: "Скриншот 4" },
    { src: "https://i.ibb.co/dJbCd7J/image-fx-12.png", alt: "Скриншот 5" },
    { src: "https://i.ibb.co/QYSxwBk/image-fx-13.png", alt: "Скриншот 6" },
  ];

  const testimonials = [
    { 
      name: "Анна С.", 
      text: "Технология ИИ в Арома и Веган-Балансе просто поразительна! Она точно определяет мои потребности и предлагает идеальные решения.", 
      avatar: "/placeholder.svg?height=60&width=60" 
    },
    { 
      name: "Михаил Д.", 
      text: "Я скептически относился к ИИ, но эта платформа действительно работает. Мое самочувствие значительно улучшилось благодаря персонализированным рекомендациям.", 
      avatar: "/placeholder.svg?height=60&width=60" 
    },
    { 
      name: "Елена В.", 
      text: "Удивительно, насколько точно ИИ подбирает ароматы и рецепты. Это действительно революция в заботе о себе!", 
      avatar: "/placeholder.svg?height=60&width=60" 
    },
  ]

  const renderAIExplanationSection = () => (
    <section className="py-24 relative overflow-hidden bg-[#0D0D0F]">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"
        />
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/10 shadow-xl mb-4"
          >
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Brain className="h-4 w-4 mr-2 text-[#FF3366]" />
            </motion.div>
            Преимущества AI
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
            Преимущества использования AI
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Откройте для себя уникальные возможности, которые предоставляет наш AI
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI анализирует ваши индивидуальные особенности",
              description: "AI анализирует ваши индивидуальные особенности и предпочтения для создания уникальных рекомендаций"
            },
            {
              icon: Zap,
              title: "Эффективные решения",
              description: "Благодаря AI вы получаете наиболее эффективные решения для достижения баланса и гармонии"
            },
            {
              icon: Clock,
              title: "Мгновенная обработка",
              description: "AI мгновенно обрабатывает данные и предоставляет рекомендации, экономя ваше время"
            },
            {
              icon: TrendingUp,
              title: "Постоянное улучшение",
              description: "Наш AI постоянно учится и адаптируется, улучшая качество рекомендаций с каждым использованием"
            },
            {
              icon: Shield,
              title: "Профилактика проблем",
              description: "AI помогает предотвратить потенциальные проблемы, анализируя тенденции вашего состояния"
            },
            {
              icon: Sparkles,
              title: "Инновационные решения",
              description: "AI предлагает нестандартные и эффективные решения, основанные на последних научных данных"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`${cardPrimaryStyles} group`}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="relative w-14 h-14 mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-xl"
                  />
                  <div className="absolute inset-0.5 bg-[#0D0D0F] rounded-lg" />
                  <item.icon className="absolute inset-0 m-auto h-7 w-7 text-white" />
          </div>
                
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-[#FF3366] transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-white/70 group-hover:text-white/90 transition-colors flex-grow">
                  {item.description}
                </p>
                
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="mt-6 h-0.5 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] opacity-0 group-hover:opacity-100 transition-opacity"
                />
          </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )

  const navLinks = [
    { href: "#features", label: "Возможности" },
    { href: "#how-it-works", label: "Как это работает" },
    { href: "#pricing", label: "Тарифы" },
    { href: "#testimonials", label: "Отзывы" },
  ]

  const renderHowItWorksSection = () => (
    <section id="how-it-works" className="py-32 bg-gradient-to-b from-white via-purple-50/50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.1),transparent_70%)]"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium shadow-lg shadow-purple-100 mb-4"
          >
            <Clock className="h-4 w-4 mr-2" />
            Простой путь к гармонии
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Как это работает
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Четыре простых шага на пути к гармонии тела и души с использованием искусственного интеллекта
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
            {[
              {
                icon: Brain,
                title: "AI-анализ состояния",
                description: "Искусственный интеллект анализирует ваше эмоциональное и физическое состояние в реальном времени",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Zap,
                title: "Обработка данных",
                description: "Продвинутые алгоритмы обрабатывают информацию и формируют персональные рекомендации",
                gradient: "from-pink-500 to-purple-500"
              },
              {
                icon: Sparkles,
                title: "Рекомендации",
                description: "Получите индивидуальный план по ароматерапии и веганскому питанию, основанный на ваших потребностях",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Улучшение",
                description: "Система непрерывно учится и адаптируется, делая рекомендации все более точными и эффективными",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100 h-full hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <step.icon className="h-8 w-8 text-white" />
          </div>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="absolute -top-px left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  
                  <div className="absolute -top-4 left-8 bg-white px-4 py-1 rounded-full border border-purple-100 text-sm font-medium text-purple-600 shadow-sm">
                    Шаг {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {step.description}
                  </p>
                  
                  <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" />
          </div>

                {/* Removing the numbered circles */}
                {/* <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-lg font-bold shadow-lg"
                  >
                    {index + 1}
                  </motion.div>
                </div> */}
              </motion.div>
            ))}
        </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 transform hover:-translate-y-1"
            onClick={handleDashboard}
          >
            Начать сейчас
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  )

  // Safe window access with useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const sections = ['hero', 'features', 'how-it-works', 'testimonials', 'pricing', 'faq']
        const scrollPosition = window.scrollY + window.innerHeight / 2

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const { top, bottom } = element.getBoundingClientRect()
            if (top <= scrollPosition && bottom >= scrollPosition) {
              setActiveSection(section)
              break
            }
          }
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Update particles animation
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newParticles = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * (window?.innerWidth || 1000),
        y: Math.random() * (window?.innerHeight || 1000),
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5
      }))
      setParticles(newParticles)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      {/* Update navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="relative w-10 h-10">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-xl"
                />
                <div className="absolute inset-0.5 bg-[#0D0D0F] rounded-lg" />
                <Droplet className="absolute inset-0 m-auto h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
                АромаВеганБаланс
              </span>
            </motion.div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={navLinkStyles}
                >
                  {link.label}
                </motion.a>
              ))}
              {user ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-4"
                >
                  <Button
                    onClick={handleDashboard}
                    className={buttonPrimaryStyles}
                  >
                    Личный кабинет
                  </Button>
                  <ProfileMenu onProfileOpen={() => setIsProfileOpen(true)} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-4"
                >
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className={buttonSecondaryStyles}
                  >
                    Войти
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    className={buttonPrimaryStyles}
                  >
                    Регистрация
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:hidden relative w-10 h-10 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-white absolute inset-0 m-auto" />
              ) : (
                <Menu className="h-5 w-5 text-white absolute inset-0 m-auto" />
              )}
            </motion.button>
            </div>
          </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0D0D0F]/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {user ? (
                  <Button
                    onClick={handleDashboard}
                    className={`w-full ${buttonPrimaryStyles}`}
                  >
                    Личный кабинет
                    </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleLogin}
                      className={`w-full ${buttonSecondaryStyles}`}
                    >
                      Войти
                    </Button>
                    <Button
                      onClick={() => router.push('/register')}
                      className={`w-full ${buttonPrimaryStyles}`}
                    >
                      Регистрация
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
              {/* Main gradient blob */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-full blur-[120px] opacity-30"
              />
              
              {/* Secondary gradient blob */}
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#4C35DE] to-[#FF3366] rounded-full blur-[120px] opacity-30"
              />

              {/* Additional decorative elements */}
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"
              />
              
              {/* Animated particles */}
              <div className="absolute inset-0">
                {particles.map((particle, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      x: particle.x,
                      y: particle.y,
                      scale: particle.scale,
                      opacity: particle.opacity
                    }}
                    animate={{
                      y: [null, Math.random() * -100],
                      opacity: [null, 0]
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 2
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                  />
                ))}
        </div>
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F] via-transparent to-[#0D0D0F]" />
            </div>

            {/* Hero content */}
            <div className="relative z-10 container mx-auto px-4 py-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left space-y-8"
              >
                {/* Badge */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/10 shadow-xl"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-[#FF3366]" />
                  </motion.div>
                  <span className="relative">
                    Инновационный подход к здоровью
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#4C35DE]/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </span>
                </motion.div>
                
                {/* Heading */}
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]"
                  >
                    Гармония тела
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="block text-white/90"
                  >
                    и души через
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-[#4C35DE] to-[#FF3366]"
                  >
                    природную силу
                  </motion.span>
                </h1>
                
                {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-xl text-white/70 max-w-xl leading-relaxed"
              >
                  Откройте для себя силу природы с помощью искусственного интеллекта. 
                  Персонализированные рекомендации для вашего благополучия.
              </motion.p>

                {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4"
              >
                  <Button 
                    size="lg" 
                    className={`${buttonPrimaryStyles} group`}
                    onClick={handleDashboard}
                  >
                    <span className="relative z-10">Начать путешествие</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="relative z-10 ml-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                    </Button>
                    <Button 
                      size="lg" 
                    variant="outline"
                    className={buttonSecondaryStyles}
                    onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Узнать больше
                    </Button>
              </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
                >
                  {[
                    { value: "10K+", label: "Активных пользователей" },
                    { value: "98%", label: "Положительных отзывов" },
                    { value: "24/7", label: "Поддержка AI" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.value}
                      whileHover={{ scale: 1.05 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/10 to-[#4C35DE]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE] group-hover:from-[#4C35DE] group-hover:to-[#FF3366] transition-all duration-300">
                          {stat.value}
            </div>
                        <div className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                          {stat.label}
          </div>
        </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
                  <Image
                    src="https://i.ibb.co/4W2QJFV/image-fx-3.png"
                    alt="Арома и веган баланс"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3366]/20 to-transparent" />
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/10 to-[#4C35DE]/10"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -left-10 bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <motion.div
                        animate={{
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-lg"
                      />
                      <div className="absolute inset-0.5 bg-[#0D0D0F] rounded-lg" />
                      <Brain className="absolute inset-0 m-auto h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
                        AI Анализ
                      </div>
                      <div className="text-xs text-white/50">
                        Персональные рекомендации
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-10 -right-10 bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <motion.div
                        animate={{
                          rotate: [0, -360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-[#4C35DE] to-[#FF3366] rounded-lg"
                      />
                      <div className="absolute inset-0.5 bg-[#0D0D0F] rounded-lg" />
                      <Heart className="absolute inset-0 m-auto h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#4C35DE] to-[#FF3366]">
                        Здоровье
                      </div>
                      <div className="text-xs text-white/50">
                        Природная гармония
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <div className="text-sm text-white/50 font-medium">Прокрутите вниз</div>
                <motion.div
                  animate={{
                    y: [0, 5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="h-6 w-6 text-white/50 rotate-90" />
                </motion.div>
              </motion.div>
            </motion.div>
      </section>

          {/* Features section */}
          <section id="features" className="relative py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
              />
              <motion.div
                animate={{
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"
              />
          </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16 relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/10 shadow-xl mb-4"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-[#FF3366]" />
                  </motion.div>
                  Уникальные возможности
                </motion.div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
                  Инновационные возможности
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Откройте для себя уникальные функции, которые помогут вам достичь гармонии тела и души
                </p>
              </motion.div>

              {/* Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                    key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className={`${cardPrimaryStyles} group`}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="relative w-14 h-14 mb-6">
                        <motion.div
                          animate={{
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-xl"
                        />
                        <div className="absolute inset-0.5 bg-[#0D0D0F] rounded-lg" />
                        <feature.icon className="absolute inset-0 m-auto h-7 w-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-[#FF3366] transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-white/70 group-hover:text-white/90 transition-colors flex-grow">
                        {feature.description}
                      </p>
                      
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="mt-6 h-0.5 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {renderAIExplanationSection()}

          <section className="py-24 relative overflow-hidden bg-[#0D0D0F]">
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
          </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Интерфейс приложения
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">
                  Удобный и интуитивный дизайн
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Познакомьтесь с нашим приложением ближе и оцените его функциональность
                </p>
              </motion.div>

                <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {appScreenshots.map((screenshot, index) => (
                  <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className="relative group"
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[9/16]">
                        <Image
                          src={screenshot.src}
                          alt={screenshot.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold mb-2">{screenshot.alt}</h3>
                          <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white/20"
                            onClick={() => window.open(screenshot.src, '_blank')}
                          >
                            Увеличить
                            <Maximize2 className="ml-2 h-4 w-4" />
                          </Button>
          </div>
                </div>
              </motion.div>
            ))}
          </div>

                <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-pink-100 rounded-full blur-3xl opacity-50" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center mt-16"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                  onClick={handleDashboard}
                >
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
        </div>
      </section>

          <section id="how-it-works" className="relative py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/10 to-[#4C35DE]/10"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
          </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium shadow-lg shadow-purple-100 mb-4"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Простой путь к гармонии
                </motion.div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Как это работает
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Четыре простых шага на пути к гармонии тела и души с использованием искусственного интеллекта
                </p>
              </motion.div>

              <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 transform -translate-y-1/2" />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
            {[
              { 
                icon: Brain, 
                title: "AI-анализ состояния", 
                      description: "Искусственный интеллект анализирует ваше эмоциональное и физическое состояние в реальном времени",
                      gradient: "from-purple-500 to-purple-600"
              },
              { 
                icon: Zap, 
                      title: "Обработка данных",
                      description: "Продвинутые алгоритмы обрабатывают информацию и формируют персональные рекомендации",
                      gradient: "from-pink-500 to-purple-500"
              },
              { 
                icon: Sparkles, 
                      title: "Рекомендации",
                      description: "Получите индивидуальный план по ароматерапии и веганскому питанию, основанный на ваших потребностях",
                      gradient: "from-purple-500 to-pink-500"
              },
              { 
                icon: TrendingUp, 
                      title: "Улучшение",
                      description: "Система непрерывно учится и адаптируется, делая рекомендации все более точными и эффективными",
                      gradient: "from-pink-500 to-pink-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                      className="relative group"
                    >
                      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100 h-full hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 transform hover:-translate-y-2">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <step.icon className="h-8 w-8 text-white" />
                  </div>
                        
                  <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          className="absolute -top-px left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                        
                        <div className="absolute -top-4 left-8 bg-white px-4 py-1 rounded-full border border-purple-100 text-sm font-medium text-purple-600 shadow-sm">
                          Шаг {index + 1}
                </div>
                        
                        <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                          {step.title}
                        </h3>
                        
                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                          {step.description}
                        </p>
                        
                        <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" />
                      </div>

                      {/* Removing the numbered circles */}
                      {/* <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-lg font-bold shadow-lg"
                        >
                          {index + 1}
                  </motion.div>
                      </div> */}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
                className="text-center mt-20"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={handleDashboard}
                >
                  Начать сейчас
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
        </motion.div>
                </Button>
              </motion.div>
        </div>
      </section>

          <section id="testimonials" className="py-24 relative overflow-hidden bg-[#0D0D0F]">
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
          </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
          viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-4 text-white">
                  Отзывы наших пользователей
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Узнайте, как Арома и Веган-Баланс помогает людям достигать гармонии и благополучия
                </p>
        </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
              <motion.div
                    key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-8 relative border border-white/10"
                  >
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                    <div className="flex items-center mb-6">
                      <div className="relative w-12 h-12 mr-4">
                  <Image 
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">Пользователь платформы</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                    <div className="mt-6 flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

          <BlogPreview />

          <section id="pricing" className="py-24 relative overflow-hidden bg-[#0D0D0F]">
            {/* Background elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center mb-16">
        <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
          viewport={{ once: true }}
                  className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/10 shadow-xl mb-4"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Target className="h-4 w-4 mr-2 text-[#FF3366]" />
                  </motion.div>
                  Выберите свой план
                </motion.div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
                  Тарифные планы
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Выберите подходящий вам план и начните путь к гармонии уже сегодня
              </p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Базовый</h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">Бесплатно</span>
            </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "Базовые рекомендации по ароматерапии",
                        "Доступ к основным рецептам",
                        "Ограниченный доступ к AI-функциям",
                        "Стандартная поддержка",
                        "Базовая персонализация"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center text-white/70">
                          <Check className="h-5 w-5 text-[#FF3366] mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="lg"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                      onClick={() => router.push('/register')}
                    >
                      Начать бесплатно
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </div>
        </motion.div>

                {/* Premium Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 h-full relative overflow-hidden">
                    <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] rounded-t-2xl" />
                    
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <div className="bg-gradient-to-r from-[#FF3366] to-[#4C35DE] text-white text-sm font-medium px-3 py-1 rounded-full">
                        Популярный
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Премиум</h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">599₽</span>
                      <span className="text-white/70 ml-2">/месяц</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "Расширенные AI-рекомендации",
                        "Полный доступ к базе рецептов",
                        "Персональный план питания",
                        "Приоритетная поддержка 24/7",
                        "Индивидуальные консультации",
                        "Эксклюзивный контент",
                        "Отслеживание прогресса"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center text-white/70">
                          <Check className="h-5 w-5 text-[#FF3366] mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#FF3366] to-[#4C35DE] hover:from-[#FF4D7F] hover:to-[#5842FF] text-white shadow-xl shadow-[#FF3366]/20 hover:shadow-2xl hover:shadow-[#4C35DE]/30 transition-all duration-300"
                      onClick={() => router.push('/register?plan=premium')}
                    >
                      Выбрать премиум
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              <div className="mt-16 text-center">
                <p className="text-white/70 mb-8">
                  Все планы включают 14-дневный пробный период. Отмена подписки в любое время.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { icon: Shield, text: "Безопасная оплата" },
                    { icon: Clock, text: "Мгновенный доступ" },
                    { icon: Activity, text: "Регулярные обновления" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-white/70">
                      <item.icon className="h-5 w-5 mr-2 text-[#FF3366]" />
                      {item.text}
                    </div>
              ))}
            </div>
          </div>
        </div>
      </section>

          <section id="faq" className="py-24 relative overflow-hidden bg-[#0D0D0F]">
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/20 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/20 to-transparent"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-white">
                  Часто задаваемые вопросы
                </h2>
                <p className="text-base sm:text-xl text-white/80">
              Ответы на самые популярные вопросы о нашей платформе
            </p>
          </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10"
                  >
                    <AccordionTrigger className="text-white px-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 px-4">
                      {item.answer}
                    </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

          <footer className="bg-[#0D0D0F] text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3366]/10 to-transparent"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#4C35DE]/10 to-transparent"
              />
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
            </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <Droplet className="h-8 w-8 text-purple-400" />
                    <span className="text-xl font-bold">АромаВеганБаланс</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Инновационная платформа для достижения гармонии тела и души через ароматерапию и веганство
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    </a>
            </div>
                </div>
                
            <div>
                  <h3 className="text-lg font-semibold mb-6">Компания</h3>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">О нас</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Карьера</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Блог</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Пресс-центр</a></li>
              </ul>
            </div>

            <div>
                  <h3 className="text-lg font-semibold mb-6">Поддержка</h3>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Помощь</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Документация</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Условия использования</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Конфиденциальность</a></li>
              </ul>
            </div>

            <div>
                  <h3 className="text-lg font-semibold mb-6">Подпишитесь на новости</h3>
                  <p className="text-gray-400 mb-4">
                    Получайте последние обновления и специальные предложения
                  </p>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-400 focus:border-purple-400"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Подписаться
                </Button>
              </form>
            </div>
          </div>

              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2024 АромаВеганБаланс. Все права защищены.</p>
          </div>
        </div>
      </footer>
        </div>

        {/* Floating navigation dots */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4 z-50">
          {['hero', 'features', 'how-it-works', 'testimonials', 'pricing', 'faq'].map((section, index) => (
            <motion.button
              key={section}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: activeSection === section ? 1 : 0.8,
                backgroundColor: activeSection === section ? '#FF3366' : '#4C35DE'
              }}
              onClick={() => {
                const element = document.getElementById(section);
                element?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(section);
              }}
              className="w-3 h-3 rounded-full transition-colors"
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Scroll to top button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollYProgress > 0.2 ? 1 : 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-50"
        >
          <ArrowUp className="h-6 w-6 text-white" />
        </motion.button>
      </div>

      {isProfileOpen && (
        <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #e9d5ff;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #d8b4fe;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

