// app/api/subscribe/route.ts — inscription aux audiences Emailit.
// Consommé par le site (newsletter) ET par l'app mobile Minilek Family Bible
// (opt-in parent à l'inscription) — la clé Emailit reste côté serveur.
import { NextRequest, NextResponse } from 'next/server'
import { AUDIENCES, subscribeToAudience, type AudienceKey } from '@/lib/emailit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: NextRequest) {
  let body: { email?: string; audience?: string; firstName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const audience = body.audience as AudienceKey
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }
  if (!audience || !(audience in AUDIENCES)) {
    return NextResponse.json({ error: 'Audience inconnue' }, { status: 400 })
  }

  const result = await subscribeToAudience(audience, email, body.firstName?.trim() || undefined)
  if (!result.ok) {
    console.error('Emailit subscribe:', result.error)
    return NextResponse.json({ error: "L'inscription n'a pas abouti, réessayez plus tard." }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
