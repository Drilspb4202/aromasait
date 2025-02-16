'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Smile, BarChart2, Utensils, Feather, Droplet, Bot, TrendingUp, Award, ClipboardList, Brain, ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
  { 
    group: "Основное",
    items: [
      { value: 'assessment', label: 'Оценка настроения', icon: Smile },
      { value: 'recommendations', label: 'Рекомендации', icon: BarChart2 },
      { value: 'progress', label: 'Прогресс', icon: TrendingUp },
    ]
  },
  {
    group: "Инструменты",
    items: [
      { value: 'recipes', label: 'Рецепты', icon: Utensils },
      { value: 'meditation', label: 'Медитация', icon: Feather },
      { value: 'aromatherapy', label: 'Ароматерапия', icon: Droplet },
      { value: 'habit-tracker', label: 'Трекер привычек', icon: ClipboardList },
    ]
  },
  {
    group: "AI и планирование",
    items: [
      { value: 'ai-assistant', label: 'AI-ассистент', icon: Bot },
      { value: 'smart-assistant', label: 'Умный ассистент', icon: Brain },
      { value: 'ai-coach', label: 'AI-коуч', icon: Brain },
    ]
  },
  {
    group: "Достижения",
    items: [
      { value: 'achievements', label: 'Достижения', icon: Award },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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

  const sidebarVariants = {
    open: {
      width: 256,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: {
      width: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  const itemVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        "fixed top-0 left-0 h-full bg-gradient-to-br from-background via-card to-background text-card-foreground shadow-lg z-40",
        "border-r border-border/10 backdrop-blur-sm",
        isOpen ? "w-64" : "w-0"
      )}
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      initial={false}
    >
      <div className="flex flex-col h-full py-4">
        <motion.div 
          className="flex items-center justify-between px-4 mb-8"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Aroma Balance
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-primary/10 rounded-full"
            aria-label={isOpen ? "Закрыть боковую панель" : "Открыть боковую панель"}
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300" 
              style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
          </Button>
        </motion.div>

        <div className="flex-1 overflow-y-auto px-3 space-y-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30">
          {menuItems.map((group, groupIndex) => (
            <motion.div 
              key={groupIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 px-2">
                <h3 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  {group.group}
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
              </div>
              {group.items.map((item) => (
                <motion.div
                  key={item.value}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    variant={activeTab === item.value ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full justify-start relative overflow-hidden group rounded-lg",
                      activeTab === item.value && "bg-primary/10 text-primary font-medium",
                      isOpen ? "px-4" : "px-2",
                      "transition-all duration-200 ease-in-out hover:translate-x-1"
                    )}
                    onClick={() => setActiveTab(item.value)}
                    onMouseEnter={() => setHoveredItem(item.value)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative z-10 flex items-center w-full">
                      <item.icon 
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isOpen ? "mr-3" : "mr-0",
                          activeTab === item.value ? "text-primary" : "text-muted-foreground group-hover:text-primary/80",
                          hoveredItem === item.value && "scale-110 rotate-3"
                        )} 
                      />
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            "font-medium transition-colors",
                            activeTab === item.value ? "text-primary" : "text-foreground/80"
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                    {activeTab === item.value && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-auto pt-4 px-4 border-t border-border/10"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 rounded-lg group transition-all duration-200 ease-in-out hover:translate-x-1"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-primary/80 transition-colors" />
            <span className="font-medium text-foreground/80 group-hover:text-primary/80 transition-colors">Настройки</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

