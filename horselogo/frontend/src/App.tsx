import { useReducer } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import type { LogoConfig } from './types'
import Header from './components/Header'
import Footer from './components/Footer'
import StepIndicator from './components/StepIndicator'
import Step1Business from './components/Step1Business'
import Step2Design from './components/Step2Design'
import Step3Variants from './components/Step3Variants'
import Step4Checkout from './components/Step4Checkout'
import DownloadPage from './pages/DownloadPage'
import LegalPage from './pages/LegalPage'

// ── Wizard state ──────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4

interface WizardState {
  step: WizardStep
  config: LogoConfig
  logoId: string
  variantIndex: number
}

const initialConfig: LogoConfig = {
  businessName: '',
  tagline: '',
  industry: null,
  motif: null,
  style: null,
  palette: null,
  colorPrimary: '#0D0D0D',
  colorSecondary: '#C9A84C',
}

type Action =
  | { type: 'UPDATE_CONFIG'; payload: Partial<LogoConfig> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SELECT_VARIANT'; logoId: string; variantIndex: number }
  | { type: 'RESET' }

function wizardReducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(4, state.step + 1) as WizardStep }
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) as WizardStep }
    case 'SELECT_VARIANT':
      return { ...state, logoId: action.logoId, variantIndex: action.variantIndex, step: 4 }
    case 'RESET':
      return { step: 1, config: initialConfig, logoId: '', variantIndex: 0 }
    default:
      return state
  }
}

// ── Generator wizard ──────────────────────────────────────────────────────────

function Generator() {
  const [state, dispatch] = useReducer(wizardReducer, {
    step: 1,
    config: initialConfig,
    logoId: '',
    variantIndex: 0,
  })

  const updateConfig = (updates: Partial<LogoConfig>) =>
    dispatch({ type: 'UPDATE_CONFIG', payload: updates })

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      {state.step === 1 && (
        <div className="text-center mb-12 animate-[fadeUp_0.5s_ease-out_forwards]">
          <p className="text-label mb-4">KI-Logo-Generator — Pferdewelt</p>
          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
            Dein professionelles<br />
            <span className="text-gold-shimmer">Pferde-Logo</span> in Minuten
          </h1>
          <p className="text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            KI-gestützt, branchenspezifisch für die Equestrian-Welt. Einmalig €9,99 —
            kein Abo, sofort-Download mit Vektordatei &amp; Social Media Kit.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-subtle)' }}>
            <span>✓ PNG + SVG Vektor</span>
            <span>✓ Kommerzielle Rechte</span>
            <span>✓ 5 Farbvarianten</span>
            <span className="hidden sm:inline">✓ Social Media Kit</span>
          </div>
        </div>
      )}

      <StepIndicator currentStep={state.step} />

      <div
        className="card-surface p-6 sm:p-8"
        style={{ minHeight: '420px' }}
      >
        {state.step === 1 && (
          <Step1Business
            config={state.config}
            onChange={updateConfig}
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
          />
        )}
        {state.step === 2 && (
          <Step2Design
            config={state.config}
            onChange={updateConfig}
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )}
        {state.step === 3 && (
          <Step3Variants
            config={state.config}
            onSelect={(logoId, variantIndex) =>
              dispatch({ type: 'SELECT_VARIANT', logoId, variantIndex })
            }
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )}
        {state.step === 4 && (
          <Step4Checkout
            config={state.config}
            logoId={state.logoId}
            variantIndex={state.variantIndex}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )}
      </div>

      {/* Social proof strip */}
      {state.step === 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          {[
            { emoji: '⭐', text: '4.9/5 von 200+ Kunden' },
            { emoji: '⚡', text: 'Sofort-Download' },
            { emoji: '🐴', text: '15+ Jahre Equine-Expertise' },
            { emoji: '🔒', text: 'Sichere Zahlung via Stripe' },
          ].map(({ emoji, text }, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{emoji}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{text}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/impressum" element={<LegalPage />} />
          <Route path="/datenschutz" element={<LegalPage />} />
          <Route path="/agb" element={<LegalPage />} />
          <Route path="/:slug" element={<LegalPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
