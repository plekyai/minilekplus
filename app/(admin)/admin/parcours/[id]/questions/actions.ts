'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertQuestion(
  parcoursId: string,
  questionId: string | null,
  data: {
    type: string
    order_index: number
    question: string
    choices: [string, string, string, string] | null
    correct_index: number | null
    explanation: string | null
    verse_ref: string | null
    verse_ref_verified: boolean
  }
) {
  const supabase = createAdminClient()
  const frBase: Record<string, unknown> = {
    question: data.question,
    choices: data.choices,
    correct_index: data.correct_index,
    explanation: data.explanation,
    translation_status: 'source',
  }
  if (data.verse_ref) {
    frBase.verse_ref = data.verse_ref
    frBase.verse_ref_status = data.verse_ref_verified ? 'verified' : 'ai'
  }
  const translations = { fr: frBase }

  if (questionId) {
    const { data: current } = await supabase
      .from('questions')
      .select('translations')
      .eq('id', questionId)
      .single()
    const merged = { ...(current?.translations ?? {}), fr: translations.fr }
    const { error } = await supabase
      .from('questions')
      .update({ type: data.type, order_index: data.order_index, translations: merged })
      .eq('id', questionId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('questions')
      .insert({ parcours_id: parcoursId, type: data.type, order_index: data.order_index, translations })
    if (error) throw new Error(error.message)
  }
  revalidatePath(`/admin/parcours/${parcoursId}`)
}

export async function deleteQuestion(parcoursId: string, questionId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/parcours/${parcoursId}`)
}
