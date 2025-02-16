'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'

interface Event {
  id: string
  date: Date
  title: string
  type: 'aromatherapy' | 'meal'
  details: string
}

export default function PlanningCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    date: new Date(),
    title: '',
    type: 'aromatherapy',
    details: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setNewEvent(prev => ({ ...prev, date: date || new Date() }))
    setIsDialogOpen(true)
  }

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error('Пожалуйста, введите название события')
      return
    }
    const event: Event = {
      ...newEvent,
      id: Date.now().toString()
    }
    setEvents([...events, event])
    setIsDialogOpen(false)
    toast.success('Событие добавлено')
    setNewEvent({
      date: new Date(),
      title: '',
      type: 'aromatherapy',
      details: ''
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Календарь планирования</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border shadow"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">События на {selectedDate?.toLocaleDateString()}</h3>
            {getEventsForDate(selectedDate || new Date()).map(event => (
              <div key={event.id} className="mb-4 p-4 border rounded-md">
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.type === 'aromatherapy' ? 'Ароматерапия' : 'Прием пищи'}</p>
                <p className="text-sm">{event.details}</p>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новое событие</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Название
                </Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Тип
                </Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value: 'aromatherapy' | 'meal') => setNewEvent({ ...newEvent, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип события" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aromatherapy">Ароматерапия</SelectItem>
                    <SelectItem value="meal">Прием пищи</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Детали
                </Label>
                <Input
                  id="details"
                  value={newEvent.details}
                  onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddEvent}>Добавить событие</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

