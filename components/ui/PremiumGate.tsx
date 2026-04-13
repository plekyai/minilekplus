// Phase 1: renders children unconditionally.
// Phase 2: show upsell modal when canAccess() returns false.

import type { ReactNode } from 'react'

interface PremiumGateProps {
  children: ReactNode
}

export function PremiumGate({ children }: PremiumGateProps) {
  return <>{children}</>
}
