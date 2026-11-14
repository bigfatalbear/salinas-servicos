import { supabase } from './supabase'
import type {
  Category,
  FeatureFlag,
  FeatureFlagMap,
  PollResults,
  Professional,
  UserRole,
} from './types'
import { slugify } from './utils'

const professionalSelect = `
  *,
  category:categories(id, name, slug, icon)
`

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  return data as T
}

export async function fetchCategories(includeInactive = false): Promise<Category[]> {
  let query = supabase.from('categories').select('*').order('sort_order').order('name')
  if (!includeInactive) query = query.eq('active', true)
  const { data, error } = await query
  return unwrap(data, error) ?? []
}

export async function fetchProfessionals(options?: {
  includeInactive?: boolean
  featuredOnly?: boolean
  limit?: number
}): Promise<Professional[]> {
  let query = supabase
    .from('professionals')
    .select(professionalSelect)
    .order('is_featured', { ascending: false })
    .order('featured_order', { ascending: true })
    .order('recommendations', { ascending: false })
    .order('created_at', { ascending: false })

  if (!options?.includeInactive) query = query.eq('is_active', true)
  if (options?.featuredOnly) query = query.eq('is_featured', true).eq('is_active', true)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return (unwrap(data, error) ?? []) as Professional[]
}

export async function fetchProfessional(id: string): Promise<Professional | null> {
  const { data, error } = await supabase
    .from('professionals')
    .select(professionalSelect)
    .eq('id', id)
    .maybeSingle()
  return unwrap(data, error) as Professional | null
}

export async function fetchProfessionalsByIds(ids: string[]): Promise<Professional[]> {
  if (!ids.length) return []
  const { data, error } = await supabase
    .from('professionals')
    .select(professionalSelect)
    .in('id', ids)
    .eq('is_active', true)
  return (unwrap(data, error) ?? []) as Professional[]
}

export async function fetchMyProfessional(userId: string): Promise<Professional | null> {
  const { data, error } = await supabase
    .from('professionals')
    .select(professionalSelect)
    .eq('user_id', userId)
    .maybeSingle()
  return unwrap(data, error) as Professional | null
}

export async function updateProfessional(
  id: string,
  patch: Partial<Professional>,
): Promise<Professional> {
  const { data, error } = await supabase
    .from('professionals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(professionalSelect)
    .single()
  return unwrap(data, error) as Professional
}

export async function updateProfessionalByUser(
  userId: string,
  patch: Partial<Professional>,
): Promise<Professional> {
  const { data, error } = await supabase
    .from('professionals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select(professionalSelect)
    .single()
  return unwrap(data, error) as Professional
}

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const maxSize = 1200
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Não foi possível processar a imagem.')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao reduzir a imagem.'))),
      'image/jpeg',
      0.82,
    )
  })
}

export async function uploadProfessionalPhoto(
  userId: string,
  file: File,
  slot: 1 | 2,
): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Envie um arquivo de imagem.')
  if (file.size > 8 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 8 MB.')
  const blob = await compressImage(file)
  const path = `${userId}/photo-${slot}-${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('professional-photos')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('professional-photos').getPublicUrl(path)
  const field = slot === 1 ? 'photo_1_url' : 'photo_2_url'
  await updateProfessionalByUser(userId, { [field]: data.publicUrl })
  return data.publicUrl
}

export async function removeProfessionalPhoto(userId: string, slot: 1 | 2) {
  const field = slot === 1 ? 'photo_1_url' : 'photo_2_url'
  await updateProfessionalByUser(userId, { [field]: null })
}

export async function registerWhatsAppClick(professionalId: string) {
  const { error } = await supabase.rpc('register_whatsapp_click', {
    p_professional_id: professionalId,
  })
  if (error) console.warn('Falha ao registrar clique:', error.message)
}

export async function recommendProfessional(professionalId: string, voterToken: string) {
  const { data, error } = await supabase.rpc('recommend_professional', {
    p_professional_id: professionalId,
    p_voter_token: voterToken,
  })
  return unwrap(data, error) as { added: boolean; recommendations: number }
}

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  const { data, error } = await supabase.from('feature_flags').select('*').order('key')
  return (unwrap(data, error) ?? []) as FeatureFlag[]
}

export function flagsToMap(flags: FeatureFlag[]): FeatureFlagMap {
  return Object.fromEntries(flags.map((flag) => [flag.key, flag.enabled]))
}

export async function updateFeatureFlag(key: string, enabled: boolean): Promise<FeatureFlag> {
  const { data, error } = await supabase
    .from('feature_flags')
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select('*')
    .single()
  return unwrap(data, error) as FeatureFlag
}

export async function fetchPollResults(): Promise<PollResults> {
  const { data, error } = await supabase.rpc('poll_results')
  const result = unwrap(data, error) as Partial<PollResults> | null
  return {
    yes: Number(result?.yes ?? 0),
    no: Number(result?.no ?? 0),
    maybe: Number(result?.maybe ?? 0),
  }
}

export async function votePoll(option: string, voterToken: string) {
  const { data, error } = await supabase.rpc('vote_poll', {
    p_option: option,
    p_voter_token: voterToken,
  })
  return unwrap(data, error) as { added: boolean; results: PollResults }
}

export async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return 'professional'
  return (data?.role as UserRole) ?? 'professional'
}

export async function createCategory(input: {
  name: string
  icon?: string
  sort_order?: number
}): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: slugify(input.name),
      icon: input.icon || null,
      sort_order: input.sort_order ?? 0,
      active: true,
    })
    .select('*')
    .single()
  return unwrap(data, error) as Category
}

export async function updateCategory(
  id: string,
  patch: Partial<Category>,
): Promise<Category> {
  const payload = { ...patch }
  if (patch.name) payload.slug = slugify(patch.name)
  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  return unwrap(data, error) as Category
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
