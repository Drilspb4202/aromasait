'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Droplet, Info, ThumbsUp, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface EssentialOil {
  name: string
  color: string
  description: string
  benefits: string[]
  cautions: string[]
  usageInstructions: string[]
  icon: string
  category: string
}

const categories = [
  { name: 'Все', icon: '🌿' },
  { name: 'Цитрусовые', icon: '🍊' },
  { name: 'Цветочные', icon: '🌸' },
  { name: 'Травяные', icon: '🌱' },
  { name: 'Древесные', icon: '🌳' },
  { name: 'Пряные', icon: '🌶️' },
]

const essentialOils: EssentialOil[] = [
  { name: 'Туя', color: '#006400', description: 'Очищающий и укрепляющий аромат', benefits: ['Очищение', 'Укрепление'], cautions: ['Не использовать во время беременности'], usageInstructions: ['Разбавлять перед использованием'], icon: '🌲', category: 'Древесные' },
  { name: 'Базилик', color: '#228B22', description: 'Освежающий и стимулирующий аромат', benefits: ['Освежение', 'Стимуляция'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Бергамот', color: '#FFD700', description: 'Освежающий и поднимающий настроение аромат', benefits: ['Освежение', 'Поднятие настроения'], cautions: ['Фототоксичность'], usageInstructions: ['Разбавлять перед нанесением на кожу'], icon: '🍊', category: 'Цитрусовые' },
  { name: 'Черный перец', color: '#2F4F4F', description: 'Согревающий и стимулирующий аромат', benefits: ['Согревание', 'Стимуляция'], cautions: ['Может раздражать кожу'], usageInstructions: ['Использовать в диффузоре или добавлять в массажное масло'], icon: '🌶️', category: 'Пряные' },
  { name: 'Черная ель', color: '#013220', description: 'Заземляющий и освежающий аромат', benefits: ['Заземление', 'Освежение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌲', category: 'Древесные' },
  { name: 'Голубая пижма', color: '#4682B4', description: 'Успокаивающий и противовоспалительный аромат', benefits: ['Успокоение', 'Противовоспаление'], cautions: ['Может вызывать аллергическую реакцию'], usageInstructions: ['Разбавлять перед использованием'], icon: '🌼', category: 'Цветочные' },
  { name: 'Кардамон', color: '#8B4513', description: 'Согревающий и бодрящий аромат', benefits: ['Согревание', 'Бодрость'], cautions: [], usageInstructions: ['Добавлять в чай или использовать в диффузоре'], icon: '🌰', category: 'Пряные' },
  { name: 'Кассия', color: '#D2691E', description: 'Согревающий и укрепляющий аромат', benefits: ['Согревание', 'Укрепление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Пряные' },
  { name: 'Кедр', color: '#DEB887', description: 'Заземляющий и успокаивающий аромат', benefits: ['Заземление', 'Успокоение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌳', category: 'Древесные' },
  { name: 'Сельдерей', color: '#90EE90', description: 'Очищающий и тонизирующий аромат', benefits: ['Очищение', 'Тонизирование'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🥬', category: 'Травяные' },
  { name: 'Кинза', color: '#32CD32', description: 'Освежающий и стимулирующий аромат', benefits: ['Освежение', 'Стимуляция'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Корица', color: '#D2691E', description: 'Согревающий и стимулирующий аромат', benefits: ['Согревание', 'Стимуляция'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌰', category: 'Пряные' },
  { name: 'Цитронелла', color: '#FAFAD2', description: 'Освежающий и отпугивающий насекомых аромат', benefits: ['Освежение', 'Отпугивание насекомых'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌾', category: 'Травяные' },
  { name: 'Шалфей мускатный', color: '#8FBC8F', description: 'Успокаивающий и балансирующий аромат', benefits: ['Успокоение', 'Балансировка'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Гвоздика', color: '#8B4513', description: 'Согревающий и стимулирующий аромат', benefits: ['Согревание', 'Стимуляция'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌼', category: 'Пряные' },
  { name: 'Копайба', color: '#CD853F', description: 'Успокаивающий и противовоспалительный аромат', benefits: ['Успокоение', 'Противовоспаление'], cautions: [], usageInstructions: ['Разбавлять перед использованием'], icon: '🌳', category: 'Древесные' },
  { name: 'Кориандр', color: '#9ACD32', description: 'Освежающий и тонизирующий аромат', benefits: ['Освежение', 'Тонизирование'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌱', category: 'Пряные' },
  { name: 'Кипарис', color: '#2E8B57', description: 'Освежающий и укрепляющий аромат', benefits: ['Освежение', 'Укрепление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌲', category: 'Древесные' },
  { name: 'Эвкалипт', color: '#00CED1', description: 'Очищающий и прохладный аромат', benefits: ['Очищение', 'Прохлада'], cautions: ['Не использовать во время беременности'], usageInstructions: ['Разбавлять перед использованием'], icon: '🌳', category: 'Древесные' },
  { name: 'Фенхель', color: '#7CFC00', description: 'Освежающий и тонизирующий аромат', benefits: ['Освежение', 'Тонизирование'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌱', category: 'Травяные' },
  { name: 'Ладан', color: '#DEB887', description: 'Успокаивающий и медитативный аромат', benefits: ['Успокоение', 'Медитация'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🕯️', category: 'Древесные' },
  { name: 'Герань', color: '#FF69B4', description: 'Балансирующий и успокаивающий аромат', benefits: ['Балансировка', 'Успокоение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌸', category: 'Цветочные' },
  { name: 'Имбирь', color: '#FF8C00', description: 'Согревающий и стимулирующий аромат', benefits: ['Согревание', 'Стимуляция'], cautions: [], usageInstructions: ['Добавлять в чай или использовать в диффузоре'], icon: '🥭', category: 'Пряные' },
  { name: 'Грейпфрут', color: '#FFA07A', description: 'Освежающий и бодрящий аромат', benefits: ['Освежение', 'Бодрость'], cautions: ['Фототоксичность'], usageInstructions: ['Разбавлять перед нанесением на кожу'], icon: '🍊', category: 'Цитрусовые' },
  { name: 'Бессмертник', color: '#FFD700', description: 'Успокаивающий и восстанавливающий аромат', benefits: ['Успокоение', 'Восстановление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌼', category: 'Цветочные' },
  { name: 'Можжевельник', color: '#2E8B57', description: 'Очищающий и тонизирующий аромат', benefits: ['Очищение', 'Тонизирование'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Древесные' },
  { name: 'Лаванда', color: '#8A2BE2', description: 'Успокаивающий и расслабляющий аромат', benefits: ['Успокоение', 'Расслабление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '💜', category: 'Цветочные' },
  { name: 'Лимон', color: '#FFD700', description: 'Энергичный и поднимающий настроение аромат', benefits: ['Энергия', 'Поднятие настроения'], cautions: ['Фототоксичность'], usageInstructions: ['Разбавлять перед нанесением на кожу'], icon: '🍋', category: 'Цитрусовые' },
  { name: 'Лемонграсс', color: '#ADFF2F', description: 'Освежающий и тонизирующий аромат', benefits: ['Освежение', 'Тонизирование'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌾', category: 'Травяные' },
  { name: 'Лайм', color: '#32CD32', description: 'Освежающий и бодрящий аромат', benefits: ['Освежение', 'Бодрость'], cautions: ['Фототоксичность'], usageInstructions: ['Разбавлять перед нанесением на кожу'], icon: '🍋', category: 'Цитрусовые' },
  { name: 'Майоран', color: '#98FB98', description: 'Успокаивающий и согревающий аромат', benefits: ['Успокоение', 'Согревание'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Мелисса', color: '#7CFC00', description: 'Успокаивающий и поднимающий настроение аромат', benefits: ['Успокоение', 'Поднятие настроения'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🍃', category: 'Травяные' },
  { name: 'Мирра', color: '#8B4513', description: 'Успокаивающий и медитативный аромат', benefits: ['Успокоение', 'Медитация'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🕯️', category: 'Древесные' },
  { name: 'Орегано', color: '#556B2F', description: 'Очищающий и укрепляющий аромат', benefits: ['Очищение', 'Укрепление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Пачули', color: '#8B4513', description: 'Заземляющий и успокаивающий аромат', benefits: ['Заземление', 'Успокоение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🍂', category: 'Древесные' },
  { name: 'Перечная мята', color: '#00FF7F', description: 'Освежающий и бодрящий аромат', benefits: ['Освежение', 'Бодрость'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🍃', category: 'Травяные' },
  { name: 'Петитгрейн', color: '#FFA500', description: 'Освежающий и успокаивающий аромат', benefits: ['Освежение', 'Успокоение'], cautions: [], usageInstructions: ['Разбавлять перед использованием'], icon: '🍊', category: 'Цитрусовые' },
  { name: 'Розовый перец', color: '#FF69B4', description: 'Согревающий и стимулирующий аромат', benefits: ['Согревание', 'Стимуляция'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌶️', category: 'Пряные' },
  { name: 'Римская ромашка', color: '#F0E68C', description: 'Успокаивающий и расслабляющий аромат', benefits: ['Успокоение', 'Расслабление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌼', category: 'Цветочные' },
  { name: 'Розмарин', color: '#228B22', description: 'Стимулирующий и укрепляющий аромат', benefits: ['Стимуляция', 'Укрепление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌱', category: 'Травяные' },
  { name: 'Сандаловое дерево', color: '#8B4513', description: 'Заземляющий и успокаивающий аромат', benefits: ['Заземление', 'Успокоение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌲', category: 'Древесные' },
  { name: 'Чайное дерево', color: '#008080', description: 'Очищающий и антисептический аромат', benefits: ['Очищение', 'Антисептика'], cautions: ['Может раздражать кожу'], usageInstructions: ['Разбавлять перед использованием'], icon: '🍵', category: 'Древесные' },
  { name: 'Тимьян', color: '#556B2F', description: 'Очищающий и укрепляющий аромат', benefits: ['Очищение', 'Укрепление'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌿', category: 'Травяные' },
  { name: 'Ветивер', color: '#8B4513', description: 'Заземляющий и успокаивающий аромат', benefits: ['Заземление', 'Успокоение'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌾', category: 'Травяные' },
  { name: 'Дикий апельсин', color: '#FFA500', description: 'Бодрящий и поднимающий настроение аромат', benefits: ['Бодрость', 'Поднятие настроения'], cautions: ['Фототоксичность'], usageInstructions: ['Разбавлять перед нанесением на кожу'], icon: '🍊', category: 'Цитрусовые' },
  { name: 'Иланг-иланг', color: '#FF1493', description: 'Чувственный и расслабляющий аромат', benefits: ['Расслабление', 'Чувственность'], cautions: [], usageInstructions: ['Использовать в диффузоре'], icon: '🌼', category: 'Цветочные' },
]

export default function EssentialOilGuide() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [selectedOil, setSelectedOil] = useState<EssentialOil | null>(null)
  const [oilInfo, setOilInfo] = useState<{ properties: string[], uses: string[] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredOils = essentialOils.filter(oil =>
    (selectedCategory === 'Все' || oil.category === selectedCategory) &&
    oil.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchOilInfo = async (oilName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/oil-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oilName }),
      })
      const data = await response.json()
      setOilInfo(data)
    } catch (error) {
      console.error('Error fetching oil info:', error)
      setOilInfo(null)
      toast.error('Не удалось загрузить информацию о масле')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <CardTitle className="text-2xl font-bold text-center">Гид по эфирным маслам</CardTitle>
        <CardDescription className="text-center text-white/80">
          Откройте для себя мир ароматерапии и натуральных решений
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск масла..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs defaultValue="Все" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className="px-4 py-2"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredOils.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-3 text-center py-8 text-gray-500"
                >
                  В этой категории нет масел или они не соответствуют поисковому запросу.
                </motion.div>
              )}
              {filteredOils.map((oil) => (
                <motion.div
                  key={oil.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dialog onOpenChange={(open) => {
                    if (open) {
                      setSelectedOil(oil)
                      fetchOilInfo(oil.name)
                    } else {
                      setSelectedOil(null)
                      setOilInfo(null)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{oil.icon}</span>
                            <Badge 
                              variant="outline" 
                              style={{
                                backgroundColor: `${oil.color}20`,
                                color: oil.color,
                                borderColor: oil.color
                              }}
                            >
                              {oil.name}
                            </Badge>
                            <Badge variant="secondary" className="mt-2">
                              {oil.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{oil.description}</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <span className="text-2xl mr-2">{selectedOil?.icon}</span>
                          <span style={{ color: selectedOil?.color }}>{selectedOil?.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-[200px]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                          </div>
                        ) : oilInfo ? (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                Свойства:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {oilInfo.properties.map((prop, index) => (
                                  <li key={index} className="text-sm">{prop}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Применение:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {oilInfo.uses.map((use, index) => (
                                  <li key={index} className="text-sm">{use}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                Польза:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedOil?.benefits.map((benefit, index) => (
                                  <li key={index} className="text-sm">{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Меры предосторожности:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedOil?.cautions.map((caution, index) => (
                                  <li key={index} className="text-sm">{caution}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                Инструкции по применению:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedOil?.usageInstructions.map((instruction, index) => (
                                  <li key={index} className="text-sm">{instruction}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[200px] text-center text-gray-500">
                            <div>
                              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                              <p>Не удалось загрузить информацию о масле.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

