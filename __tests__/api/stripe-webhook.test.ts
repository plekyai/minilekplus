/**
 * @jest-environment node
 */
import { POST } from '@/app/api/stripe/webhook/route'

describe('POST /api/stripe/webhook', () => {
  it('returns 200 with { received: true }', async () => {
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ received: true })
  })
})
