'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // family_profiles row is auto-created by DB trigger on_auth_user_created
    router.push('/?registered=true')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">
          Compte famille
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="name"
            label="Nom de famille"
            value={displayName}
            onChange={setDisplayName}
            required
          />
          <AuthInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <AuthInput
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient disabled:opacity-60"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        <a
          href="/auth/login"
          className="block text-center mt-4 font-body text-sm text-on-surface/60"
        >
          Déjà un compte ? Connexion
        </a>
      </div>
    </main>
  )
}
