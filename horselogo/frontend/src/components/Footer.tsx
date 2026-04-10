export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.04)] mt-16 px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            © 2026 HorseLogo.de — Pascal Schmid, Barhuf Service Schmid
          </span>
        </div>
        <div className="flex items-center gap-4">
          {[
            { href: '/impressum', label: 'Impressum' },
            { href: '/datenschutz', label: 'Datenschutz' },
            { href: '/agb', label: 'AGB' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-xs hover:text-[#C9A84C] transition-colors"
              style={{ color: 'var(--text-subtle)' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
