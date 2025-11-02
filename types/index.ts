export interface Event {
  id: string
  title: string
  description?: string | null
  startTime: string
  endTime: string
  color: string
  location?: string | null
  createdAt: string
  updatedAt: string
}

export type ViewType = 'month' | 'week' | 'day'

