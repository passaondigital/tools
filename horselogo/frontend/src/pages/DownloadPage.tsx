import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getDownloadInfo } from '../lib/api'

export default function DownloadPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order_id') ?? ''
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('Keine Bestellnummer gefunden.')
      setLoading(false)
      return
    }
    getDownloadInfo(orderId)
      .then(({ zipUrl }) => {
        setDownloadUrl(zipUrl)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [orderId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p style={{ color: 'var(--text-muted)' }}>Bereite deinen Download vor…</p>
        </div>
      ) : error ? (
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-display text-2xl mb-2">Download nicht verfügbar</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
          <a href="/" className="btn-inactive px-6 py-3 text-sm inline-block rounded-lg">
            Zur Startseite
          </a>
        </div>
      ) : (
        <div className="text-center max-w-md animate-[fadeUp_0.4s_ease-out_forwards]">
          <div className="w-20 h-20 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-display text-3xl mb-2">
            Danke für deinen <span className="text-gold-shimmer">Kauf!</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Dein professionelles Pferde-Logo ist bereit. Alle Dateien sind in der ZIP enthalten.
          </p>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="btn-cta inline-block w-full py-5 text-lg font-bold mb-4"
            >
              ⬇ Logo-Paket herunterladen
            </a>
          )}

          <div className="card p-4 text-left">
            <p className="text-label mb-3">Im Paket enthalten:</p>
            <ul className="space-y-1.5">
              {[
                'PNG 3000×3000px (transparent)',
                'SVG Vektordatei',
                '5 Farbvarianten',
                'Social Media Kit',
                'Visitenkarten-Layout',
              ].map((item, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className="text-[#C9A84C]">✓</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] mt-4" style={{ color: 'var(--text-subtle)' }}>
            Bei Fragen: <a href="mailto:support@hufmanager.de" className="underline hover:text-[#C9A84C] transition-colors">support@hufmanager.de</a>
          </p>
        </div>
      )}
    </div>
  )
}
