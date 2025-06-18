export interface UserProfile {
  id: string
  date_of_birth: string
}

export interface Category {
  id: number
  name: string
}

export interface ContactInfo {
  email?: string | null
  phone?: string | null
  website?: string | null
}

export interface Flyer {
  id: string
  title: string
  description?: string | null
  image_url: string
  event_date?: string | null
  event_time?: string | null
  location_address?: string | null
  location_city: string
  location_state: string
  created_at: string
  is_active: boolean
  is_approved: boolean
  is_21_plus: boolean
  categories: Category
  contact_info?: ContactInfo | null
  is_saved?: boolean
}
