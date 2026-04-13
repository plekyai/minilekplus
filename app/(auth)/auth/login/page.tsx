'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Connexion…' : 'Connexion'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-center">
          <a
            href="/auth/forgot-password"
            className="font-body text-sm text-primary"
          >
            Mot de passe oublié ?
          </a>
          <a href="/auth/register" className="font-body text-sm text-on-surface/60">
            Créer un compte famille
          </a>
        </div>
      </div>
    </main>
  )
}
