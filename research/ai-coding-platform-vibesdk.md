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

### KI-Modelle: Nicht nur Gemini — auch Claude, GPT & mehr!

VibeSDK ist **Open Source (MIT-Lizenz)** und nutzt den **Cloudflare AI Gateway**
als Routing-Layer. Das bedeutet:

**Du kannst das KI-Modell frei wählen und wechseln:**

| Provider | Modelle (Beispiele) | Format |
|---|---|---|
| **Google** | Gemini 2.5 Pro, Flash, Flash-Lite | `google/gemini-2.5-pro` |
| **Anthropic** | Claude Opus, Sonnet, Haiku | `anthropic/claude-sonnet-4-5` |
| **OpenAI** | GPT-4o, o1, o3 | `openai/gpt-4o` |
| **xAI** | Grok | `xai/grok-...` |
| **Groq** | LLaMA, Mixtral (schnell!) | `groq/llama-...` |
| **+ 350 weitere** | Über AI Gateway verfügbar | `provider/model` |

**So wechselst du das Modell:**
Du änderst einfach den `model`-Parameter im Format `provider/modellname`.
Kein Code-Umbau nötig — nur eine Config-Änderung.

**Vorteile des AI Gateways:**
- **Unified Billing:** Alle Modell-Kosten über eine Cloudflare-Rechnung
- **Fallback:** Wenn ein Provider ausfällt, wird automatisch ein anderer genommen
- **Caching:** Häufige Anfragen werden gecacht (spart Geld!)
- **Observability:** Du siehst genau welches Modell wie viele Tokens verbraucht
- **Mix & Match:** Günstiges Modell (Flash) für einfache Tasks,
  teures Modell (Claude/GPT-4o) für komplexe Tasks

**Was das für dich bedeutet:**
- Du kannst mit **Gemini Flash** starten (am günstigsten)
- Für schwierige Projekte auf **Claude** oder **GPT-4o** wechseln
- Du bist an **keinen einzelnen KI-Anbieter gebunden**
- Wenn ein neues besseres Modell rauskommt, einfach eintragen und nutzen

### KI-Qualität allgemein
Die Qualität der generierten Apps hängt stark vom verwendeten KI-Modell ab.
Kein Modell ist perfekt. Komplexe Apps werden wahrscheinlich Nacharbeit
erfordern — aber du kennst das ja schon von Lovable.

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

## Dein konkretes Setup: Hufmanager, Supabase, All-Inkl Domain

### Brauchst du einen teuren VPS? NEIN!

VibeSDK läuft komplett auf **Cloudflare's Serverless-Infrastruktur**.
Du brauchst:

| Brauchst du... | Antwort |
|---|---|
| Einen VPS (Virtual Server)? | **NEIN.** Alles läuft auf Cloudflare. |
| Einen eigenen Server? | **NEIN.** Serverless = kein Server nötig. |
| Linux-Admin-Kenntnisse? | **NEIN.** Kein Server = nichts zu administrieren. |
| Docker/Kubernetes? | **NEIN.** Cloudflare macht das alles. |
| Ein teures Hosting-Paket? | **NEIN.** Nur den Cloudflare Workers Paid Plan ($5/Mo). |

**Das ist der grosse Vorteil von Serverless:** Du zahlst nur was du nutzt,
es gibt keinen Server der 24/7 läuft und Geld kostet, und Cloudflare
kümmert sich um Updates, Sicherheit und Skalierung.

### Supabase weiter nutzen: JA, problemlos!

Dein Hufmanager-Setup (React Frontend via Lovable + Supabase als Datenbank)
ist **genau der gleiche Tech-Stack** den VibeSDK generiert:

**Lovable generiert:** React + TypeScript + Tailwind + Supabase
**VibeSDK generiert:** React + TypeScript + Tailwind + (beliebige DB)

Das heisst:
- **Supabase bleibt.** Deine Datenbank, Auth, API — alles bleibt bestehen.
- **Supabase Free Tier** reicht für viele Projekte (500 MB DB, 1 GB Storage,
  50.000 Auth-User)
