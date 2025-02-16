'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, Save, Search, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface OilMix {
  id: number
  name: string
  oils: { name: string; amount: number }[]
  description?: string
  properties?: string[]
  effects?: string[]
}

const availableOils = [
  'Туя', 'Базилик', 'Бергамот', 'Черный перец', 'Черная ель', 'Голубая пижма', 'Кардамон',
  'Кассия', 'Кедр', 'Сельдерей', 'Кинза', 'Корица', 'Цитронелла', 'Шалфей мускатный',
  'Гвоздика', 'Копайба', 'Кориандр', 'Кипарис', 'Дугласова пихта', 'Фенхель', 'Ладан',
  'Герань', 'Имбирь', 'Грейпфрут', 'Зеленый мандарин', 'Гваяковое дерево', 'Бессмертник',
  'Можжевельник', 'Лаванда', 'Лимон', 'Лимонный эвкалипт', 'Лемонграсс', 'Лайм',
  'Мадагаскарская ваниль', 'Майоран', 'Мелисса', 'Мирра', 'Орегано', 'Пачули',
  'Перечная мята', 'Петитгрейн', 'Розовый перец', 'Римская ромашка', 'Розмарин',
  'Гавайское сандаловое дерево', 'Сандаловое дерево', 'Сибирская пихта', 'Испанский шалфей',
  'Садовая мята', 'Нард'
]

export default function AromaBlender() {
  const [mixes, setMixes] = useState<OilMix[]>([])
  const [currentMix, setCurrentMix] = useState<OilMix>({ id: 0, name: '', oils: [] })
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const savedMixes = localStorage.getItem('aromaMixes')
    if (savedMixes) {
      setMixes(JSON.parse(savedMixes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aromaMixes', JSON.stringify(mixes))
  }, [mixes])

  const filteredOils = availableOils.filter(oil =>
    oil.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addOil = (oilName: string) => {
    if (currentMix.oils.length < 5) {
      setCurrentMix({
        ...currentMix,
        oils: [...currentMix.oils, { name: oilName, amount: 1 }]
      })
    } else {
      toast.error('Максимум 5 масел в смеси')
    }
  }

  const updateOil = (index: number, amount: number) => {
    const newOils = [...currentMix.oils]
    newOils[index] = { ...newOils[index], amount }
    setCurrentMix({ ...currentMix, oils: newOils })
  }

  const removeOil = (index: number) => {
    setCurrentMix({
      ...currentMix,
      oils: currentMix.oils.filter((_, i) => i !== index)
    })
  }

  const saveMix = () => {
    if (currentMix.name.trim() === '') {
      toast.error('Пожалуйста, введите название смеси')
      return
    }
    if (currentMix.oils.length === 0) {
      toast.error('Добавьте хотя бы одно масло в смесь')
      return
    }
    if (currentMix.id === 0) {
      const newMix = { ...currentMix, id: Date.now() }
      setMixes([...mixes, newMix])
    } else {
      setMixes(mixes.map(mix => mix.id === currentMix.id ? currentMix : mix))
    }
    setCurrentMix({ id: 0, name: '', oils: [] })
    toast.success('Смесь сохранена')
  }

  const editMix = (mix: OilMix) => {
    setCurrentMix(mix)
  }

  const deleteMix = (id: number) => {
    setMixes(mixes.filter(mix => mix.id !== id))
    toast.success('Смесь удалена')
  }

  const generateAIBlend = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-blend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (response.ok) {
        const newMix: OilMix = {
          id: Date.now(),
          name: data.name,
          oils: data.oils,
          description: data.description,
          properties: data.properties,
          effects: data.effects,
        }
        setMixes([...mixes, newMix])
        setCurrentMix(newMix)
        toast.success('AI создал новую смесь!')
      } else {
        throw new Error(data.error || 'Не удалось создать смесь')
      }
    } catch (error) {
      console.error('Error generating blend:', error)
      toast.error('Не удалось создать смесь. Попробуйте еще раз.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader className="bg-gradient-to-r from-teal-400 to-blue-500 text-white">
        <CardTitle className="text-2xl text-center">Создание ароматических смесей</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mixName" className="mb-2 block">Название смеси</Label>
            <Input
              id="mixName"
              value={currentMix.name}
              onChange={(e) => setCurrentMix({ ...currentMix, name: e.target.value })}
              placeholder="Введите название смеси"
              className="mb-4"
            />
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Поиск масла..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <ScrollArea className="h-[200px] mb-4 border rounded-md p-2">
              <div className="grid grid-cols-2 gap-2">
                {filteredOils.map((oil) => (
                  <motion.div key={oil} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={() => addOil(oil)}
                      disabled={currentMix.oils.length >= 5}
                    >
                      {oil}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Текущая смесь:</h3>
            <ScrollArea className="h-[200px] mb-4 border rounded-md p-2">
              <AnimatePresence>
                {currentMix.oils.map((oil, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center mb-2 bg-gray-100 p-2 rounded"
                  >
                    <span className="flex-grow">{oil.name}</span>
                    <Slider
                      value={[oil.amount]}
                      onValueChange={(value) => updateOil(index, value[0])}
                      max={10}
                      step={1}
                      className="w-24 mr-2"
                    />
                    <span className="w-8 text-center">{oil.amount}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeOil(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
            <Button onClick={saveMix} className="w-full mb-4 bg-teal-500 hover:bg-teal-600">
              <Save className="mr-2 h-4 w-4" /> Сохранить смесь
            </Button>
            <Button onClick={generateAIBlend} className="w-full mb-4 bg-blue-500 hover:bg-blue-600" disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? 'Генерация...' : 'Создать AI смесь'}
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Сохраненные смеси:</h3>
          <ScrollArea className="h-[200px] border rounded-md p-2">
            {mixes.map((mix) => (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-2 border-b last:border-b-0"
              >
                <span className="font-medium">{mix.name}</span>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => editMix(mix)} className="mr-2">
                    Редактировать
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMix(mix.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

