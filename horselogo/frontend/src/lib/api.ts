import type { LogoConfig, GeneratedLogo } from '../types'

const BASE = '/api'

export async function generateLogos(config: LogoConfig): Promise<GeneratedLogo> {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Generierung fehlgeschlagen')
  }
  return res.json()
}

export async function createCheckoutSession(logoId: string, variantIndex: number): Promise<{ checkoutUrl: string }> {
  const res = await fetch(`${BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logoId, variant: variantIndex }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Checkout fehlgeschlagen')
  }
  return res.json()
}

export async function getDownloadInfo(orderId: string): Promise<{ zipUrl: string; expiresAt: string }> {
  const res = await fetch(`${BASE}/download/${orderId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Download nicht gefunden')
  }
  return res.json()
}
