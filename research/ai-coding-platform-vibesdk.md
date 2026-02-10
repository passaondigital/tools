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

## Kostenvergleich: Deine aktuelle Situation vs. VibeSDK

> Du zahlst aktuell **100€+/Monat** für Lovable Pro + Bolt.new Credits und
> stösst trotzdem an Limits. Hier der direkte Vergleich:

### Was du jetzt zahlst (geschätzt)

| Plattform | Plan | Kosten/Monat | Was du bekommst |
|---|---|---|---|
| **Lovable.dev Pro** | $25/Monat (~23€) | ~23€ | 100 Credits + 5/Tag (max ~150/Monat) |
| **Bolt.new Pro** | $20–50/Monat | ~19–47€ | 10–26M Tokens |
| **Extra Credits/Reloads** | variabel | ~30–50€+ | Wenn die Credits nicht reichen |
| **GESAMT** | | **~100€+/Monat** | **Mit harten Limits** |

### Das Problem mit Credits

- **Lovable:** Ein einfacher Button-Farbwechsel kostet ~0.5 Credits, eine
  ganze App-Struktur 2+ Credits. Bei 150 Credits/Monat bist du bei intensiver
  Nutzung schnell am Limit.
- **Bolt.new:** Token-Verbrauch ist aggressiv! Nutzer berichten, dass eine
  einfache Auth-Bug-Behebung **3–5 Millionen Tokens** verschlingen kann.
  Manche verlieren 1.3M Tokens an einem einzigen Tag.
- **Dein Screenshot-Workflow** (Screenshot -> LLM -> Code einsetzen) kostet
  extra Zeit UND die Credits laufen trotzdem weiter.

### Was VibeSDK kosten würde

| Posten | Kosten/Monat | Beschreibung |
|---|---|---|
| Cloudflare Workers Paid | ~5€ | Basis-Infrastruktur |
| Workers for Platforms | ~23€ | Für App-Deployment |
| **Gemini 2.5 Flash API** | ~5–15€ | Günstigstes brauchbares Modell |
| **Gemini 2.5 Pro API** | ~15–40€ | Bessere Qualität, teurer |
| Cloudflare D1/R2/KV | ~0€ | Meist im Free Tier |
| Containers/Sandboxes | ~2–10€ | Je nach Nutzung |
| **GESAMT (Flash)** | **~35–53€/Monat** | **OHNE jedes Limit** |
| **GESAMT (Pro)** | **~45–78€/Monat** | **OHNE jedes Limit** |

### Der entscheidende Unterschied

| | Lovable + Bolt | VibeSDK |
|---|---|---|
| **Kosten** | ~100€+/Monat | ~35–78€/Monat |
| **Limits** | Harte Credit/Token-Grenzen | Keine künstlichen Limits (s.u.) |
| **Wenn Credits leer** | Warten oder nachkaufen | Einfach weitermachen |
| **Error-Loops** | Fressen deine Credits auf | Kosten nur API-Tokens |
| **Screenshot-Workflow** | Nötig bei Problemen | Eingebautes Auto-Debugging |
| **Anpassbar** | Nein, du nimmst was du kriegst | Ja, Open Source |
| **Eigene Domain** | Aufpreis / höherer Plan | Ja, inkludiert |

---

## Was "Keine Limits" wirklich bedeutet (und was nicht)

### Prompting / KI-Chat (UNLIMITIERT)

Es gibt **kein Credit-System** wie bei Lovable (150 Credits/Monat) oder
Bolt (10M Tokens). Du kannst so viel prompten wie du willst — 10 Nachrichten
oder 10.000 am Tag. Du bezahlst nur die tatsächlichen Gemini API-Kosten:

| Aktion | Geschätzte Kosten (Gemini 2.5 Flash) |
|---|---|
| 1 Prompt/Antwort (einfach) | ~$0.001–0.005 (Bruchteil eines Cents) |
| 1 App komplett generieren | ~$0.02–0.05 (2–5 Cent) |
| Error-Loop (10 Versuche) | ~$0.10–0.20 (10–20 Cent) |
| Intensiver Tag (50+ Prompts) | ~$0.50–2.00 |
| Ganzer Monat (Heavy Use) | ~$5–30 je nach Modell |

**Kein "Credits sind leer — warte bis morgen".** Du bezahlst einfach was du
verbrauchst. Und bei Gemini Flash ist das extrem günstig.

