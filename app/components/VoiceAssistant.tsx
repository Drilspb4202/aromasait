import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceAssistantProps {
  text: string
  isActive: boolean
  onToggle: () => void
  voice?: SpeechSynthesisVoice | null
}

export function VoiceAssistant({ text, isActive, onToggle, voice }: VoiceAssistantProps) {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    // Загружаем доступные голоса
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const russianVoices = voices.filter(voice => voice.lang.includes('ru'))
      setAvailableVoices(russianVoices)
      
      // Выбираем лучший голос
      const bestVoice = russianVoices.find(v => v.name.includes('Milena')) || 
                       russianVoices.find(v => v.name.includes('Google')) ||
                       russianVoices[0]
      
      if (bestVoice) {
        setCurrentVoice(bestVoice)
      }
    }

    // Подписываемся на событие загрузки голосов
    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    if (isActive && text && currentVoice) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = currentVoice
      utterance.rate = 0.9 // Немного замедляем для лучшего понимания
      utterance.pitch = 1.1 // Делаем голос чуть выше
      utterance.volume = 1.0
      window.speechSynthesis.speak(utterance)
    } else {
      window.speechSynthesis.cancel()
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text, isActive, currentVoice])

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={isActive ? 'text-orange-500 border-orange-500' : ''}
      >
        {isActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>
      {isActive && currentVoice && (
        <span className="text-sm text-gray-500">
          Голос: {currentVoice.name}
        </span>
      )}
    </div>
  )
} 