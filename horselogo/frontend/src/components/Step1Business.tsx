import type { LogoConfig, Industry } from '../types'
import { INDUSTRIES } from '../lib/constants'

interface Props {
  config: LogoConfig
  onChange: (updates: Partial<LogoConfig>) => void
  onNext: () => void
}

export default function Step1Business({ config, onChange, onNext }: Props) {
  const canProceed = config.businessName.trim().length > 0 && config.industry !== null

  return (
    <div className="animate-[fadeUp_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <p className="text-label mb-3">Schritt 1 von 4</p>
        <h2 className="text-display text-3xl sm:text-4xl mb-2">
          Dein <span className="text-gold-shimmer">Business</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Erzähl uns von deinem Unternehmen — wir optimieren das Logo auf deine Branche.
        </p>
      </div>

      {/* Business Name */}
      <div className="mb-6">
        <label className="text-label block mb-2">Unternehmensname *</label>
        <input
          type="text"
          className="input-field"
          placeholder="z.B. Reiterhof Sonnenhügel"
          value={config.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          maxLength={50}
        />
      </div>

      {/* Tagline */}
      <div className="mb-8">
        <label className="text-label block mb-2">Slogan / Tagline <span style={{ color: 'var(--text-subtle)' }}>(optional)</span></label>
        <input
          type="text"
          className="input-field"
          placeholder="z.B. Wo Pferde zuhause sind"
          value={config.tagline}
          onChange={(e) => onChange({ tagline: e.target.value })}
          maxLength={60}
        />
      </div>

      {/* Industry */}
      <div className="mb-8">
        <label className="text-label block mb-3">Branche *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INDUSTRIES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ industry: value as Industry })}
              className={`select-item flex items-center gap-2 text-left ${
                config.industry === value ? 'selected' : ''
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="text-xs leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="btn-cta w-full py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        Weiter → Design wählen
      </button>
    </div>
  )
}
