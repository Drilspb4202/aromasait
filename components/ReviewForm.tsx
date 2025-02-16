'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { supabase, Review } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface ReviewFormProps {
onReviewSubmit: () => void
}

export default function ReviewForm({ onReviewSubmit }: ReviewFormProps) {
const [review, setReview] = useState('')
const [isSubmitting, setIsSubmitting] = useState(false)
const { user } = useAuth()
const [userReviews, setUserReviews] = useState<Review[]>([])

useEffect(() => {
  if (user) {
    fetchUserReviews()
  }
}, [user])

const fetchUserReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    setUserReviews(data || [])
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    toast.error('Не удалось загрузить ваши отзывы')
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) {
    toast.error('Пожалуйста, войдите в систему, чтобы оставить отзыв')
    return
  }
  if (review.trim() === '') {
    toast.error('Пожалуйста, введите текст отзыва')
    return
  }
  setIsSubmitting(true)
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        content: review.trim(),
        user_name: user.user_metadata.full_name || user.email
      })

    if (error) throw error

    toast.success('Спасибо за ваш отзыв!')
    setReview('')
    onReviewSubmit()
    fetchUserReviews() // Refresh user reviews after submitting a new one
  } catch (error: any) {
    console.error('Error submitting review:', error)
    toast.error(error.message || 'Не удалось отправить отзыв')
  } finally {
    setIsSubmitting(false)
  }
}

const handleDeleteReview = async (id: number) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure only the user can delete their own reviews

    if (error) throw error

    toast.success('Отзыв удален')
    fetchUserReviews()
    onReviewSubmit()
  } catch (error: any) {
    console.error('Error deleting review:', error)
    toast.error(error.message || 'Не удалось удалить отзыв')
  }
}


return (
<div className="mt-8 space-y-4">
  {user ? (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Поделитесь своим опытом..."
          className="w-full"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Отправка...' : 'Оставить отзыв'}
        </Button>
      </form>
      <div>
        <h4 className="text-lg font-semibold mb-2">Ваши отзывы:</h4>
        <AnimatePresence>
          {userReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 border rounded-lg relative"
            >
              <p className="text-gray-800 dark:text-gray-200">{review.content}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteReview(review.id)}
                className="absolute top-2 right-2 hover:bg-red-100 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  ) : (
    <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
     Пожалуйста,{' '}
     <Link href="/login" className="font-medium text-primary hover:underline dark:text-primary-foreground">
       войдите
     </Link>{' '}
     чтобы оставить отзыв.
   </p>
  )}
</div>
)
}

