// app/api/translate-text/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { text, targetLang, targetLabel } = await req.json()
  if (!text || !targetLang || !targetLabel) {
    return NextResponse.json({ error: 'Missing text, targetLang or targetLabel' }, { status: 400 })
  }

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a Bible content translator for a children's family app.\nTranslate the following French text to ${targetLabel}.\nReturn ONLY the translated text, no explanation, no markdown.\n\n${text}`,
      }],
    })
    const translated = msg.content[0].type === 'text' ? msg.content[0].text : text
    return NextResponse.json({ translated })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[translate-text]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
