const availableOils = [
  'Лаванда',
  'Мята',
  'Эвкалипт',
  'Чайное дерево',
  'Розмарин',
  'Бергамот',
  'Лимон',
  'Апельсин',
  'Иланг-иланг',
  'Герань',
  'Сандал',
  'Кедр',
  'Пачули',
  'Ромашка',
  'Жасмин'
]

const availableDietaryPreferences = [
  'Без глютена',
  'Без сои',
  'Без орехов',
  'Без сахара',
  'Сыроедение',
  'Без пшеницы',
  'Без кофеина',
  'Органические продукты',
  'Без ГМО',
  'Без консервантов'
]

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'
import { Loader2, User, X, Camera, Droplet, Utensils, Activity, Save, Plus, Minus } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileCompletenessIndicator } from './ProfileCompletenessIndicator'
import { LanguageSelector } from './LanguageSelector'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [favoriteOils, setFavoriteOils] = useState<string[]>([])
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [activityLevel, setActivityLevel] = useState('')
  const [newOil, setNewOil] = useState('')
  const [newDietaryPreference, setNewDietaryPreference] = useState('')
  const [language, setLanguage] = useState('ru')
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.user_metadata.full_name || '')
      setBio(user.user_metadata.bio || '')
      setAvatarUrl(user.user_metadata.avatar_url || '')
      setFavoriteOils(user.user_metadata.favorite_oils || [])
      setDietaryPreferences(user.user_metadata.dietary_preferences || [])
      setActivityLevel(user.user_metadata.activity_level || '')
      setLanguage(user.user_metadata.language || 'ru')
    }
  }, [isOpen, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName, 
          bio,
          favorite_oils: favoriteOils,
          dietary_preferences: dietaryPreferences,
          activity_level: activityLevel,
          language,
        }
      })
      if (error) throw error
      toast.success('Профиль успешно обновлен')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при обновлении профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOil = () => {
    if (newOil && !favoriteOils.includes(newOil)) {
      setFavoriteOils([...favoriteOils, newOil])
      setNewOil('')
    }
  }

  const handleRemoveOil = (oil: string) => {
    setFavoriteOils(favoriteOils.filter(o => o !== oil))
  }

  const handleAddDietaryPreference = () => {
    if (newDietaryPreference && !dietaryPreferences.includes(newDietaryPreference)) {
      setDietaryPreferences([...dietaryPreferences, newDietaryPreference])
      setNewDietaryPreference('')
    }
  }

  const handleRemoveDietaryPreference = (preference: string) => {
    setDietaryPreferences(dietaryPreferences.filter(p => p !== preference))
  }

  const calculateProfileCompleteness = () => {
    const fields = [
      fullName,
      bio,
      avatarUrl,
      activityLevel,
      favoriteOils.length > 0,
      dietaryPreferences.length > 0,
      language,
    ]
    const filledFields = fields.filter(Boolean).length
    return Math.round((filledFields / fields.length) * 100)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-purple-400 to-pink-500 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold">Ваш профиль</CardTitle>
          <CardDescription className="text-purple-100">
            Персонализируйте свой опыт в АромаВеганБалансе
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProfileCompletenessIndicator completeness={calculateProfileCompleteness()} />
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">Общее</TabsTrigger>
                  <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Изменить фото
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Полное имя</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Уровень активности</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger id="activityLevel">
                        <SelectValue placeholder="Выберите уровень активности" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкий</SelectItem>
                        <SelectItem value="moderate">Умеренный</SelectItem>
                        <SelectItem value="high">Высокий</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <LanguageSelector value={language} onChange={setLanguage} />
                </TabsContent>
                <TabsContent value="preferences" className="space-y-6">
                  <div className="space-y-2">
                    <Label>Любимые эфирные масла</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {favoriteOils.map((oil, index) => (
                        <Badge key={index} variant="secondary">
                          <Droplet className="mr-1 h-3 w-3" />
                          {oil}
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveOil(oil)} className="ml-1 p-0">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={newOil}
                        onValueChange={setNewOil}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Выберите масло" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableOils.map((oil) => (
                            <SelectItem key={oil} value={oil}>{oil}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddOil} type="button">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Диетические предпочтения</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {dietaryPreferences.map((pref, index) => (
                        <Badge key={index} variant="secondary">
                          <Utensils className="mr-1 h-3 w-3" />
                          {pref}
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveDietaryPreference(pref)} className="ml-1 p-0">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={newDietaryPreference}
                        onValueChange={setNewDietaryPreference}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Выберите предпочтение" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDietaryPreferences.map((pref) => (
                            <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddDietaryPreference} type="button">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

