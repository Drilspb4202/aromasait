import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 text-center"
    >
      {icon && <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">{icon}</div>}
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </motion.div>
  )
}

