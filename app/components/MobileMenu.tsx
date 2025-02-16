'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Smile, BarChart2, Clock, Utensils, Feather, Droplet, Users, Bot, TrendingUp, Award } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
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
]

export default function MobileMenu({ isOpen, activeTab, setActiveTab }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-purple-700 overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant={activeTab === item.value ? 'secondary' : 'ghost'}
                  className={`w-full justify-start text-left py-3 ${
                    activeTab === item.value ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(item.value)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

