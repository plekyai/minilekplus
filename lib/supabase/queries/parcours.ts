import { createClient } from '@/lib/supabase/server'
import type { Parcours, Question } from '@/types/quiz'

export async function getPublishedParcours(): Promise<Parcours[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Parcours[]
}

export async function getParcoursWithQuestions(
  slug: string
): Promise<{ parcours: Parcours; questions: Question[] } | null> {
  const supabase = await createClient()
  const { data: parcours, error: pe } = await supabase
    .from('parcours')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (pe || !parcours) return null

  const { data: questions, error: qe } = await supabase
    .from('questions')
    .select('*')
    .eq('parcours_id', parcours.id)
    .order('order_index', { ascending: true })
  if (qe) throw qe

  return { parcours: parcours as Parcours, questions: questions as Question[] }
}

export async function getAllParcoursAdmin(): Promise<Parcours[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Parcours[]
}

export async function getParcoursById(id: string): Promise<Parcours | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Parcours
}

export async function getQuestionsByParcoursId(parcoursId: string): Promise<Question[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('parcours_id', parcoursId)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data as Question[]
}
