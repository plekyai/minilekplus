'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">
          Mot de passe oublié
        </h1>

        {sent ? (
          <p className="font-body text-on-surface/60">
            Un email de réinitialisation a été envoyé à{' '}
            <strong>{email}</strong>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            {error && <p className="font-body text-sm text-error">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient"
            >
              Envoyer le lien
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
