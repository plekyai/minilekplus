import { ParcoursForm } from '@/components/admin/ParcoursForm'
import { createParcours } from '@/app/(admin)/admin/parcours/actions'
import Link from 'next/link'

export default function NewParcoursPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/parcours" className="font-body text-sm text-on-surface/50 hover:text-primary">
          ← Parcours
        </Link>
        <h1 className="font-display text-2xl font-bold text-on-surface">Nouveau parcours</h1>
      </div>
      <ParcoursForm action={createParcours} submitLabel="Créer le parcours" />
    </div>
  )
}
