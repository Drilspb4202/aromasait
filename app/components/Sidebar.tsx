'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from "@/lib/utils"
import { Smile, BarChart2, Clock, Utensils, Feather, Droplet, Users, Bot, TrendingUp, Award, Clipboard, Brain, ChevronLeft, ChevronRight, Calendar, Settings } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
  { value: 'assessment', label: 'Оценка настроения', icon: Smile },
  { value: 'recommendations', label: 'Рекомендации', icon: BarChart2 },
  { value: 'history', label: 'История', icon: Clock },
  { value: 'recipes', label: 'Рецепты', icon: Utensils },
  { value: 'meditation', label: 'Медитация', icon: Feather },
  { value: 'aromatherapy', label: 'Ароматерапия', icon: Droplet },
  { value: 'social', label: 'Сообщество', icon: Users },
  { value: 'ai-assistant', label: 'AI-ассистент', icon: Bot },
  { value: 'progress', label: 'Прогресс', icon: TrendingUp },
  { value: 'achievements', label: 'Достижения', icon: Award },
  { value: 'habit-tracker', label: 'Трекер привычек', icon: Clipboard },
  { value: 'smart-assistant', label: 'Умный ассистент', icon: Brain },
  { value: 'ai-coach', label: 'AI-коуч', icon: Brain },
  { value: 'calendar', label: 'Календарь', icon: Calendar },
]

export default function Sidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev + 1) % menuItems.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => (prev - 1 + menuItems.length) % menuItems.length)
          break
        case 'Enter':
          if (focusedIndex !== -1) {
            setActiveTab(menuItems[focusedIndex].value)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setActiveTab, focusedIndex])

  useEffect(() => {
    if (focusedIndex !== -1 && sidebarRef.current) {
      const focusedElement = sidebarRef.current.querySelector(`[data-index="${focusedIndex}"]`) as HTMLElement
      if (focusedElement) {
        focusedElement.focus()
      }
    }
  }, [focusedIndex])

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        "fixed top-0 left-0 h-full bg-card text-card-foreground shadow-lg z-40 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0"
      )}
      initial={false}
      animate={{ width: isOpen ? 256 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">АромаВеган</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-accent"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    activeTab === item.value && "bg-accent text-accent-foreground",
                    !isOpen && "px-2"
                  )}
                  onClick={() => setActiveTab(item.value)}
                  onFocus={() => setFocusedIndex(index)}
                  data-index={index}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className={cn("transition-opacity", !isOpen && "opacity-0")}>
                    {item.label}
                  </span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-5 w-5 mr-2" />
            <span className={cn("transition-opacity", !isOpen && "opacity-0")}>
              Настройки
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

