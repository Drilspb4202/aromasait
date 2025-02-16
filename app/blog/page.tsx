"use client"

import { useState } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDaysIcon, ArrowRight, Search, BookOpen, Home } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  image: string
  category: string
  tags: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Разбудите свою энергию с помощью эфирных масел: секреты ароматерапии для бодрости и вдохновения",
    excerpt:
      "Усталость и апатия? Откройте для себя волшебный мир ароматерапии и зарядитесь энергией природы с помощью эфирных масел!",
    content:
      "Чувствуете упадок сил? Ароматерапия может стать вашим секретным оружием в борьбе с усталостью и апатией. Эфирные масла, такие как лимон, мята перечная и розмарин, обладают бодрящими свойствами и способны мгновенно поднять настроение и зарядить энергией. Добавьте несколько капель в диффузор, аромалампу или просто вдохните аромат прямо из флакона — и почувствуйте, как пробуждается ваша внутренняя сила. Ароматерапия — это не только приятный способ расслабиться, но и мощный инструмент для повышения продуктивности и вдохновения.",
    date: "2024-02-20",
    image: "https://i.ibb.co/TgJkkcz/image-fx-4.png",
    category: "Ароматерапия",
    tags: ["энергия", "бодрость", "ароматерапия", "эфирные масла"],
  },
  {
    id: 2,
    title: "Вкусные и полезные: 5 веганских рецептов, которые понравятся даже мясоедам",
    excerpt:
      "Разрушаем мифы о пресной веганской кухне! Попробуйте наши 5 рецептов и убедитесь, что веганская еда может быть вкусной, сытной и разнообразной.",
    content:
      "Веганская кухня — это не только про пользу для здоровья и этичное отношение к животным, но и про невероятное разнообразие вкусов и ароматов. Попробуйте приготовить наши 5 веганских рецептов, которые покорят даже самых заядлых мясоедов: от сочного бургера из чечевицы до нежного шоколадного мусса из авокадо. Убедитесь сами, что веганская еда может быть не только полезной, но и невероятно вкусной!",
    date: "2024-02-15",
    image: "https://i.ibb.co/12TPHsf/image-fx-5.png",
    category: "Веганство",
    tags: ["веганство", "рецепты", "вкусно", "полезно"],
  },
  {
    id: 3,
    title: "Медитация для начинающих: ваш путь к спокойствию и гармонии",
    excerpt:
      "Стресс и тревога? Медитация — ваш ключ к обретению внутреннего покоя. Узнайте, как начать медитировать и изменить свою жизнь к лучшему.",
    content:
      "В современном мире, полном стрессов и тревог, медитация становится настоящим спасением. Она помогает успокоить ум, снять напряжение и обрести внутреннюю гармонию.  Не знаете, с чего начать? Наше руководство для начинающих поможет вам сделать первые шаги в мире медитации. Узнайте, как правильно дышать, концентрироваться и достигать состояния глубокого расслабления. Медитация — это не магия, а простой и эффективный способ улучшить качество своей жизни.",
    date: "2024-02-10",
    image: "https://i.ibb.co/4WjPJcV/image-fx-6.png",
    category: "Медитация",
    tags: ["медитация", "спокойствие", "гармония", "начинающие"],
  },
  {
    id: 4,
    title: "Гармония вкуса и аромата: как эфирные масла дополняют веганскую кухню",
    excerpt:
      "Откройте для себя новые грани вкуса и аромата, сочетая веганские блюда с эфирными маслами. Поднимите свои кулинарные шедевры на новый уровень!",
    content:
      "Эфирные масла могут стать не только прекрасным дополнением к вашей ароматерапевтической практике, но и секретным ингредиентом на вашей кухне. Представьте, как нотки цитрусовых масел раскрываются в освежающем летнем салате, а пряные ароматы корицы и гвоздики добавляют глубину вашим любимым веганским десертам.  Экспериментируйте, добавляя каплю масла мяты в зеленый смузи или нотки лаванды в веганское мороженое. Позвольте эфирным маслам вдохновить вас на создание новых кулинарных шедевров!",
    date: "2024-02-25",
    image: "https://i.ibb.co/tPSc8hT/image-fx-7.png",
    category: "Веганство",
    tags: ["веганство", "ароматерапия", "эфирные масла", "кухня", "рецепты"],
  },
]

export default function BlogPage({}: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const categories = ["all", ...new Set(blogPosts.map((post) => post.category))].sort()

  const filteredPosts = blogPosts.filter((post) => {
    const categoryMatch = selectedCategory === "all" || post.category === selectedCategory
    const searchMatch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gradient-to-br from-[#c2e9fb] to-[#a7d2cb] relative">
      <div className="absolute inset-0">
        <Image
          src="https://i.ibb.co/4W2QJFV/image-fx-3.png"
          alt="background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="relative z-10">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-white">Наш блог</h1>
          <Link href="/" className="text-primary hover:underline text-lg font-medium text-center block mb-4">
            <div className="flex items-center justify-center gap-2">
              <Home className="h-5 w-5" />
              Вернуться на главную
            </div>
          </Link>
          <p className="text-gray-600 text-center text-white">
            Полезные статьи об ароматерапии, веганстве и здоровом образе жизни
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по блогу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Все категории" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 overflow-hidden bg-white/80 backdrop-blur-md"
                onClick={() => setSelectedPost(post)}
              >
                <CardHeader className="relative p-0">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-2 left-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      <CalendarDaysIcon className="mr-1 h-4 w-4" />
                      {post.date}
                    </span>
                    {/* Read More button to open the dialog */}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPost(post)
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Читать далее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedPost?.title}</DialogTitle>
              <div className="text-sm text-gray-500 mb-2 space-y-2">
                <div className="mb-4">
                  <img
                    src={selectedPost?.image || "/placeholder.svg"}
                    alt={selectedPost?.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <p className="text-sm text-gray-500 mb-2">{selectedPost?.date}</p>
              </div>
            </DialogHeader>
            <p className="text-gray-700">{selectedPost?.content}</p>
            <Link href="/blog" className="text-blue-500 hover:underline mt-4 block text-center">
              Вернуться к списку статей
            </Link>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