- Du gibst in VibeSDK einfach an: "Nutze Supabase als Backend" — die KI
  generiert den passenden Code mit `@supabase/supabase-js`
- Deine bestehenden Supabase-Projekte (Hufmanager) sind davon unberührt

**Kosten Supabase:**

| Plan | Kosten | Was du bekommst |
|---|---|---|
| Free | $0/Monat | 500 MB DB, 1 GB Storage, 50K Auth-User |
| Pro | $25/Monat | 8 GB DB, 100 GB Storage, unbegr. Auth-User |

Für die meisten Projekte reicht der **Free Tier** von Supabase völlig aus.

### Deine All-Inkl Domain nutzen: JA, möglich!

Du kannst deine kostenlose All-Inkl Domain für VibeSDK verwenden.
Es gibt **zwei Wege**:

#### Weg 1: Nameserver zu Cloudflare umstellen (empfohlen)

1. Domain in Cloudflare hinzufügen (kostenloser Plan reicht)
2. In der All-Inkl **Members Area** → Domainverwaltung → Nameserver ändern
3. Die Cloudflare-Nameserver eintragen (z.B. `adam.ns.cloudflare.com`)
4. Warten bis die Änderung propagiert ist (~1–24 Stunden)
5. In Cloudflare Workers eine **Custom Domain** anlegen
6. Fertig — deine VibeSDK-Plattform läuft unter deiner Domain

