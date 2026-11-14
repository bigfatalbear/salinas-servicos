export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  active: boolean
  sort_order: number
  created_at?: string
}

export interface Professional {
  id: string
  user_id: string | null
  business_name: string
  whatsapp: string
  category_id: string | null
  category?: Pick<Category, 'id' | 'name' | 'slug' | 'icon'> | null
  neighborhood: string | null
  address: string | null
  description: string | null
  photo_1_url: string | null
  photo_2_url: string | null
  is_featured: boolean
  featured_order: number
  is_active: boolean
  recommendations: number
  whatsapp_clicks: number
  created_at: string
  updated_at: string
}

export interface FeatureFlag {
  key: string
  enabled: boolean
  label: string | null
  description: string | null
  updated_at?: string
}

export type FeatureFlagMap = Record<string, boolean>

export interface PollResults {
  yes: number
  no: number
  maybe: number
}

export type UserRole = 'admin' | 'professional'
