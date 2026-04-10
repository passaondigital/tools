import { useState } from 'react'
import type { LogoConfig, Motif, DesignStyle, ColorPalette } from '../types'
import { MOTIFS, STYLES, PALETTES } from '../lib/constants'
import LogoSVG from './LogoSVG'

interface Props {
  config: LogoConfig
  onChange: (updates: Partial<LogoConfig>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2Design({ config, onChange, onNext, onBack }: Props) {
  const [previewLayout, setPreviewLayout] = useState(0)
  const canProceed = config.motif !== null && config.style !== null && config.palette !== null

  const selectedPalette = PALETTES.find((p) => p.value === config.palette)

  return (
    <div className="animate-[fadeUp_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <p className="text-label mb-3">Schritt 2 von 4</p>
        <h2 className="text-display text-3xl sm:text-4xl mb-2">
          Dein <span className="text-gold-shimmer">Design</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Wähle Motiv, Stil und Farben — sieh dein Logo in Echtzeit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div>
          {/* Motif Selection */}
          <div className="mb-7">
            <label className="text-label block mb-3">Pferde-Motiv *</label>
            <div className="grid grid-cols-3 gap-2">
              {MOTIFS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ motif: value as Motif })}
                  className={`select-item flex flex-col items-center gap-1 py-3 ${
                    config.motif === value ? 'selected' : ''
                  }`}
                >
                  <span className="text-lg font-mono">{icon}</span>
                  <span className="text-xs leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-7">
            <label className="text-label block mb-3">Design-Stil *</label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(({ value, label, symbol, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ style: value as DesignStyle })}
                  className={`select-item flex flex-col items-center gap-1 py-3 ${
                    config.style === value ? 'selected' : ''
                  }`}
                >
                  <span className="text-xl font-mono">{symbol}</span>
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Palette Selection */}
          <div className="mb-7">
            <label className="text-label block mb-3">Farbschema *</label>
            <div className="grid grid-cols-2 gap-2">
              {PALETTES.map(({ value, label, primary, secondary }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ palette: value as ColorPalette, colorPrimary: primary, colorSecondary: secondary })}
                  className={`select-item flex items-center gap-3 text-left ${
                    config.palette === value ? 'selected' : ''
                  }`}
                >
                  <div className="flex gap-1 flex-shrink-0">
                    <div
                      className="w-4 h-4 rounded-sm border border-[rgba(255,255,255,0.1)]"
                      style={{ background: value === 'custom' ? 'linear-gradient(135deg, #000, #fff)' : primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-sm border border-[rgba(255,255,255,0.1)]"
                      style={{ background: value === 'custom' ? 'linear-gradient(135deg, #fff, #000)' : secondary }}
                    />
                  </div>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>

            {/* Custom color pickers */}
            {config.palette === 'custom' && (
              <div className="flex gap-4 mt-4">
                <div>
                  <label className="text-label block mb-1">Hauptfarbe</label>
                  <input
                    type="color"
                    value={config.colorPrimary || '#000000'}
                    onChange={(e) => onChange({ colorPrimary: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-label block mb-1">Akzentfarbe</label>
                  <input
                    type="color"
                    value={config.colorSecondary || '#C9A84C'}
                    onChange={(e) => onChange({ colorSecondary: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex flex-col items-center">
          <label className="text-label mb-3 self-start lg:self-center">Live-Vorschau</label>
          <div className="logo-canvas w-full max-w-[280px] aspect-square overflow-hidden">
            <LogoSVG config={config} layout={previewLayout} size={280} watermark={false} />
          </div>

          {/* Layout switcher */}
          <div className="flex gap-1 mt-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPreviewLayout(i)}
                className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                  previewLayout === i
                    ? 'bg-[rgba(201,168,76,0.2)] text-[#C9A84C] border border-[rgba(201,168,76,0.5)]'
                    : 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,228,221,0.35)] border border-[rgba(255,255,255,0.06)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {selectedPalette && config.palette !== 'custom' && (
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-subtle)' }}>
              {selectedPalette.label}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="btn-inactive px-6 py-3 text-sm font-semibold"
        >
          ← Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="btn-cta flex-1 py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          ✧ Logos generieren
        </button>
      </div>
    </div>
  )
}
