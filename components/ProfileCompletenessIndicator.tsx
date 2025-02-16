import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfileCompletenessIndicatorProps {
  completeness: number
}

export function ProfileCompletenessIndicator({ completeness }: ProfileCompletenessIndicatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Заполненность профиля</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={completeness} className="w-full" />
        <p className="mt-2 text-sm text-gray-600">
          Ваш профиль заполнен на {completeness}%. Заполните все поля, чтобы получить максимум от приложения!
        </p>
      </CardContent>
    </Card>
  )
}

