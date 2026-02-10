# Eigene AI-Coding-Plattform mit Cloudflare VibeSDK

## Was ist das?

**VibeSDK** ist ein Open-Source-Projekt von Cloudflare, mit dem du deine eigene
KI-gestützte Coding-Plattform betreiben kannst — ähnlich wie
[Bolt](https://bolt.new) oder [Lovable.dev](https://lovable.dev).

Nutzer deiner Plattform beschreiben in natürlicher Sprache, was sie bauen
wollen, und die KI generiert den Code, baut die App, behebt Fehler und
deployt das Ergebnis — alles automatisch.

**Live-Demo:** [build.cloudflare.dev](https://build.cloudflare.dev)
**GitHub:** [github.com/cloudflare/vibesdk](https://github.com/cloudflare/vibesdk)

---

## Was kann die Plattform?

| Funktion | Beschreibung |
|---|---|
| KI-Code-Generierung | Du beschreibst was du willst, die KI schreibt den Code |
| Live-Vorschau | Jede App läuft sofort in einer isolierten Sandbox |
| Automatisches Debugging | Fehler werden erkannt und von der KI automatisch behoben |
| One-Click Deployment | Fertige Apps werden mit einem Klick veröffentlicht |
| Chat-Interface | Du kannst die App per Chat-Gespräch weiterentwickeln |
| GitHub-Export | Code kann direkt in ein GitHub-Repo exportiert werden |

Generiert werden **React + TypeScript + Tailwind CSS** Apps — das ist ein
moderner, weit verbreiteter Tech-Stack für Webanwendungen.

---

## Ist das anfängerfreundlich?

### Ja und Nein — ehrliche Einschätzung:

**Was einfach ist:**
- Es gibt einen "Deploy to Cloudflare"-Button (One-Click-Deployment)
- Cloudflare führt dich durch einen Einrichtungs-Assistenten
- Die meisten Felder sind schon vorausgefüllt
- Du brauchst keinen Code zu schreiben, um die Plattform zu deployen

**Was schwierig sein kann:**
- Du brauchst einen **Cloudflare-Account** und musst dich im Dashboard
  zurechtfinden
- Du brauchst einen **Google AI Studio API-Key** (für die Gemini-KI-Modelle)
- Die Einrichtung der **Umgebungsvariablen** (Environment Variables) kann
  verwirrend sein — einige Nutzer sind hier gescheitert
- Wenn die **Live-Vorschau** nicht funktioniert, musst du evtl. DNS-Einträge
  (CNAME) bei deinem Domain-Registrar anlegen
- Fehlerbehebung bei der Einrichtung erfordert Grundverständnis von
  Web-Infrastruktur

> **Erfahrungsbericht einer Nutzerin (sabrina.dev):**
> "Wenn du nicht technisch bist — ändere KEINE der vorausgefüllten Felder!
> Nutze einfach die Standardwerte."
>
> Sie hatte ein Problem mit der Preview-URL und musste einen CNAME-Eintrag
> bei ihrem Domain-Registrar hinzufügen.

---

## Was kostet das?

### Einmalige/Fixe Kosten

| Posten | Kosten |
|---|---|
| VibeSDK Software | **Kostenlos** (MIT-Lizenz, Open Source) |
| Cloudflare Workers Paid Plan | **$5/Monat** (Minimum) |
| Workers for Platforms | **$25/Monat** (für Multi-Tenant-Deployment) |

### Variable Kosten (nutzungsabhängig)

| Posten | Beschreibung |
|---|---|
| Google Gemini API | Pro generiertem Code entstehen Token-Kosten. Gemini 2.5 Flash ist relativ günstig, Gemini 2.5 Pro teurer |
| Cloudflare Containers/Sandboxes | CPU-, Speicher- und Disk-Nutzung pro Sandbox-Instanz |
| Cloudflare D1, R2, KV | Datenbank, Dateispeicher, Key-Value-Store — im Free Tier oft ausreichend |

### Realistische Schätzung für den Anfang

- **Minimum:** ~$30/Monat (Cloudflare-Infrastruktur) + Gemini-API-Kosten
- **Bei wenig Nutzung (persönlich):** $30–50/Monat
- **Bei vielen Nutzern:** Kann schnell teurer werden, hauptsächlich durch
  KI-API-Kosten und Sandbox-Nutzung

> **Tipp:** Du kannst bei Google AI Studio monatliche Limits setzen, damit
> die Kosten nicht explodieren.

---

## Was du brauchst (Schritt für Schritt)

### 1. Accounts erstellen
- [ ] **Cloudflare-Account** anlegen: [cloudflare.com](https://cloudflare.com)
- [ ] **GitHub-Account** anlegen: [github.com](https://github.com) (falls noch nicht vorhanden)
- [ ] **Google AI Studio Account** anlegen: [aistudio.google.com](https://aistudio.google.com)

### 2. API-Key besorgen
- [ ] In Google AI Studio einen **API-Key** generieren
- [ ] Billing aktivieren (für die Gemini-API)
- [ ] Monatliches Limit setzen (z.B. $10–20 zum Start)

### 3. Cloudflare vorbereiten
- [ ] Workers Paid Plan aktivieren ($5/Monat)
- [ ] Workers for Platforms Subscription aktivieren ($25/Monat)
- [ ] Optional: Eigene Domain mit Cloudflare verbinden

### 4. VibeSDK deployen
- [ ] Auf den **"Deploy to Cloudflare"**-Button im
      [GitHub-Repo](https://github.com/cloudflare/vibesdk) klicken
- [ ] GitHub-Zugang autorisieren (erstellt automatisch einen privaten Fork)
- [ ] Im Cloudflare-Dashboard die Ressourcen erstellen lassen (KV, D1, R2)
- [ ] Umgebungsvariablen eintragen:
  - `GEMINI_API_KEY` — dein Google AI Studio API-Key
  - `JWT_SECRET` — ein zufälliges Passwort für Sessions
  - `ALLOWED_EMAIL` — deine E-Mail (für Zugriffskontrolle)
- [ ] **Vorausgefüllte Felder NICHT ändern!**
- [ ] Deployment starten

### 5. Testen
- [ ] Über die generierte URL auf deine Plattform zugreifen
- [ ] Mit deiner erlaubten E-Mail einloggen
- [ ] Ein einfaches Projekt ausprobieren (z.B. "Erstelle eine To-Do-App")

---

## Wichtige Einschränkungen

### Cloudflare Lock-In
VibeSDK ist **architektonisch an Cloudflare gebunden**. Du kannst es nicht
einfach auf AWS, DigitalOcean oder einem eigenen Server betreiben. Es nutzt
Cloudflare-spezifische Technologien:
- Durable Objects (Zustandsverwaltung)
- Workers for Platforms (Multi-Tenant-Isolation)
- D1 und R2 (Datenbank und Speicher)
- Sandboxes/Containers (isolierte Entwicklungsumgebungen)

### KI-Qualität
Die Qualität der generierten Apps hängt stark vom verwendeten KI-Modell ab.
Gemini-Modelle sind gut, aber nicht perfekt. Komplexe Apps werden
wahrscheinlich Nacharbeit erfordern.

### Nicht für jede App geeignet
VibeSDK generiert standardmässig **React + TypeScript + Tailwind** Apps. Wenn
du andere Technologien brauchst (z.B. Python, Mobile Apps, WordPress), ist
das nicht ohne Weiteres möglich.

---

## Alternativen zum Vergleich

| Plattform | Typ | Kosten | Vorteil |
|---|---|---|---|
| **Bolt.new** | SaaS | Ab $0 (Free Tier) | Sofort nutzbar, kein Setup |
| **Lovable.dev** | SaaS | Ab $0 (Free Tier) | Sofort nutzbar, gute UX |
| **VibeSDK** | Self-Hosted | ~$30+/Monat | Volle Kontrolle, keine Nutzerlimits |
| **Replit** | SaaS | Ab $0 (Free Tier) | Einfach, auch für Anfänger |
| **v0.dev** (Vercel) | SaaS | Ab $0 (Free Tier) | Gut für UI-Komponenten |

### Empfehlung für Anfänger

Wenn du **Anfänger bist und nicht programmieren kannst**, ist der einfachste
Weg:

1. **Zuerst ausprobieren:** Teste die Live-Demo auf
   [build.cloudflare.dev](https://build.cloudflare.dev) kostenlos
2. **Alternativen testen:** Probiere auch [Bolt.new](https://bolt.new) und
   [Lovable.dev](https://lovable.dev) aus — die funktionieren sofort ohne Setup
3. **Dann entscheiden:** Wenn du die volle Kontrolle willst und bereit bist
   ~$30+/Monat zu zahlen, deploye VibeSDK

Der Vorteil von VibeSDK gegenüber Bolt/Lovable: **Keine Nutzungslimits**
(ausser deinem eigenen Budget), du kannst es anpassen, und du kannst es
sogar kommerziell nutzen und anderen Leuten zur Verfügung stellen.

---

## Fazit

VibeSDK ist ein beeindruckendes Projekt, aber sei realistisch:

- **Deployen** ist dank One-Click relativ einfach — aber nicht fehlerfrei
- **Probleme lösen** wenn etwas nicht funktioniert, erfordert technisches
  Grundwissen oder Geduld + Recherche
- **Laufende Kosten** von mindestens ~$30/Monat solltest du einplanen
- **Für den Anfang** ist es sinnvoller, zuerst die kostenlosen Alternativen
  (Bolt, Lovable, die VibeSDK-Demo) auszuprobieren

Wenn du trotzdem loslegen willst: Folge der Schritt-für-Schritt-Anleitung
oben und lass dich nicht entmutigen, wenn beim ersten Mal etwas nicht klappt.

---

## Quellen

- [Cloudflare Blog: Deploy your own AI vibe coding platform](https://blog.cloudflare.com/deploy-your-own-ai-vibe-coding-platform/)
- [GitHub: cloudflare/vibesdk](https://github.com/cloudflare/vibesdk)
- [Cloudflare Sandbox Pricing](https://developers.cloudflare.com/sandbox/platform/pricing/)
- [Sabrina.dev: I built my own vibe coding platform with VibeSDK](https://www.sabrina.dev/p/i-built-my-own-vibe-coding-platform-vibesdk)
- [MarkTechPost: CloudFlare AI Team Open-Sourced VibeSDK](https://www.marktechpost.com/2025/09/23/cloudflare-ai-team-just-open-sourced-vibesdk-that-lets-anyone-build-and-deploy-a-full-ai-vibe-coding-platform-with-a-single-click/)
- [Cloudflare Reference Architecture](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-vibe-coding-platform/)
