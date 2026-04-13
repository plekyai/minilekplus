import { canAccess } from '@/lib/access'

describe('canAccess — Phase 1 (all content accessible)', () => {
  it('allows free user to access free content', () => {
    expect(canAccess('free', 'free')).toBe(true)
  })

  it('allows free user to access premium content in Phase 1', () => {
    expect(canAccess('free', 'premium')).toBe(true)
  })

  it('allows premium user to access premium content', () => {
    expect(canAccess('premium', 'premium')).toBe(true)
  })

  it('allows premium user to access free content', () => {
    expect(canAccess('premium', 'free')).toBe(true)
  })
})
