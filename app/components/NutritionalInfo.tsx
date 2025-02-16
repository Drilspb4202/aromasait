'use client'

import { motion } from 'framer-motion'

interface NutritionalInfoProps {
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export default function NutritionalInfo({ nutritionalInfo }: NutritionalInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <h3 className="font-bold text-lg mb-2">Nutritional Information</h3>
      <p>Calories: {nutritionalInfo.calories}</p>
      <p>Protein: {nutritionalInfo.protein}g</p>
      <p>Carbs: {nutritionalInfo.carbs}g</p>
      <p>Fat: {nutritionalInfo.fat}g</p>
    </motion.div>
  )
}

