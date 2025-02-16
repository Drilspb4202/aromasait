import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface ProfileOverviewProps {
  profile: {
    username: string
    full_name: string
    avatar_url: string
    favorite_oils: string[]
    vegan_experience: string
    dietary_restrictions: string[]
    activity_level: string
    bio: string
    notification_preferences: {
      email: boolean
      push: boolean
    }
  }
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.full_name}</CardTitle>
            <p className="text-sm text-gray-500">@{profile.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">О себе</h3>
            <p className="text-sm text-gray-600">{profile.bio || 'Биография не указана'}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Любимые масла</h3>
            <div className="flex flex-wrap gap-2">
              {profile.favorite_oils.map((oil) => (
                <Badge key={oil} variant="secondary">{oil}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Опыт веганства</h3>
            <p className="text-sm text-gray-600">{profile.vegan_experience}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Диетические ограничения</h3>
            <div className="flex flex-wrap gap-2">
              {profile.dietary_restrictions.map((restriction) => (
                <Badge key={restriction} variant="outline">{restriction}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Уровень активности</h3>
            <p className="text-sm text-gray-600">{profile.activity_level}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Настройки уведомлений</h3>
            <p className="text-sm text-gray-600">
              Email: {profile.notification_preferences.email ? 'Включено' : 'Выключено'}<br />
              Push: {profile.notification_preferences.push ? 'Включено' : 'Выключено'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

