'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Smile, BarChart2, Clock, Utensils, Feather, Droplet, Users, Bot, TrendingUp, Award, ChevronRight, Clipboard, Brain } from 'lucide-react'

interface SideNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { value: 'assessment', label: 'Оценка', icon: Smile },
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
]

export default function SideNav({ activeTab, setActiveTab, isOpen, onClose }: SideNavProps) {
  return (
    <motion.div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="p-4">
        <Button onClick={onClose} variant="ghost" className="mb-4 w-full justify-start">
          <ChevronRight className="mr-2 h-4 w-4" />
          Закрыть меню
        </Button>
        <nav>
          {navItems.map((item) => (
            <Button
              key={item.value}
              onClick={() => {
                setActiveTab(item.value)
                onClose()
              }}
              variant={activeTab === item.value ? 'default' : 'ghost'}
              className="w-full justify-start mb-2"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}

