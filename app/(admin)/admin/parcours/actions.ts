'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createParcours(formData: FormData) {
  const supabase = createAdminClient()
  const title = formData.get('title') as string
  const story_text = formData.get('story_text') as string
  const prayer_text = formData.get('prayer_text') as string
  const slug = (formData.get('slug') as string).toLowerCase().replace(/\s+/g, '-')
  const image_url = formData.get('image_url') as string | null
  const difficulty = formData.get('difficulty') as string
  const tier = formData.get('tier') as string
  const published = formData.get('published') === 'on'
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const audio_urls: Record<string, string> = {}
  for (const key of ['generique', 'facile', 'moyenne', 'difficile', 'parents', 'priere', 'correct', 'wrong']) {
    const val = formData.get(`audio_${key}`) as string
    if (val) audio_urls[key] = val
  }

  const translations = {
    fr: { title, story_text, prayer_text, translation_status: 'source' },
  }

  const { data, error } = await supabase
    .from('parcours')
    .insert({ slug, translations, image_url: image_url || null, audio_urls, tags, difficulty, tier, published })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  redirect(`/admin/parcours/${data.id}`)
}

export async function updateParcours(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const { data: current } = await supabase
    .from('parcours')
    .select('translations')
    .eq('id', id)
    .single()

  const title = formData.get('title') as string
  const story_text = formData.get('story_text') as string
  const prayer_text = formData.get('prayer_text') as string
  const published = formData.get('published') === 'on'
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []
  const image_url = formData.get('image_url') as string | null
  const difficulty = formData.get('difficulty') as string
  const tier = formData.get('tier') as string

  const audio_urls: Record<string, string> = {}
  for (const key of ['generique', 'facile', 'moyenne', 'difficile', 'parents', 'priere', 'correct', 'wrong']) {
    const val = formData.get(`audio_${key}`) as string
    if (val) audio_urls[key] = val
  }

  const translations = {
    ...(current?.translations ?? {}),
    fr: { title, story_text, prayer_text, translation_status: 'source' },
  }

  const { error } = await supabase
    .from('parcours')
    .update({ translations, image_url: image_url || null, audio_urls, tags, difficulty, tier, published })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  revalidatePath(`/admin/parcours/${id}`)
}

export async function deleteParcours(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('parcours').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  redirect('/admin/parcours')
}
