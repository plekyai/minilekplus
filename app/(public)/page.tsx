import { ActivityCard } from '@/components/ActivityCard'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-on-surface mb-2">
          Minilek Plus
        </h1>
        <p className="font-body text-on-surface/60 mb-12">
          Activités bibliques pour la famille
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ActivityCard
            href="/culte-familial"
            icon="✝️"
            title="Culte Familial"
            description="Quiz biblique interactif en famille"
          />
          <ActivityCard
            href="/mots-meles"
            icon="🔎"
            title="Mots Mêlés"
            description="Mots cachés bibliques"
          />
          <ActivityCard
            href="/coloriage"
            icon="🎨"
            title="Coloriage"
            description="Bientôt disponible"
            available={false}
          />
        </div>
      </div>
    </main>
  )
}
