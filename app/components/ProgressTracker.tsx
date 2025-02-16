'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Info, Download, Upload, Bell, AlertTriangle, Loader2, Target, TrendingUp, BarChart2, Activity, Brain } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTheme } from 'next-themes'

interface MoodMetric {
  name: string
  value: number
  color: string
  icon: React.ReactNode
  description: string
}

const moodMetrics: MoodMetric[] = [
  { 
    name: 'Энергичность', 
    value: 0, 
    color: '#FFD700',
    icon: <Activity className="h-5 w-5" />,
    description: 'Уровень физической и ментальной энергии'
  },
  { 
    name: 'Счастье', 
    value: 0, 
    color: '#4CAF50',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'Общее ощущение благополучия и радости'
  },
  { 
    name: 'Спокойствие', 
    value: 0, 
    color: '#2196F3',
    icon: <Brain className="h-5 w-5" />,
    description: 'Уровень внутреннего спокойствия и умиротворения'
  },
  { 
    name: 'Стресс', 
    value: 0, 
    color: '#FF5722',
    icon: <AlertTriangle className="h-5 w-5" />,
    description: 'Уровень напряжения и тревоги'
  },
  { 
    name: 'Тревожность', 
    value: 0, 
    color: '#9C27B0',
    icon: <Activity className="h-5 w-5" />,
    description: 'Уровень беспокойства и нервозности'
  },
  { 
    name: 'Концентрация', 
    value: 0, 
    color: '#3F51B5',
    icon: <Target className="h-5 w-5" />,
    description: 'Способность фокусироваться и концентрироваться'
  },
  { 
    name: 'Креативность', 
    value: 0, 
    color: '#FF4081',
    icon: <Brain className="h-5 w-5" />,
    description: 'Уровень творческого мышления'
  },
  { 
    name: 'Мотивация', 
    value: 0, 
    color: '#FF9800',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'Уровень желания достигать целей'
  },
  { 
    name: 'Качество сна', 
    value: 0, 
    color: '#607D8B',
    icon: <Activity className="h-5 w-5" />,
    description: 'Качество и продолжительность сна'
  },
  { 
    name: 'Социальная связь', 
    value: 0, 
    color: '#00BCD4',
    icon: <BarChart2 className="h-5 w-5" />,
    description: 'Уровень социального взаимодействия'
  }
]

