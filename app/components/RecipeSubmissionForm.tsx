'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { Plus, Minus } from 'lucide-react'

const recipeSchema = z.object({
  name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  category: z.enum(['Завтрак', 'Обед', 'Ужин', 'Перекус', 'Десерт']),
  prepTime: z.number().min(1, 'Время подготовки должно быть больше 0'),
  cookTime: z.number().min(1, 'Время приготовления должно быть больше 0'),
  servings: z.number().min(1, 'Количество порций должно быть больше 0'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(z.string().min(1, 'Ингредиент не может быть пустым')),
  instructions: z.array(z.string().min(1, 'Шаг не может быть пустым')),
  tags: z.array(z.string())
})

type RecipeFormValues = z.infer<typeof recipeSchema>

export default function RecipeSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Завтрак',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      difficulty: 'medium',
      ingredients: [''],
      instructions: [''],
      tags: [],
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions",
  })

  const onSubmit = async (data: RecipeFormValues) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Пользователь не авторизован')

      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert({
          ...data,
          user_id: user.id,
          prep_time: data.prepTime,
          cook_time: data.cookTime,
          ingredients: JSON.stringify(data.ingredients),
          instructions: JSON.stringify(data.instructions),
          rating: 0,
          image: '/placeholder.svg?height=300&width=300',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Рецепт успешно добавлен!')
      form.reset()
    } catch (error) {
      console.error('Error submitting recipe:', error)
      toast.error('Не удалось добавить рецепт. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Пример заполнения формы для демонстрации
  const fillFormWithExample = () => {
    form.reset({
      name: "Веганский Киш с Тофу и Овощами",
      description: "Нежный и сытный киш с хрустящей корочкой и кремовой начинкой из тофу и сезонных овощей.",
      category: "Обед",
      prepTime: 20,
      cookTime: 40,
      servings: 6,
      difficulty: "medium",
      ingredients: [
        "1 готовая веганская основа для пирога",
        "300 г твердого тофу",
        "1/2 чашки растительного молока",
        "1/4 чашки пищевых дрожжей",
        "2 ст. л. кукурузного крахмала",
        "1 ч. л. куркумы",
        "1 ч. л. соли",
        "1/4 ч. л. черного перца",
        "1 красный болгарский перец, нарезанный",
        "1 цуккини, тонко нарезанный",
        "1 чашка шпината",
        "1/4 чашки нарезанного зеленого лука"
      ],
      instructions: [
        "Разогрейте духовку до 180°C.",
        "Выложите основу для пирога в форму для выпечки диаметром 23 см.",
        "В блендере смешайте тофу, растительное молоко, пищевые дрожжи, кукурузный крахмал, куркуму, соль и перец до однородной массы.",
        "Выложите нарезанные овощи на основу для пирога.",
        "Залейте овощи смесью из тофу.",
        "Выпекайте 40-45 минут, пока верх не станет золотистым, а начинка не застынет.",
        "Дайте остыть 10 минут перед подачей."
      ],
      tags: ["веганский", "безмолочный", "высокобелковый"]
    });
  };

  // Добавьте кнопку для заполнения формы примером
  const ExampleButton = () => (
    <Button type="button" onClick={fillFormWithExample} className="mb-4">
      Заполнить пример рецепта
    </Button>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ExampleButton />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название рецепта</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Завтрак">Завтрак</SelectItem>
                  <SelectItem value="Обед">Обед</SelectItem>
                  <SelectItem value="Ужин">Ужин</SelectItem>
                  <SelectItem value="Перекус">Перекус</SelectItem>
                  <SelectItem value="Десерт">Десерт</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время подготовки (мин)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время приготовления (мин)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество порций</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сложность</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сложность" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">Легко</SelectItem>
                  <SelectItem value="medium">Средне</SelectItem>
                  <SelectItem value="hard">Сложно</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Ингредиенты</FormLabel>
          {ingredientFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`ingredients.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendIngredient('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить ингредиент
          </Button>
        </div>

        <div>
          <FormLabel>Инструкции</FormLabel>
          {instructionFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`instructions.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2 mt-2">
                      <Textarea {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendInstruction('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить шаг
          </Button>
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Теги (через запятую)</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))} />
              </FormControl>
              <FormDescription>
                Например: вегетарианское, безглютеновое, низкокалорийное
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Добавить рецепт'}
        </Button>
      </form>
    </Form>
  )
}

