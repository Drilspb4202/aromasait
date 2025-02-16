import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThumbsUp, MessageSquare, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface PostProps {
  id: number
  user_id: string
  username: string
  content: string
  likes: number
  created_at: string
  comments: PostProps[]
  onUpdate: () => void
}

export default function Post({ id, user_id, username, content, likes, created_at, comments, onUpdate }: PostProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleLike = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: likes + 1 })
        .eq('id', id)

      if (error) throw error

      onUpdate()
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error('Не удалось поставить лайк')
    }
  }

  const handleReply = async () => {
    if (replyContent.trim() === '') {
      toast.error('Пожалуйста, введите текст комментария')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          username: user.user_metadata.full_name || user.email,
          content: replyContent,
          parent_id: id
        })

      if (error) throw error

      setReplyContent('')
      setIsReplying(false)
      onUpdate()
      toast.success('Комментарий добавлен')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Не удалось добавить комментарий')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border p-4 rounded-lg mb-4"
    >
      <div className="flex items-start space-x-3">
        <Avatar>
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h3 className="font-bold">{username}</h3>
          <p className="text-sm text-gray-500">{new Date(created_at).toLocaleString()}</p>
          <p className="my-2">{content}</p>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleLike}>
              <ThumbsUp className="mr-2 h-4 w-4" /> {likes}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsReplying(!isReplying)}>
              <MessageSquare className="mr-2 h-4 w-4" /> {comments.length}
            </Button>
          </div>
          {isReplying && (
            <div className="mt-2">
              <Textarea
                placeholder="Напишите ваш комментарий..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleReply}>
                <Send className="mr-2 h-4 w-4" /> Ответить
              </Button>
            </div>
          )}
        </div>
      </div>
      {comments.length > 0 && (
        <div className="ml-8 mt-4 space-y-4">
          {comments.map((comment) => (
            <Post key={comment.id} {...comment} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

