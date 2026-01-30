# German E-Book Generator

Ein professioneller E-Book-Generator auf Deutsch mit PDF- und DOCX-Export.

## Features

- **Professionelles Layout**: Titelseite, Inhaltsverzeichnis, Kapitel, Abschnitte
- **Mehrere Exportformate**: PDF und DOCX
- **Flexible Stilvorlagen**: Verschiedene Seitenformate, Schriftarten und -größen
- **Vollständig auf Deutsch**: Alle Bezeichnungen und die API sind auf Deutsch
- **CLI und Python-API**: Nutzbar über Kommandozeile oder programmatisch
- **Markdown-Unterstützung**: Fett, kursiv und unterstrichen im Text
- **Bilder-Unterstützung**: Bilder mit Bildunterschriften einfügen
- **JSON-Import/Export**: E-Book-Struktur speichern und laden

## Installation

```bash
cd german-ebook-generator
pip install -e .
```

Oder mit allen Entwicklungsabhängigkeiten:

```bash
pip install -e ".[dev]"
```

## Schnellstart

### Kommandozeile (CLI)

```bash
# Demo-E-Book erstellen
ebook-generator demo --output mein_demo

# Eigenes E-Book erstellen
ebook-generator create \
    --titel "Mein Buch" \
    --autor "Max Mustermann" \
    --untertitel "Ein tolles Buch" \
    --output mein_buch.pdf \
    --format beide

# Mit Kapiteln aus Textdateien
ebook-generator create \
    --titel "Mein Roman" \
    --autor "Anna Schmidt" \
    --kapitel "Kapitel 1" kapitel1.txt \
    --kapitel "Kapitel 2" kapitel2.txt \
    --vorwort vorwort.txt \
    --output roman.pdf

# JSON-Datei konvertieren
ebook-generator convert mein_buch.json --output mein_buch --format beide

# Informationen anzeigen
ebook-generator info mein_buch.json
```

### Python-API

```python
from ebook_generator import EBookGenerator, Seitenformat

# Generator erstellen
generator = EBookGenerator(
    titel="Mein erstes Buch",
    autor="Max Mustermann",
    untertitel="Eine spannende Geschichte",
)

# Stil anpassen
generator.stil_anpassen(
    seitenformat=Seitenformat.A5,
    schriftgroesse_text=11,
)

# Inhalte hinzufügen
generator.widmung_setzen("Für meine Familie")
generator.vorwort_setzen("Willkommen zu diesem Buch...")

# Kapitel hinzufügen
kap1 = generator.kapitel_hinzufuegen(
    titel="Einleitung",
    inhalt="Dies ist der **Anfang** unserer *Geschichte*..."
)

# Abschnitte hinzufügen
generator.abschnitt_hinzufuegen(
    kapitel=kap1,
    ueberschrift="Der erste Tag",
    inhalt="Es war einmal..."
)

# Weiteres Kapitel
kap2 = generator.kapitel_hinzufuegen(
    titel="Die Reise beginnt",
    inhalt="Am nächsten Morgen..."
)

# Nachwort
generator.nachwort_setzen("Danke fürs Lesen!")

# Exportieren
generator.als_pdf("mein_buch.pdf")
generator.als_docx("mein_buch.docx")
# Oder beides auf einmal:
pdf_pfad, docx_pfad = generator.als_beide("mein_buch")

# Als JSON speichern (für spätere Bearbeitung)
generator.als_json("mein_buch.json")

# Zusammenfassung anzeigen
print(generator.zusammenfassung())
```

## Seitenformate

| Format | Größe | Beschreibung |
|--------|-------|--------------|
| `A4` | 21 × 29,7 cm | Standard-Büroformat |
| `A5` | 14,8 × 21 cm | Beliebtes Buchformat |
| `Letter` | 21,59 × 27,94 cm | US-amerikanisches Format |
| `Taschenbuch` | 12,7 × 20,32 cm | Klassisches Taschenbuch |
| `Grossdruck` | 17 × 24 cm | Größeres Format für bessere Lesbarkeit |

## Textformatierung

Der Generator unterstützt einfache Markdown-Formatierung im Text:

- `**fett**` → **fett**
- `*kursiv*` → *kursiv*
- `__unterstrichen__` → unterstrichen

## Bilder einfügen

```python
from ebook_generator import EBookGenerator

generator = EBookGenerator("Bilderbuch", "Fotograf")
kapitel = generator.kapitel_hinzufuegen("Meine Fotos")
abschnitt = generator.abschnitt_hinzufuegen(
    kapitel=kapitel,
    ueberschrift="Landschaften",
    inhalt="Hier sind einige meiner besten Landschaftsfotos."
)

# Bild hinzufügen
generator.bild_hinzufuegen(
    abschnitt=abschnitt,
    pfad="bilder/sonnenuntergang.jpg",
    bildunterschrift="Sonnenuntergang am Meer",
    breite=300,  # in Punkten
)
```

## JSON-Struktur

E-Books können als JSON gespeichert und geladen werden:

```json
{
  "metadaten": {
    "titel": "Mein Buch",
    "autor": "Max Mustermann",
    "untertitel": "Ein tolles Buch",
    "beschreibung": "Kurze Beschreibung",
    "verlag": "Mein Verlag",
    "erscheinungsdatum": "2025-01-30",
    "isbn": "",
    "sprache": "de",
    "schluesselwoerter": ["Roman", "Abenteuer"],
    "copyright": "© 2025 Max Mustermann"
  },
  "vorwort": "Willkommen...",
  "widmung": "Für meine Familie",
  "kapitel": [
    {
      "kapitelnummer": 1,
      "titel": "Einleitung",
      "inhalt": "Der Anfang...",
      "abschnitte": [
        {
          "ueberschrift": "Der erste Tag",
          "inhalt": "Es war einmal...",
          "bilder": []
        }
      ]
    }
  ],
  "nachwort": "Danke fürs Lesen!"
}
```

## Projektstruktur

```
german-ebook-generator/
├── ebook_generator/
│   ├── __init__.py          # Paket-Exporte
│   ├── generator.py         # Hauptgenerator-Klasse
│   ├── cli.py               # Kommandozeilen-Interface
│   ├── models/
│   │   ├── __init__.py
│   │   └── ebook.py         # Datenmodelle
│   └── exporters/
│       ├── __init__.py
│       ├── pdf_exporter.py  # PDF-Export mit ReportLab
│       └── docx_exporter.py # DOCX-Export mit python-docx
├── examples/
│   └── beispiel_ebook.py    # Beispielskript
├── pyproject.toml           # Projektdefinition
└── README.md
```

## Abhängigkeiten

- **reportlab**: PDF-Generierung
- **python-docx**: DOCX-Generierung
- **Pillow**: Bildverarbeitung
- **pydantic**: Datenvalidierung (optional)

## Lizenz

MIT License
