// lib/emailit.ts — utilitaire Emailit (emails transactionnels + audiences)
// Clé serveur uniquement (EMAILIT_API_KEY) : jamais importé côté client.
// Docs : https://emailit.com/docs/api-reference (base v2)

const BASE = 'https://api.emailit.com/v2'
const FROM = 'Minilek <bonjour@minilek.com>' // domaine minilek.com enregistré dans Emailit

/** Audiences créées le 2026-07-12 (les ids ne sont pas des secrets). */
export const AUDIENCES = {
  /** Parents inscrits sur l'app mobile Minilek Family Bible (opt-in) */
  parents: 'aud_4GRWvW2xdw041Vpght36tIPuVKT',
  /** Newsletter du site plus.minilek.com */
  newsletter: 'aud_4GRWvdq1g9GSvfw7093hs8ZS7Q1',
  /** Bêta-testeurs Minilek */
  beta: 'aud_4GRWvld5iMWmCTBEKgFLzdRUEAB',
} as const

export type AudienceKey = keyof typeof AUDIENCES

function headers(): HeadersInit {
  const key = process.env.EMAILIT_API_KEY
  if (!key) throw new Error('EMAILIT_API_KEY manquante (.env.local / Vercel env)')
  return { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
}

/** Inscrit un email à une audience. Idempotent côté Emailit (email déjà
 *  présent → pas de doublon). */
export async function subscribeToAudience(
  audience: AudienceKey,
  email: string,
  firstName?: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${BASE}/audiences/${AUDIENCES[audience]}/subscribers`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, ...(firstName ? { first_name: firstName } : {}) }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Emailit ${res.status}: ${body.slice(0, 200)}` }
  }
  return { ok: true }
}

/** Envoie un email transactionnel. */
export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${BASE}/emails`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Emailit ${res.status}: ${body.slice(0, 200)}` }
  }
  return { ok: true }
}