### App-Entwicklung / Tools bauen (UNLIMITIERT)

- Du kannst **unbegrenzt viele Projekte** anlegen
- Du kannst **unbegrenzt Code generieren** lassen
- Jedes Projekt bekommt eine eigene Sandbox (isolierte Umgebung)
- Die Sandboxen **skalieren auf Null** — wenn du nicht arbeitest, zahlst du
  kein CPU/Memory

### Deployment / Apps veröffentlichen (UNLIMITIERT mit Kosten)

Workers for Platforms erlaubt eine **unbegrenzte Anzahl an deployten Apps**.
Das ist der grosse Unterschied zu normalen Cloudflare Workers (max 500).

Jede deployte App:
- Bekommt eine eigene URL
- Läuft isoliert von anderen Apps
- Kostet nur bei tatsächlicher Nutzung (Requests)

**Inkludiert im $5/Mo Workers Paid Plan:**
- 10 Millionen Requests/Monat
- 30 Millionen CPU-Millisekunden/Monat
- Darüber hinaus: $0.30 pro weitere Million Requests

Für persönliche Projekte oder kleine Apps reicht das locker.

### Was tatsächlich Grenzen hat

| Ressource | Inkludiert (Paid Plan) | Danach |
|---|---|---|
| **Worker Requests** | 10M/Monat | $0.30 pro 1M |
| **CPU-Zeit** | 30M CPU-ms/Monat | $0.02 pro 1M CPU-ms |
| **KV Reads** | 10M/Monat | $0.50 pro 1M |
| **KV Writes** | 1M/Monat | $5.00 pro 1M |
| **KV Storage** | 1 GB | $0.50 pro GB |
| **D1 (Datenbank)** | Max 10 GB pro DB | Rows Read/Written kosten |
| **R2 (Dateispeicher)** | 10 GB + 1M Writes | $0.015/GB/Monat |
| **Container CPU** | Im Plan inkl. | $0.00002/vCPU-Sekunde |
| **Container Memory** | Im Plan inkl. | Pro GiB-Sekunde |

**Wichtig:** Diese Grenzen sind **weiche Grenzen** — du wirst nicht
abgeschnitten wie bei Lovable. Du zahlst einfach den Mehrverbrauch.
Bei normalem Gebrauch (ein paar Projekte, persönliche Nutzung) bleibst du
sehr wahrscheinlich unter den inkludierten Kontingenten.

### Zusammenfassung: Lovable-Limits vs. VibeSDK

| Situation | Lovable Pro | VibeSDK |
|---|---|---|
| Du hast 150 Credits verbraucht | **STOPP.** Warten oder nachkaufen. | Weitermachen. Kostet ein paar Cent. |
| Error-Loop frisst 20 Credits | 20 Credits = ~14€ weg | 20 Cent Gemini-Kosten |
| Du willst 5 Apps an einem Tag bauen | Evtl. nicht genug Credits | Kein Problem, ~25 Cent |
| Du willst 10 Apps deployen | Deployment-Limits möglich | Unbegrenzt, jede App kriegt URL |
| Monatsende, Budget knapp | Credits rationieren | Gemini-Limit setzen, z.B. $5 |

### Rechenbeispiel: Gemini API-Kosten im Detail

Bei VibeSDK zahlst du direkt an Google — **ohne Plattform-Aufschlag**:

**Gemini 2.5 Flash** (Standard für Code-Generierung):
- Input: $0.15 pro 1M Tokens
- Output: $0.60 pro 1M Tokens
- 1 App generieren (ca. 50K Input + 20K Output) = **~$0.02** (2 Cent!)
- 100 Apps/Monat = **~$2**
- 500 Chat-Nachrichten/Monat (mit Debugging) = **~$5–10**

**Gemini 2.5 Pro** (für komplexere Projekte):
- Input: $1.25 pro 1M Tokens
- Output: $10.00 pro 1M Tokens
- Gleiche Nutzung wie oben = **~$15–30/Monat**

> **Zum Vergleich:** Bei Lovable bezahlst du effektiv **~0.70€ pro Credit**.
> Bei VibeSDK mit Gemini Flash kostet die gleiche Aktion oft nur **2–5 Cent**.

### Empfehlung für deine Situation

