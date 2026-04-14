import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { table, record_id } = await req.json()
  if (!['parcours', 'questions'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (table === 'parcours') {
    const { data, error } = await supabase.from('parcours').select('translations').eq('id', record_id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const fr = data.translations.fr
    if (!fr) return NextResponse.json({ error: 'No FR source' }, { status: 400 })

    const prompt = `You are a Bible content translator. Translate the following French text fields to English (en), Portuguese (pt), and Thai (th).
Return ONLY a valid JSON object with keys "en", "pt", "th". Each value must have the same fields as the input.

Input (French):
${JSON.stringify({ title: fr.title, story_text: fr.story_text, prayer_text: fr.prayer_text }, null, 2)}

Return format (fill in translated values):
{
  "en": { "title": "...", "story_text": "...", "prayer_text": "..." },
  "pt": { "title": "...", "story_text": "...", "prayer_text": "..." },
  "th": { "title": "...", "story_text": "...", "prayer_text": "..." }
}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response' }, { status: 500 })

    const translated = JSON.parse(jsonMatch[0])
    const newTranslations = {
      ...data.translations,
      en: { ...translated.en, translation_status: 'ai' },
      pt: { ...translated.pt, translation_status: 'ai' },
      th: { ...translated.th, translation_status: 'ai' },
    }

    await supabase.from('parcours').update({ translations: newTranslations }).eq('id', record_id)
    return NextResponse.json({ ok: true })
  }

  if (table === 'questions') {
    const { data, error } = await supabase.from('questions').select('translations, type').eq('id', record_id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const fr = data.translations.fr
    if (!fr) return NextResponse.json({ error: 'No FR source' }, { status: 400 })

    const isParents = data.type === 'parents'
    const prompt = isParents
      ? `Translate this French question to English (en), Portuguese (pt), and Thai (th).
Return ONLY valid JSON: { "en": { "question": "..." }, "pt": { "question": "..." }, "th": { "question": "..." } }
French question: "${fr.question}"`
      : `Translate this French MCQ question and its choices to English (en), Portuguese (pt), and Thai (th).
Return ONLY valid JSON with keys en, pt, th. Each: { "question": "...", "choices": ["A","B","C","D"], "explanation": "..." }
French: ${JSON.stringify({ question: fr.question, choices: fr.choices, explanation: fr.explanation })}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response' }, { status: 500 })

    const translated = JSON.parse(jsonMatch[0])
    const newTranslations = {
      ...data.translations,
      en: { ...fr, ...translated.en, correct_index: fr.correct_index, translation_status: 'ai' },
      pt: { ...fr, ...translated.pt, correct_index: fr.correct_index, translation_status: 'ai' },
      th: { ...fr, ...translated.th, correct_index: fr.correct_index, translation_status: 'ai' },
    }

    await supabase.from('questions').update({ translations: newTranslations }).eq('id', record_id)
    return NextResponse.json({ ok: true })
  }
}
