'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'

interface PortionAdjusterProps {
  servings: number
  onChange: (servings: number) => void
}

export default function PortionAdjuster({ servings, onChange }: PortionAdjusterProps) {
  const [portions, setPortions] = useState(servings)

  const handleChange = (newPortions: number) => {
    if (newPortions >= 1) {
      setPortions(newPortions)
      onChange(newPortions)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleChange(portions - 1)}
        disabled={portions <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={portions}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="w-16 text-center"
        min={1}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleChange(portions + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

