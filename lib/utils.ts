import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Get the first day of the week (0 = Sunday)
  const startDay = firstDay.getDay()
  
  // Create array of all days in the month
  const days: Date[] = []
  
  // Add padding days from previous month
  for (let i = 0; i < startDay; i++) {
    days.push(new Date(year, month, 1 - startDay + i))
  }
  
  // Add all days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }
  
  return days
}

export function getWeekDates(date: Date): Date[] {
  const week: Date[] = []
  const day = date.getDay() // 0 = Sunday
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - day)
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    week.push(d)
  }
  
  return week
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getEventsForDay(events: any[], date: Date): any[] {
  return events.filter((event) => {
    const eventStart = new Date(event.startTime)
    const eventEnd = new Date(event.endTime)
    return (
      isSameDay(eventStart, date) ||
      isSameDay(eventEnd, date) ||
      (eventStart <= date && eventEnd >= date)
    )
  })
}

export function checkEventOverlap(events: any[]): Map<string, number> {
  const overlaps = new Map<string, number>()
  
  // Sort events by start time
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
  
  // Group events by day and check overlaps within each day
  const eventsByDay = new Map<string, any[]>()
  
  sortedEvents.forEach((event) => {
    const dayKey = formatDate(new Date(event.startTime))
    if (!eventsByDay.has(dayKey)) {
      eventsByDay.set(dayKey, [])
    }
    eventsByDay.get(dayKey)!.push(event)
  })
  
  eventsByDay.forEach((dayEvents) => {
    dayEvents.forEach((event, index) => {
      const eventEnd = new Date(event.endTime).getTime()
      const overlappingCount = dayEvents.filter((otherEvent, otherIndex) => {
        if (index === otherIndex) return false
        const otherStart = new Date(otherEvent.startTime).getTime()
        const otherEnd = new Date(otherEvent.endTime).getTime()
        return eventEnd > otherStart && new Date(event.startTime).getTime() < otherEnd
      }).length
      
      if (overlappingCount > 0) {
        overlaps.set(event.id, overlappingCount + 1)
      }
    })
  })
  
  return overlaps
}

