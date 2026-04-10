export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.04)]">
      <a href="/" className="flex items-center gap-3 no-underline">
        <div className="w-9 h-9 rounded-lg bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center animate-[horseFloat_4s_ease-in-out_infinite]">
          <span className="text-lg leading-none">🐴</span>
        </div>
        <div>
          <span className="font-display font-bold text-lg text-[#E8E4DD] tracking-wide">HorseLogo</span>
          <span className="text-[#C9A84C]">.de</span>
        </div>
      </a>
      <div className="flex items-center gap-4">
        <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
          KI-Generator aktiv
        </span>
        <a
          href="/beispiele"
          className="text-xs font-semibold px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,76,0.3)] transition-all"
          style={{ color: 'var(--text-muted)' }}
        >
          Beispiele
        </a>
      </div>
    </header>
  )
}
