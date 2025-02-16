'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchShoppingList()
  }, [])

  const fetchShoppingList = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('shopping_list')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      setItems(data as ShoppingItem[])
    } catch (error) {
      console.error('Error fetching shopping list:', error)
      toast.error('Failed to load shopping list')
    } finally {
      setLoading(false)
    }
  }

  const addItem = async () => {
    if (!newItem.name) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('shopping_list')
        .insert({
          user_id: user.id,
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          checked: false,
        })
        .select()

      if (error) throw error

      setItems([...items, data[0] as ShoppingItem])
      setNewItem({ name: '', quantity: 1, unit: '' })
      toast.success('Item added to shopping list')
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item to shopping list')
    }
  }

  const toggleItem = async (id: string) => {
    try {
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
      setItems(updatedItems)

      const { error } = await supabase
        .from('shopping_list')
        .update({ checked: !items.find(item => item.id === id)?.checked })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error toggling item:', error)
      toast.error('Failed to update item')
    }
  }

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
      toast.success('Item removed from shopping list')
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item from shopping list')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            className="w-20"
          />
          <Input
            placeholder="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="w-20"
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-2 bg-secondary rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className={item.checked ? 'line-through text-gray-500' : ''}>
                    {item.name} - {item.quantity} {item.unit}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

