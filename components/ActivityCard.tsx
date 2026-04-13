import Link from 'next/link'

interface ActivityCardProps {
  href: string
  icon: string
  title: string
  description: string
  available?: boolean
}

export function ActivityCard({
  href,
  icon,
  title,
  description,
  available = true,
}: ActivityCardProps) {
  if (!available) {
    return (
      <div className="bg-surface-container-lowest rounded-[2rem] p-6 opacity-40">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="font-display text-xl font-bold text-on-surface mb-1">
          {title}
        </h2>
        <p className="font-body text-sm text-on-surface/60">{description}</p>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block bg-surface-container-lowest rounded-[2rem] p-6 shadow-ambient hover:bg-surface-container-low transition-colors group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="font-display text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="font-body text-sm text-on-surface/60">{description}</p>
    </Link>
  )
}
