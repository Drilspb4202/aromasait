'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import ReviewForm from './ReviewForm' // Import the ReviewForm component

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar: string
}

const predefinedTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Анна С.",
    role: "Веган-блогер",
    content: "АромаВеганБаланс помог мне найти гармонию между питанием и эмоциональным состоянием. Рекомендации по ароматерапии просто потрясающие!",
    avatar: "/placeholder.svg?height=100&width=100"
  },
  {
    id: 2,
    name: "Михаил Д.",
    role: "Фитнес-тренер",
    content: "Благодаря этому приложению я открыл для себя мир ароматерапии. Теперь мои тренировки стали еще эффективнее!",
    avatar: "/placeholder.svg?height=100&width=100"
  },
  {
    id: 3,
    name: "Елена В.",
    role: "Психолог",
    content: "Я рекомендую АромаВеганБаланс своим клиентам. Это отличный инструмент для поддержания эмоционального баланса и здорового образа жизни.",
    avatar: "/placeholder.svg?height=100&width=100"
  }
]

export default function Testimonials() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(predefinedTestimonials)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserReviews();

    const channel = supabase
      .channel('public:reviews') 
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'reviews' 
      }, (payload) => {
        setAllTestimonials((prev) => [
          ...prev,
          {
            id: payload.new.id,
            name: payload.new.user_name,
            role: 'Пользователь',
            content: payload.new.content,
            avatar: '/placeholder.svg?height=100&width=100',
          },
        ])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []);

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, user_name, content')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const userReviews: Testimonial[] = data.map(review => ({
          id: review.id,
          name: review.user_name,
          role: 'Пользователь',
          content: review.content,
          avatar: '/placeholder.svg?height=100&width=100'
        }))
        setAllTestimonials(prevTestimonials => [...prevTestimonials, ...userReviews])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Не удалось загрузить отзывы')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length)
  }

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length)
  }

  return (
    <div className="space-y-8"> {/* Added space-y-8 for better spacing */}
      <div className="relative">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : allTestimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Пока нет отзывов. Будьте первым!
          </div>
        ) : (
          <AnimatePresence initial={false} >
            <motion.div
              key={currentTestimonial}
              className="flex"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="w-full mx-auto max-w-lg">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={allTestimonials[currentTestimonial].avatar} alt={allTestimonials[currentTestimonial].name} />
                      <AvatarFallback>{allTestimonials[currentTestimonial].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{allTestimonials[currentTestimonial].name}</CardTitle>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">&ldquo;{allTestimonials[currentTestimonial].content}&rdquo;</p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

