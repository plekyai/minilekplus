export type Tier = 'free' | 'premium'

/**
 * Phase 1: always returns true — all content is accessible.
 *
 * To activate billing in Phase 2, replace the return with:
 *   return userTier === 'premium' || contentTier === 'free'
 *
 * Every quiz page and activity listing should call this before rendering.
 * Changing the return value activates the paywall globally.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canAccess(_userTier: Tier, _contentTier: Tier): boolean {
  return true
}
