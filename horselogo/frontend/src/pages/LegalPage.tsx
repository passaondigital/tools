import { useParams } from 'react-router-dom'

const CONTENT: Record<string, { title: string; body: string[] }> = {
  impressum: {
    title: 'Impressum',
    body: [
      'Angaben gemäß § 5 TMG',
      'Pascal Schmid',
      'Barhuf Service Schmid',
      'c/o Postflex #10643',
      'Emsdettener Str. 10',
      '48268 Greven',
      '',
      'Kontakt:',
      'E-Mail: teamhufmanager@gmail.com',
      'Support: support@hufmanager.de',
      '',
      'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:',
      'Pascal Schmid (Anschrift wie oben)',
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    body: [
      '1. Verantwortlicher',
      'Pascal Schmid, Barhuf Service Schmid (Adresse s. Impressum)',
      '',
      '2. Erhobene Daten',
      'Bei der Logo-Generierung und dem Kaufprozess verarbeiten wir: E-Mail-Adresse, IP-Adresse, Konfigurationsdaten des Logos, Zahlungsdaten (über Stripe).',
      '',
      '3. Zahlungsabwicklung',
      'Zahlungen werden über Stripe Payments Europe Ltd. abgewickelt. Stripe unterliegt der DSGVO. Wir speichern keine Kreditkartendaten.',
      '',
      '4. KI-generierte Inhalte',
      'Logos werden mithilfe KI-basierter Bildgenerierung erstellt. Eingabedaten (Unternehmensname, Konfiguration) werden zur Prompt-Erstellung verwendet.',
      '',
      '5. Rechte',
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Kontakt: support@hufmanager.de',
      '',
      '6. Cookies',
      'Diese Website verwendet ausschließlich technisch notwendige Cookies (Session-Management). Es werden keine Tracking-Cookies ohne Einwilligung gesetzt.',
    ],
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    body: [
      '§1 Geltungsbereich',
      'Diese AGB gelten für alle Verträge zwischen Pascal Schmid (Barhuf Service Schmid) und dem Käufer über das Portal HorseLogo.de.',
      '',
      '§2 Vertragsgegenstand',
      'Gegenstand ist die einmalige Bereitstellung eines KI-generierten Logos als digitale Datei (PNG, SVG, Paket). Der Preis beträgt €9,99 inkl. MwSt.',
      '',
      '§3 Nutzungsrechte',
      'Mit dem Kauf erhältst du ein nicht-exklusives, weltweites, zeitlich unbefristetes Nutzungsrecht für kommerzielle und private Zwecke. Eine Weiterveräußerung der Rohdateien ist nicht gestattet.',
      '',
      '§4 Widerrufsrecht',
      'Das Widerrufsrecht erlischt vorzeitig, sobald der Download-Link bereitgestellt und vom Käufer genutzt wurde (§356 Abs. 5 BGB). Du stimmst der Lieferung vor Ablauf der Widerrufsfrist ausdrücklich zu.',
      '',
      '§5 KI-generierte Inhalte',
      'Die Logos werden durch KI-Modelle generiert. Es kann nicht ausgeschlossen werden, dass ähnliche Designs für andere Käufer erstellt wurden. Eine Exklusivitätsgarantie wird nicht übernommen.',
      '',
      '§6 Haftungsbeschränkung',
      'Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Eine Haftung für die kommerzielle Verwendbarkeit oder Einzigartigkeit des Logos wird nicht übernommen.',
    ],
  },
}

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>()
  const content = CONTENT[slug ?? '']

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Seite nicht gefunden.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <a href="/" className="text-label hover:text-[#C9A84C] transition-colors mb-8 block">← Zurück</a>
      <h1 className="text-display text-4xl mb-8">{content.title}</h1>
      <div className="space-y-2">
        {content.body.map((line, i) =>
          line === '' ? (
            <div key={i} className="h-3" />
          ) : line.startsWith('§') || /^\d+\./.test(line) ? (
            <h3 key={i} className="text-sm font-semibold text-[#E8E4DD] mt-4">{line}</h3>
          ) : (
            <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{line}</p>
          )
        )}
      </div>
    </div>
  )
}
