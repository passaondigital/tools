import { useState } from 'react'
import type { LogoConfig } from '../types'
import { LAYOUT_NAMES } from '../lib/constants'
import { createCheckoutSession } from '../lib/api'
import LogoSVG from './LogoSVG'

interface Props {
  config: LogoConfig
  logoId: string
  variantIndex: number
  onBack: () => void
}

const FEATURES = [
  'PNG 3000×3000px (transparenter Hintergrund)',
  'SVG Vektordatei (skalierbar)',
  '5 Farbvarianten',
  'Social Media Kit (Instagram, Facebook, WhatsApp)',
  'Visitenkarten-Layout',
  'Sofort-Download nach Kauf',
  'Kommerzielle Nutzungsrechte',
]

export default function Step4Checkout({ config, logoId, variantIndex, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const { checkoutUrl } = await createCheckoutSession(logoId, variantIndex)
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Checkout')
      setLoading(false)
    }
  }

  return (
    <div className="animate-[fadeUp_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <p className="text-label mb-3">Schritt 4 von 4</p>
        <h2 className="text-display text-3xl sm:text-4xl mb-2">
          Dein <span className="text-gold-shimmer">Logo</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Fast fertig — eine Zahlung und dein Logo gehört dir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Selected logo preview */}
        <div>
          <label className="text-label block mb-3">
            Gewähltes Design — {LAYOUT_NAMES[variantIndex]}
          </label>
          <div
            className="logo-canvas w-full aspect-square max-w-[320px] overflow-hidden border"
            style={{ borderColor: 'rgba(201,168,76,0.4)', borderRadius: '12px', boxShadow: '0 0 32px rgba(201,168,76,0.1)' }}
          >
            <LogoSVG config={config} layout={variantIndex} size={320} watermark={true} />
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-subtle)' }}>
            Vorschau mit Wasserzeichen. Finale Datei ohne Wasserzeichen.
          </p>
        </div>

        {/* Right: Order summary */}
        <div className="flex flex-col">
          {/* Price */}
          <div className="card-surface p-6 mb-4">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-label">Einmaliger Preis</span>
              <span className="text-display text-4xl text-[#C9A84C]">€9,99</span>
            </div>
            <div className="divider mb-4" />
            <ul className="space-y-2">
              {FEATURES.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✓</span>
                  <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="btn-cta w-full py-5 text-lg font-bold mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Weiterleitung zu Stripe…
              </span>
            ) : (
              'Jetzt kaufen — €9,99'
            )}
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>🔒 SSL-verschlüsselt</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>⚡ Sofort-Download</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>💳 Sichere Zahlung</span>
          </div>

          {/* Testimonial */}
          <div className="card p-4">
            <p className="text-sm italic mb-2" style={{ color: 'var(--text-muted)' }}>
              „Innerhalb von 10 Minuten hatte ich ein professionelles Logo für meinen Reitstall. Absolut begeistert!"
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(201,168,76,0.6)' }}>
              — Sandra M., Reiterhof Sonnenblick
            </p>
          </div>
        </div>
      </div>

      {/* Back */}
      <button type="button" onClick={onBack} className="btn-inactive mt-6 px-6 py-3 text-sm font-semibold">
        ← Andere Variante wählen
      </button>

      {/* Legal */}
      <p className="text-[10px] mt-6 text-center leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
        Mit dem Kauf akzeptierst du unsere{' '}
        <a href="/agb" className="underline hover:text-[#C9A84C] transition-colors">AGB</a> und{' '}
        <a href="/datenschutz" className="underline hover:text-[#C9A84C] transition-colors">Datenschutzerklärung</a>.
        Das Widerrufsrecht erlischt nach Lieferung digitaler Inhalte gemäß §356 Abs. 5 BGB.
      </p>
    </div>
  )
}