**All-Inkl hat dafür sogar eine eigene Anleitung:**
[all-inkl.com/anleitungen/cloudflare](https://all-inkl.com/wichtig/anleitungen/kas/tools/dns-werkzeuge/cloudflare_491.html)

**Wichtig:** Dein All-Inkl Hosting-Paket bleibt bestehen. Du änderst nur
die Nameserver — E-Mail und andere Dienste können weiterlaufen.

#### Weg 2: Subdomain per CNAME (wenn Nameserver bei All-Inkl bleiben sollen)

1. In All-Inkl KAS → Tools → DNS-Einstellungen
2. CNAME-Eintrag anlegen: `app.deinedomain.de` → `dein-projekt.workers.dev`
3. **Einschränkung:** Funktioniert nur für Subdomains, nicht für die
   Hauptdomain. Und Workers Custom Domains brauchen eigentlich
   Cloudflare-Nameserver.

**Empfehlung:** Weg 1 ist einfacher und zuverlässiger.

### Komplettes Kosten-Setup: 3 Optionen

#### Option A: Volles VibeSDK (eigene Plattform) — ~33–43€/Monat

Du betreibst deine **eigene komplette Coding-Plattform** wie Bolt/Lovable.
Apps werden per Knopfdruck deployed, jede bekommt eine eigene URL.

| Posten | Kosten/Monat | Nötig? |
|---|---|---|
| All-Inkl Domain | 0€ | Im Paket |
| Cloudflare Free Plan (DNS) | 0€ | Ja |
| **Cloudflare Workers Paid** | **~5€** | **JA** — VibeSDK-Backend läuft darauf |
| **Workers for Platforms** | **~23€** | **JA** — für One-Click-App-Deployment |
| Supabase Free Tier | 0€ | Optional |
| Gemini Flash API | ~5–15€ | Ja |
| **GESAMT** | **~33–43€/Mo** | |

**Wann diese Option wählen:**
- Du willst die volle Bolt/Lovable-Erfahrung
- Du willst Apps mit einem Klick deployen
- Du willst die Plattform evtl. auch anderen anbieten
- Du brauchst Live-Preview in Sandboxen

#### Option B: VibeSDK-Demo + Gratis-Hosting — ~0–15€/Monat (!)

Du nutzt die **kostenlose Demo** auf
[build.cloudflare.dev](https://build.cloudflare.dev) zum Generieren,
exportierst den Code nach **GitHub**, und deployst gratis auf
**Cloudflare Pages** oder **Vercel**.

| Posten | Kosten/Monat | Nötig? |
|---|---|---|
| build.cloudflare.dev (Demo) | 0€ | Kostenlos nutzbar |
| GitHub | 0€ | Kostenlos |
| **Cloudflare Pages** | **0€** | Gratis: 500 Builds/Mo, unlim. Bandwidth |
| **ODER Vercel Free** | **0€** | Gratis: Hobby-Plan, perfekt für React |
| Supabase Free Tier | 0€ | Datenbank gratis |
| Gemini API (falls eigene Keys) | 0–15€ | Nur wenn du eigene Keys nutzt |
| **GESAMT** | **~0–15€/Mo** | |

**Workflow:**
1. Auf build.cloudflare.dev dein Projekt beschreiben
2. Die KI generiert den Code
3. Code nach GitHub exportieren (Button in VibeSDK)
4. GitHub-Repo mit Cloudflare Pages oder Vercel verbinden
5. Jeder Push = automatisches Deployment, kostenlos

**Wann diese Option wählen:**
- Du willst **so günstig wie möglich**
- Du baust Apps hauptsächlich für dich selbst
- Du kennst schon den GitHub-Workflow (Hufmanager!)
- Dir ist egal ob du 2 Klicks mehr brauchst zum Deployen

**Einschränkung:**
- Die Demo auf build.cloudflare.dev hat evtl. Nutzungslimits
  (Rate Limiting, Fair-Use)
- Kein eigenes Dashboard, keine volle Kontrolle
- Keine Live-Preview in Sandboxen — du siehst das Ergebnis erst
  nach dem Deploy

#### Option C: Ganz ohne VibeSDK — 0€/Monat

Du machst weiter wie bisher mit dem Screenshot-Workflow, aber
deployst deine Apps **gratis** statt über Lovable:

| Posten | Kosten/Monat |
|---|---|
| Lovable/Bolt Free Tier | 0€ (für kleine Änderungen) |
| ChatGPT/Gemini Free | 0€ |
| GitHub | 0€ |
| Cloudflare Pages / Vercel | 0€ |
| Supabase Free | 0€ |
| **GESAMT** | **0€/Mo** |

**Workflow:**
1. Lovable/Bolt Free Tier für den Grossteil nutzen
2. Bei Limit: Screenshot → ChatGPT/Gemini → Code manuell einfügen
3. Code via GitHub auf Cloudflare Pages deployen

**Wann diese Option wählen:**
- Du willst **null Kosten**
- Du bist Geduld gewohnt (Screenshot-Workflow)
- Du brauchst nur wenige Projekte

---

### Vergleich der 3 Optionen

| | Option A (Voll) | Option B (Demo+Gratis) | Option C (Manuell) |
|---|---|---|---|
| **Kosten** | ~33–43€/Mo | ~0–15€/Mo | 0€/Mo |
| **Prompting** | Unlimitiert | Demo-Limits | Free-Tier Limits |
| **Deployment** | One-Click | GitHub → Pages (2 Min) | Manuell |
| **Live-Preview** | Ja, in Sandbox | Nein | Nein |
| **Komfort** | Wie Lovable/Bolt | Fast wie Lovable | Screenshot-Workflow |
| **Braucht WfP ($23)?** | **JA** | **NEIN** | **NEIN** |
| **Braucht Workers ($5)?** | **JA** | **NEIN** | **NEIN** |

### Meine Empfehlung: Starte mit Option B!

1. **Teste build.cloudflare.dev** — generiere ein paar Apps kostenlos
2. **Exportiere nach GitHub** und deploye auf Cloudflare Pages (gratis)
3. **Wenn dir die Demo-Limits nicht reichen** → upgrade auf Option A
4. So sparst du erstmal 100% und siehst ob dir das Konzept taugt

**Kostenlos dabei (in allen Optionen):**
- Deine All-Inkl Domain
- Cloudflare DNS + Pages (Free Plan)
- Supabase Datenbank (Free Tier)
- GitHub (Free)
- Cloudflare SSL-Zertifikate (automatisch)
- Vercel Hobby-Plan (Free)

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
- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [All-Inkl Cloudflare Anleitung](https://all-inkl.com/wichtig/anleitungen/kas/tools/dns-werkzeuge/cloudflare_491.html)
- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase for Vibe Coders](https://supabase.com/solutions/vibe-coders)