export default function ProgressTracker() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('week')
  const [moodData, setMoodData] = useState<MoodMetric[]>(moodMetrics)
  const [trendData, setTrendData] = useState<any[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]); 
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Имитация загрузки данных
      await new Promise(resolve => setTimeout(resolve, 1000))
      generateMockData()
    } catch (err) {
      setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    // Генерация данных для трендов
    const today = new Date()
    let startDate: Date
    let endDate = today

    if (timeRange === 'week') {
      startDate = subDays(today, 7)
    } else if (timeRange === 'month') {
      startDate = subDays(today, 30)
    } else {
      startDate = subDays(today, 90)
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const trends = days.map(day => ({
      date: format(day, 'dd.MM.yyyy'),
      ...moodMetrics.reduce((acc, metric) => ({
        ...acc,
        [metric.name]: Math.random() * 10
      }), {})
    }))

    setTrendData(trends)

    // Обновление средних показателей
    const newMoodData = moodMetrics.map(metric => ({
      ...metric,
      value: Math.random() * 10
    }))
    setMoodData(newMoodData)
  }

  const exportData = () => {
    try {
      const data = {
        moodData,
        trendData,
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mood-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Данные успешно экспортированы')
    } catch (err) {
      toast.error('Ошибка при экспорте данных')
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setMoodData(data.moodData)
          setTrendData(data.trendData)
          toast.success('Данные успешно импортированы')
        } catch (err) {
          toast.error('Ошибка при импорте данных')
        }
      }
      reader.readAsText(file)
    }
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Общий прогресс</h2>
          <p className="text-muted-foreground">
            Анализ вашего эмоционального состояния за {timeRange === 'week' ? 'неделю' : timeRange === 'month' ? 'месяц' : 'квартал'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <label htmlFor="import-file">
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Импорт
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {moodData.map((metric) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon}
                    <h3 className="font-medium">{metric.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                  </div>
                  <Progress value={metric.value * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Топ настроений</CardTitle>
            <CardDescription>Ваши самые сильные показатели</CardDescription>
          </CardHeader>
          <CardContent>
            {moodData
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <span>{metric.name}</span>
                    </div>
                    <span className="font-bold">{metric.value.toFixed(1)}</span>
                  </div>
                  <Progress 
                    value={metric.value * 10} 
                    className="h-2"
                    style={{ backgroundColor: `${metric.color}20` }}
                  />
                </motion.div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Требуют внимания</CardTitle>
            <CardDescription>Показатели для улучшения</CardDescription>
          </CardHeader>
          <CardContent>
            {moodData
              .sort((a, b) => a.value - b.value)
              .slice(0, 3)
              .map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <span>{metric.name}</span>
                    </div>
                    <span className="font-bold">{metric.value.toFixed(1)}</span>
                  </div>
                  <Progress 
                    value={metric.value * 10} 
                    className="h-2"
                    style={{ backgroundColor: `${metric.color}20` }}
                  />
                </motion.div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTrendsTab = () => {
    const toggleMoodSelection = (mood: string) => {
      setSelectedMoods(prev => 
        prev.includes(mood) 
          ? prev.filter(m => m !== mood)
          : [...prev, mood]
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Тренды настроения</h2>
          <p className="text-muted-foreground">
            Динамика изменения ваших показателей во времени
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                    stroke={theme === 'dark' ? '#4B5563' : '#9CA3AF'}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                    stroke={theme === 'dark' ? '#4B5563' : '#9CA3AF'}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    onClick={(e) => toggleMoodSelection(e.dataKey)}
                    formatter={(value, entry, index) => (
                      <span style={{ color: theme === 'dark' ? '#E5E7EB' : '#4B5563' }}>{value}</span>
                    )}
                  />
                  {moodMetrics.map((metric) => (
                    <Line
                      key={metric.name}
                      type="monotone"
                      dataKey={metric.name}
                      stroke={metric.color}
                      strokeWidth={selectedMoods.length === 0 || selectedMoods.includes(metric.name) ? 2 : 0.5}
                      dot={selectedMoods.length === 0 || selectedMoods.includes(metric.name) ? { r: 4, strokeWidth: 2 } : false}
                      activeDot={selectedMoods.length === 0 || selectedMoods.includes(metric.name) ? { r: 6, strokeWidth: 2 } : false}
                      opacity={selectedMoods.length === 0 || selectedMoods.includes(metric.name) ? 1 : 0.3}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {moodMetrics.map((metric) => (
            <Badge
              key={metric.name}
              variant={selectedMoods.includes(metric.name) ? 'default' : 'outline'}
              className="cursor-pointer transition-all"
              onClick={() => toggleMoodSelection(metric.name)}
              style={{
                backgroundColor: selectedMoods.includes(metric.name) ? metric.color : 'transparent',
                borderColor: metric.color,
                color: selectedMoods.includes(metric.name) ? '#fff' : metric.color
              }}
            >
              <span className="flex items-center gap-1">
                {metric.icon}
                {metric.name}
              </span>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderAnalysisTab = () => {
    const pieData = moodData.map(metric => ({
      name: metric.name,
      value: metric.value,
      color: metric.color
    }));

    const handlePieClick = (data: any, index: number) => {
      setSelectedMood(selectedMood === data.name ? null : data.name);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Анализ настроений</h2>
          <p className="text-muted-foreground">
            Детальный анализ ваших эмоциональных показателей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Распределение настроений</CardTitle>
              <CardDescription>Текущий баланс показателей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      onClick={handlePieClick}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border p-2 rounded shadow-lg">
                              <p className="font-bold">{data.name}</p>
                              <p>Значение: {data.value.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Детали настроения</CardTitle>
              <CardDescription>
                {selectedMood 
                  ? `Подробная информация о "${selectedMood}"`
                  : "Выберите настроение на диаграмме для подробностей"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMood ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: moodData.find(m => m.name === selectedMood)?.color }}
                    />
                    <h3 className="text-xl font-semibold">{selectedMood}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {moodData.find(m => m.name === selectedMood)?.description}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Текущее значение:</h4>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={moodData.find(m => m.name === selectedMood)?.value ?? 0 * 10} 
                        className="w-full"
                      />
                      <span className="font-bold">
                        {(moodData.find(m => m.name === selectedMood)?.value ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  Выберите настроение на диаграмме слева для просмотра деталей
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderComparisonTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Сравнение периодов</h2>
        <p className="text-muted-foreground">
          Сравнение текущих показателей с предыдущим периодом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moodData.map((metric) => {
          const prevValue = Math.random() * 10
          const change = metric.value - prevValue
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {metric.icon}
                    <h3 className="font-medium">{metric.name}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Текущий период:</p>
                      <p className="text-2xl font-bold">{metric.value.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Предыдущий период:</p>
                      <p className="text-2xl font-bold">{prevValue.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Изменение:</p>
                      <p className={`text-2xl font-bold ${
                        change > 0 ? 'text-green-500' : 
                        change < 0 ? 'text-red-500' : 
                        'text-gray-500'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={metric.value * 10} 
                    className="h-2 mt-4"
                    style={{ backgroundColor: `${metric.color}20` }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  const renderInsightsTab = () => {
    const insights = [
      {
        title: 'Лучший показатель',
        description: `Ваше лучшее настроение - ${moodData.sort((a, b) => b.value - a.value)[0].name} со значением ${moodData.sort((a, b) => b.value - a.value)[0].value.toFixed(1)}`,
        icon: <TrendingUp className="h-5 w-5 text-green-500" />
      },
      {
        title: 'Требует внимания',
        description: `${moodData.sort((a, b) => a.value - b.value)[0].name} имеет самый низкий показатель (${moodData.sort((a, b) => a.value - b.value)[0].value.toFixed(1)}). Рекомендуется уделить этому аспекту больше внимания.`,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
      },
      {
        title: 'Общий тренд',
        description: 'Наблюдается положительная динамика в большинстве показателей за последний период.',
        icon: <BarChart2 className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Рекомендации',
        description: 'Попробуйте уделить больше внимания практикам осознанности и регулярным физическим упражнениям для улучшения общего состояния.',
        icon: <Brain className="h-5 w-5 text-purple-500" />
      }
    ]

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Инсайты и рекомендации</h2>
          <p className="text-muted-foreground">
            Анализ ваших данных и персонализированные рекомендации
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {insight.icon}
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Персонализированный план действий</CardTitle>
            <CardDescription>
              Рекомендации на основе анализа ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodData
                .sort((a, b) => a.value - b.value)
                .slice(0, 3)
                .map((metric, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      {metric.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Рекомендуется уделить особое внимание этому аспекту. 
                        Текущий показатель ({metric.value.toFixed(1)}) можно улучшить через регулярные практики и упражнения.
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Трекер прогресса</CardTitle>
          <CardDescription>
            Анализ и визуализация вашего эмоционального состояния
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
            <SelectItem value="quarter">Квартал</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="trends">Тренды</TabsTrigger>
              <TabsTrigger value="analysis">Анализ</TabsTrigger>
              <TabsTrigger value="comparison">Сравнение</TabsTrigger>
              <TabsTrigger value="insights">Инсайты</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
                <TabsContent value="trends">{renderTrendsTab()}</TabsContent>
                <TabsContent value="analysis">{renderAnalysisTab()}</TabsContent>
                <TabsContent value="comparison">{renderComparisonTab()}</TabsContent>
                <TabsContent value="insights">{renderInsightsTab()}</TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

