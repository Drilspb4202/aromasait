'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, BookOpen, Clock, Sparkles, Check } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Польза эфирных масел для снятия стресса",
    excerpt: "Узнайте, как ароматерапия может помочь вам справиться со стрессом и улучшить эмоциональное состояние.",
    content: "Эфирные масла обладают удивительной способностью влиять на наше эмоциональное состояние. Лаванда, например, известна своими успокаивающими свойствами и может помочь снизить уровень тревожности. Масло бергамота поднимает настроение и помогает бороться с депрессией. Ромашка способствует расслаблению и улучшает качество сна. Регулярное использование этих масел в ароматерапии может значительно снизить уровень стресса и улучшить общее самочувствие.",
    date: "2023-05-15",
    image: "https://i.ibb.co/4W2QJFV/image-fx-3.png"
  },
  {
    id: 2,
    title: "Топ-5 веганских рецептов для укрепления иммунитета",
    excerpt: "Простые и вкусные веганские блюда, которые помогут поддержать ваш иммунитет в любое время года.",
    content: "1. Смузи с ягодами и шпинатом: богат антиоксидантами и витамином C. 2. Чечевичный суп с куркумой: противовоспалительное действие и богат белком. 3. Салат из киноа с авокадо и орехами: содержит полезные жиры и витамин E. 4. Запеченная тыква с чесноком и розмарином: богата бета-каротином. 5. Овощное карри с кокосовым молоком: содержит противовирусные специи.",
    date: "2023-05-10",
    image: "https://i.ibb.co/BPsPWBY/image-fx-9.png"
  },
  {
    id: 3,
    title: "Медитация и ароматерапия: идеальное сочетание для релаксации",
    excerpt: "Как совместить практику медитации с использованием эфирных масел для достижения глубокого расслабления.",
    content: "Сочетание медитации и ароматерапии создает мощный инструмент для достижения глубокой релаксации. Начните с выбора успокаивающего масла, такого как лаванда или сандал. Капните несколько капель на диффузор или ароматическую лампу. Примите удобную позу для медитации и сосредоточьтесь на своем дыхании. Позвольте аромату окутать вас, углубляя ваше состояние покоя. Регулярная практика этой техники поможет снизить стресс и улучшить общее благополучие.",
    date: "2023-05-05",
    image: "https://i.ibb.co/twGyykN/image-fx-10.png"
  },
  {
    id: 4,
    title: "Ароматерапия для улучшения сна: советы и рекомендации",
    excerpt: "Бессонница? Узнайте, как эфирные масла могут помочь вам расслабиться и улучшить качество сна.",
    content: "Сон - это основа нашего здоровья и благополучия. Ароматерапия может стать вашим надежным помощником в борьбе с бессонницей и другими проблемами со сном. Эфирные масла, такие как лаванда, ромашка и сандал, известны своими успокаивающими и расслабляющими свойствами. Добавьте несколько капель в диффузор или теплую ванну перед сном, и вы почувствуете, как напряжение уходит, а тело готовится к отдыху. Создайте спокойную атмосферу в спальне с помощью ароматерапии и наслаждайтесь крепким и здоровым сном.",
    date: "2023-05-20",
    image: "https://i.ibb.co/tPSc8hT/image-fx-7.png"
  },
]

export default function BlogPreview() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const router = useRouter()

  return (
    <>
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
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-10 w-24 h-24 bg-[#FF3366]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#4C35DE]/10 rounded-full blur-xl"
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
              <BookOpen className="h-4 w-4 mr-2 text-[#FF3366]" />
            </motion.div>
            Наш блог
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
            Полезные статьи и советы
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Узнайте больше о здоровом образе жизни, ароматерапии и веганстве
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-[#FF3366]/20"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <div className="text-sm text-white/70">
                    {new Date(post.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#FF3366] transition-colors">
                  {post.title}
                </h3>
                <p className="text-white/70 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center">
                  <Button
                    variant="link"
                    className="text-[#FF3366] hover:text-[#FF4D7F] p-0 flex items-center group/button"
                    onClick={() => setSelectedPost(post)}
                  >
                    Читать далее
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                    </motion.div>
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF3366] to-[#4C35DE] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => router.push('/blog')}
          >
            Все статьи
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-2"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>

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
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-10 w-24 h-24 bg-[#FF3366]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#4C35DE]/10 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/10 shadow-xl">
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
              Начните свой путь к гармонии
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#4C35DE]">
              Готовы изменить свою жизнь к лучшему?
            </h2>
            
            <p className="text-xl text-white/70">
              Присоединяйтесь к тысячам людей, которые уже открыли для себя силу ароматерапии и веганского образа жизни
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF3366] to-[#4C35DE] hover:from-[#FF4D7F] hover:to-[#5842FF] text-white shadow-xl shadow-[#FF3366]/20 hover:shadow-2xl hover:shadow-[#4C35DE]/30 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => router.push('/register')}
              >
                Начать бесплатно
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Узнать больше
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/70">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mr-2">
                  <Check className="h-4 w-4 text-[#FF3366]" />
                </div>
                <span>14 дней бесплатно</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mr-2">
                  <Check className="h-4 w-4 text-[#4C35DE]" />
                </div>
                <span>Без обязательств</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mr-2">
                  <Check className="h-4 w-4 text-[#FF3366]" />
                </div>
                <span>Отмена в любое время</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{selectedPost?.title}</DialogTitle>
          <div className='text-sm text-gray-500 mb-2 space-y-2'>
            <div className="mb-4">
              <Image 
                src={selectedPost?.image || "/placeholder.svg"} 
                alt={selectedPost?.title} 
                width={600} 
                height={300} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="text-sm text-gray-500 mb-2">{selectedPost?.date}</div>
          </div>
        </DialogHeader>
        <p className="text-gray-700">{selectedPost?.content}</p>
      </DialogContent>
    </Dialog>
    </>
  )
}

