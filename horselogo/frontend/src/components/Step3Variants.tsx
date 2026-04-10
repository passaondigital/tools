import { useEffect, useState, useRef } from 'react'
import type { LogoConfig, GeneratedLogo } from '../types'
import { generateLogos } from '../lib/api'
import { LAYOUT_NAMES } from '../lib/constants'
import LogoSVG from './LogoSVG'

interface Props {
  config: LogoConfig
  onSelect: (logoId: string, variantIndex: number) => void
  onBack: () => void
}

export default function Step3Variants({ config, onSelect, onBack }: Props) {
  const [generated, setGenerated] = useState<GeneratedLogo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    setLoading(true)
    generateLogos(config)
      .then((data) => {
        setGenerated(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-[fadeUp_0.4s_ease-out_forwards]">
        <div className="relative mb-8">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.3)] animate-ping" />
          <div className="absolute inset-[-8px] rounded-full border border-[rgba(201,168,76,0.15)] animate-ping [animation-delay:0.3s]" />
          {/* Floating horse */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] animate-[horseFloat_2s_ease-in-out_infinite]">
            <span className="text-3xl">🐴</span>
          </div>
        </div>
        <p className="text-display text-xl text-[#E8E4DD] mb-2">Logos werden generiert…</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          KI erstellt 6 Varianten für {config.businessName}
        </p>
        <div className="flex gap-1 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16 animate-[fadeUp_0.4s_ease-out_forwards]">
        <p className="text-[#E8E4DD] mb-2 text-lg">Generierung fehlgeschlagen</p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
        <button type="button" onClick={onBack} className="btn-inactive px-6 py-3 text-sm">
          ← Zurück
        </button>
      </div>
    )
  }

  const logoId = generated?.logoId ?? ''

  return (
    <div className="animate-[fadeUp_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <p className="text-label mb-3">Schritt 3 von 4</p>
        <h2 className="text-display text-3xl sm:text-4xl mb-2">
          Deine <span className="text-gold-shimmer">Vorschläge</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          6 einzigartige Varianten für <strong className="text-[#E8E4DD]">{config.businessName}</strong> — wähle dein Favorit.
        </p>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`relative rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.02] ${
              selected === i
                ? 'border-[rgba(201,168,76,0.7)] shadow-[0_0_20px_rgba(201,168,76,0.2)]'
                : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,76,0.3)]'
            }`}
          >
            <LogoSVG config={config} layout={i} size={240} watermark={true} />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(232,228,221,0.6)' }}>
                {LAYOUT_NAMES[i]}
              </p>
            </div>
            {selected === i && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#0a0700]">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-[11px] mb-6 text-center" style={{ color: 'var(--text-subtle)' }}>
        Vorschau mit Wasserzeichen. Nach dem Kauf erhältst du alle Dateien ohne Wasserzeichen.
      </p>

      {/* Navigation */}
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-inactive px-6 py-3 text-sm font-semibold">
          ← Zurück
        </button>
        <button
          type="button"
          onClick={() => selected !== null && onSelect(logoId, selected)}
          disabled={selected === null}
          className="btn-cta flex-1 py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {selected !== null ? `Variante ${selected + 1} kaufen — €9,99` : 'Variante wählen'}
        </button>
      </div>
    </div>
  )
}