Du bist **kein normaler Anfänger** — du bist ein erfahrener Vibe-Coder, der:
- Schon mit mehreren Plattformen gearbeitet hat (Bolt, Lovable, Rocket, Bubble)
- Den Screenshot -> LLM -> Fix-Workflow beherrscht
- Sich nicht von Fehlern abschrecken lässt
- Echte Projekte baut (Hufmanager!)

**VibeSDK lohnt sich für dich**, weil:
1. **Kostenersparnis:** ~35–53€ statt 100€+ (bei Gemini Flash)
2. **Keine Limits:** Kein Credit-Stress, kein "oh nein, nur noch 5 Credits"
3. **Error-Loops kosten fast nichts:** Wenn die KI 10 Versuche braucht,
   kostet das bei Flash vielleicht 20 Cent statt 10 Credits
4. **Lerneffekt:** Du verstehst besser wie alles zusammenhängt

---

## Alternativen zum Vergleich (detailliert)

### Preisvergleich aller Plattformen

| Plattform | Typ | Einstieg | "Power-User" | Limits |
|---|---|---|---|---|
| **Bolt.new Pro** | SaaS | $20/Mo (10M Tokens) | $100/Mo (55M Tokens) | Token-basiert, aggressiver Verbrauch |
| **Lovable.dev Pro** | SaaS | $25/Mo (150 Credits) | $50/Mo (Business) | Credit-basiert, kein Rollover tägl. |
| **VibeSDK** | Self-Hosted | ~$35/Mo | ~$50–80/Mo | **Keine Limits** |
| **Replit** | SaaS | $0 (Free) | $25/Mo | Compute-basiert |
| **v0.dev** | SaaS | $0 (Free) | $20/Mo | Message-basiert |
| **Rocket.new** | SaaS | variabel | variabel | variabel |

### Was für wen am besten ist

- **Gelegentliche Nutzung (< 1 Projekt/Monat):** Lovable Free + Bolt Free reicht
- **Regelmässige Nutzung (deine Situation):** **VibeSDK** spart Geld
- **Team/Agentur:** VibeSDK (keine pro-User-Kosten)
- **Maximale Bequemlichkeit:** Lovable/Bolt (kein Setup nötig)

---

## Fazit: Lohnt sich VibeSDK für dich?

**Ja, sehr wahrscheinlich.** Hier ist warum:

- Du sparst **40–65€/Monat** im Vergleich zu deinem jetzigen Setup
- Du hast **keine Credit-Limits** mehr — der grösste Schmerzpunkt fällt weg
- Error-Debugging-Loops (die bei dir oft vorkommen) kosten fast nichts
- Du bist schon gewohnt, mit Fehlern umzugehen — das Cloudflare-Setup
  wirst du hinbekommen

**Risiken:**
- Einmalig ~2–4 Stunden für Setup einplanen (mit Troubleshooting)
- Du bist an Cloudflare gebunden (kein Wechsel zu AWS etc.)
- VibeSDK generiert nur React/TypeScript — wenn du andere Stacks brauchst,
  ist das ein Problem
- Die Code-Qualität hängt vom Gemini-Modell ab (aber du kannst auch
  Anthropic/OpenAI-Modelle einbinden über den AI Gateway)

**Nächster Schritt:** Teste erstmal die Demo auf
[build.cloudflare.dev](https://build.cloudflare.dev) — wenn dir die
Oberfläche gefällt, lohnt sich das eigene Deployment.

---

## Quellen

- [Cloudflare Blog: Deploy your own AI vibe coding platform](https://blog.cloudflare.com/deploy-your-own-ai-vibe-coding-platform/)
- [GitHub: cloudflare/vibesdk](https://github.com/cloudflare/vibesdk)
- [Cloudflare Sandbox Pricing](https://developers.cloudflare.com/sandbox/platform/pricing/)
- [Sabrina.dev: I built my own vibe coding platform with VibeSDK](https://www.sabrina.dev/p/i-built-my-own-vibe-coding-platform-vibesdk)
- [MarkTechPost: CloudFlare AI Team Open-Sourced VibeSDK](https://www.marktechpost.com/2025/09/23/cloudflare-ai-team-just-open-sourced-vibesdk-that-lets-anyone-build-and-deploy-a-full-ai-vibe-coding-platform-with-a-single-click/)
- [Cloudflare Reference Architecture](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-vibe-coding-platform/)
- [Google Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Lovable.dev Pricing](https://www.superblocks.com/blog/lovable-dev-pricing)
- [Bolt.new Pricing](https://bolt.new/pricing)
