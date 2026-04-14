import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { WordSearchPuzzle } from '@/types/word-search'

export async function getPublishedPuzzles(): Promise<WordSearchPuzzle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('word_search_puzzles')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data as WordSearchPuzzle[]
}

export async function getPuzzleBySlug(slug: string): Promise<WordSearchPuzzle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('word_search_puzzles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as WordSearchPuzzle
}

// Admin
export async function getAllPuzzlesAdmin(): Promise<WordSearchPuzzle[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('word_search_puzzles')
    .select('*')
    .order('order_index', { ascending: true })
  if (error) throw error
  return data as WordSearchPuzzle[]
}
