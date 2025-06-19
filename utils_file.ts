import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isValid, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export function formatEventDate(dateString: string | null): string {
  if (!dateString) return 'Date TBD'
  
  const date = parseISO(dateString)
  if (!isValid(date)) return 'Invalid Date'
  
  return format(date, 'MMM d, yyyy')
}

export function formatEventTime(timeString: string | null): string {
  if (!timeString) return 'Time TBD'
  
  // Parse time string (HH:mm format)
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  
  return format(date, 'h:mm a')
}