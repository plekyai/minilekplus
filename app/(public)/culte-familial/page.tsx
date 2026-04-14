import { getPublishedParcours } from '@/lib/supabase/queries/parcours'
import { CulteFamilialList } from '@/components/CulteFamilialList'
import type { Parcours } from '@/types/quiz'

export default async function CulteFamilialPage() {
  let parcoursList: Parcours[] = []
  try {
    parcoursList = await getPublishedParcours()
  } catch {
    // Supabase not configured yet — show empty state
  }

  return <CulteFamilialList parcoursList={parcoursList} />
}
