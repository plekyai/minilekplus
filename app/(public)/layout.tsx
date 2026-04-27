import { NavBar } from '@/components/layout/NavBar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: 60 }}>
        {children}
      </div>
    </>
  )
}
