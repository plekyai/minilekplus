// Root redirect — actual home page lives in app/(public)/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/')
}
