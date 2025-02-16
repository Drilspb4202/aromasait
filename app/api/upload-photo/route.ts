import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const photo = formData.get('photo') as File
    
    if (!photo) {
      return Response.json(
        { error: 'Фото не найдено' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Проверяем авторизацию
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    // Загружаем фото в Supabase Storage
    const fileExt = photo.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('recipe-photos')
      .upload(fileName, photo)

    if (error) {
      throw error
    }

    // Получаем публичный URL фото
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-photos')
      .getPublicUrl(fileName)

    return Response.json({ url: publicUrl })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return Response.json(
      { error: 'Не удалось загрузить фото' },
      { status: 500 }
    )
  }
} 