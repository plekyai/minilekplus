import { LanguageSelector } from '@/components/LanguageSelector'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold text-primary text-lg">
          Minilek+
        </span>
        <LanguageSelector />
      </header>
      {children}
    </>
  )
}
