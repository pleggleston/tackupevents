export function cn(...classes: any[]): string {
  return classes
    .flatMap(cls => {
      if (!cls) return []
      if (typeof cls === 'string') return cls.split(' ')
      if (Array.isArray(cls)) return cls
      return Object.entries(cls)
        .filter(([_, value]) => Boolean(value))
        .map(([key]) => key)
    })
    .join(' ')
}

export function calculateAge(dateString: string): number {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

import type { Flyer } from './types'

function formatDate(date: string) {
  const d = new Date(date)
  return d.toISOString().replace(/[-:]|\.\d{3}/g, '')
}

export function generateICSFile(flyer: Flyer): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${flyer.title}`,
    flyer.event_date ? `DTSTART;VALUE=DATE:${formatDate(flyer.event_date)}` : '',
    flyer.event_date ? `DTEND;VALUE=DATE:${formatDate(flyer.event_date)}` : '',
    flyer.description ? `DESCRIPTION:${flyer.description}` : '',
    `LOCATION:${flyer.location_city}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\n')
}
