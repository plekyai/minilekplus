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
      <p className="font-body text-on-surface/60">
        Bienvenue, {user.email}. La gestion du contenu sera disponible dans la
        prochaine version.
      </p>
    </main>
  )
}
