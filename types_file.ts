export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          date_of_birth: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          date_of_birth: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date_of_birth?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          is_21_plus_required: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          is_21_plus_required?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          is_21_plus_required?: boolean
          created_at?: string
        }
      }
      flyers: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          image_url: string
          category_id: number
          is_21_plus: boolean
          location_city: string
          location_state: string
          location_address: string | null
          event_date: string | null
          event_time: string | null
          contact_info: Json | null
          is_approved: boolean
          is_active: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          image_url: string
          category_id: number
          is_21_plus?: boolean
          location_city: string
          location_state: string
          location_address?: string | null
          event_date?: string | null
          event_time?: string | null
          contact_info?: Json | null
          is_approved?: boolean
          is_active?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          image_url?: string
          category_id?: number
          is_21_plus?: boolean
          location_city?: string
          location_state?: string
          location_address?: string | null
          event_date?: string | null
          event_time?: string | null
          contact_info?: Json | null
          is_approved?: boolean
          is_active?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      saved_flyers: {
        Row: {
          id: string
          user_id: string
          flyer_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          flyer_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flyer_id?: string
          saved_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_age: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      user_can_see_adult_content: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Flyer = Database['public']['Tables']['flyers']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row']
  is_saved?: boolean
}

export type Category = Database['public']['Tables']['categories']['Row']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export type ContactInfo = {
  email?: string
  phone?: string
  website?: string
}