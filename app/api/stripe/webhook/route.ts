import { NextResponse } from 'next/server'

// Stubbed in Phase 1 — endpoint exists so Stripe can be pointed at it without code changes.
// Phase 2: verify Stripe-Signature header and process subscription lifecycle events
// (customer.subscription.updated, customer.subscription.deleted, etc.).
export async function POST() {
  return NextResponse.json({ received: true })
}
