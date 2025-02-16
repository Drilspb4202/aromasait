import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют переменные окружения для Supabase')
}

export type Review = {
  id: number
  user_id: string
  content: string
  user_name: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      // ... other tables
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Функция для проверки подключения
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('reviews').select('count', { count: 'exact' })
    if (error) throw error
    console.log('Подключение к Supabase успешно. Количество отзывов:', data)
    return true
  } catch (error) {
    console.error('Ошибка подключения к Supabase:', error)
    return false
  }
}

