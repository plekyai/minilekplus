import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  return (
    <main className="p-8">
      <h1 className="font-display text-2xl font-bold text-on-surface mb-2">
        Dashboard
      </h1>
      <p className="font-body text-on-surface/60 mb-8">
        Bienvenue, {user.email}.
      </p>

      <div className="grid gap-4">
        <Link
          href="/admin/parcours"
          className="block bg-surface-container-lowest rounded-2xl p-6 shadow-ambient hover:shadow-lg transition-shadow"
        >
          <h2 className="font-display text-lg font-bold text-on-surface">Culte Familial</h2>
          <p className="font-body text-sm text-on-surface/60 mt-1">Gérer les parcours et questions</p>
        </Link>
      </div>
    </main>
  )
}
