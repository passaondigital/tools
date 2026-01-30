#!/usr/bin/env python3
"""
Beispiel: Erstellung eines E-Books mit dem German E-Book Generator

Dieses Skript demonstriert die programmatische Nutzung des E-Book-Generators.
"""

from pathlib import Path
from ebook_generator import EBookGenerator, Seitenformat, Schriftart


def hauptbeispiel():
    """Erstellt ein vollständiges Beispiel-E-Book."""

    # Generator initialisieren
    generator = EBookGenerator(
        titel="Python für Einsteiger",
        autor="Dr. Anna Schmidt",
        untertitel="Ein praktischer Programmierkurs",
        beschreibung="Lernen Sie Python von Grund auf mit praktischen Beispielen.",
        verlag="TechBooks Verlag",
    )

    # Stil anpassen
    generator.stil_anpassen(
        seitenformat=Seitenformat.A5,
        schriftgroesse_text=11,
        zeilenabstand=1.5,
    )

    # Widmung hinzufügen
    generator.widmung_setzen(
        "Für alle, die den ersten Schritt in die Welt des Programmierens wagen."
    )

    # Vorwort hinzufügen
    generator.vorwort_setzen("""
Python ist eine der beliebtesten Programmiersprachen der Welt – und das aus gutem Grund.
Sie ist leicht zu lernen, vielseitig einsetzbar und hat eine wunderbare Community.

In diesem Buch werden wir gemeinsam die Grundlagen von Python erkunden. Sie werden lernen,
wie Sie Ihre ersten Programme schreiben, mit Daten arbeiten und eigene Funktionen erstellen.

Egal ob Sie beruflich programmieren möchten oder einfach nur neugierig sind – dieses Buch
ist der perfekte Einstieg. Lassen Sie uns beginnen!
    """.strip())

    # Kapitel 1: Einführung
    kap1 = generator.kapitel_hinzufuegen(
        titel="Einführung in Python",
        inhalt="""
Python wurde 1991 von Guido van Rossum entwickelt und hat sich seitdem zu einer der
wichtigsten Programmiersprachen entwickelt. Der Name stammt übrigens von der britischen
Comedygruppe **Monty Python** – nicht von der Schlange!

Was macht Python so besonders? Zunächst einmal ist die Syntax sehr *lesbar*. Python-Code
liest sich fast wie englischer Text. Außerdem ist Python vielseitig: Sie können damit
Webseiten entwickeln, Daten analysieren, künstliche Intelligenz programmieren und vieles mehr.
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap1,
        ueberschrift="Installation",
        inhalt="""
Die Installation von Python ist einfach. Besuchen Sie python.org und laden Sie die
neueste Version herunter. Folgen Sie dem Installationsassistenten und schon können
Sie loslegen.

Auf macOS und Linux ist Python oft bereits vorinstalliert. Öffnen Sie ein Terminal
und tippen Sie **python3 --version** um zu prüfen, ob Python verfügbar ist.
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap1,
        ueberschrift="Ihr erstes Programm",
        inhalt="""
Traditionell ist das erste Programm in jeder Sprache ein "Hello World". In Python
ist das besonders einfach:

print("Hallo Welt!")

Das ist alles! Eine einzige Zeile, und Sie haben Ihr erstes Python-Programm geschrieben.
Speichern Sie diese Zeile in einer Datei namens *hallo.py* und führen Sie sie mit
**python3 hallo.py** aus.
        """.strip()
    )

    # Kapitel 2: Variablen und Datentypen
    kap2 = generator.kapitel_hinzufuegen(
        titel="Variablen und Datentypen",
        inhalt="""
Variablen sind wie Behälter, in denen Sie Werte speichern können. In Python brauchen
Sie keinen Datentyp anzugeben – Python erkennt ihn automatisch.

name = "Anna"
alter = 25
groesse = 1.68
ist_student = True

In diesem Beispiel haben wir vier verschiedene Datentypen verwendet: Text (String),
Ganzzahl (Integer), Dezimalzahl (Float) und Wahrheitswert (Boolean).
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap2,
        ueberschrift="Strings",
        inhalt="""
Strings sind Texte. Sie können sie mit einfachen oder doppelten Anführungszeichen erstellen:

begruessung = "Hallo"
name = 'Welt'
nachricht = begruessung + " " + name + "!"

Das Pluszeichen verbindet Strings miteinander. Dies nennt man *Konkatenation*.
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap2,
        ueberschrift="Zahlen",
        inhalt="""
Python unterscheidet zwischen Ganzzahlen (**int**) und Dezimalzahlen (**float**):

a = 10      # int
b = 3.14    # float
c = a + b   # Ergebnis: 13.14 (float)

Sie können alle üblichen mathematischen Operationen verwenden: Addition (+),
Subtraktion (-), Multiplikation (*), Division (/) und mehr.
        """.strip()
    )

    # Kapitel 3: Kontrollstrukturen
    kap3 = generator.kapitel_hinzufuegen(
        titel="Kontrollstrukturen",
        inhalt="""
Kontrollstrukturen steuern den Ablauf Ihres Programms. Mit ihnen können Sie
Entscheidungen treffen und Aktionen wiederholen.
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap3,
        ueberschrift="Bedingte Anweisungen",
        inhalt="""
Mit **if**, **elif** und **else** können Sie Entscheidungen treffen:

alter = 18

if alter >= 18:
    print("Sie sind volljährig.")
elif alter >= 16:
    print("Sie sind fast volljährig.")
else:
    print("Sie sind minderjährig.")

Beachten Sie die Einrückung! Python verwendet Einrückungen anstelle von geschweiften
Klammern, um Codeblöcke zu kennzeichnen.
        """.strip()
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap3,
        ueberschrift="Schleifen",
        inhalt="""
Schleifen wiederholen Aktionen. Die **for**-Schleife ist besonders nützlich:

for i in range(5):
    print(i)  # Gibt 0, 1, 2, 3, 4 aus

Die **while**-Schleife wiederholt, solange eine Bedingung wahr ist:

zaehler = 0
while zaehler < 5:
    print(zaehler)
    zaehler += 1
        """.strip()
    )

    # Nachwort
    generator.nachwort_setzen("""
Herzlichen Glückwunsch! Sie haben die Grundlagen von Python gelernt. Aber dies ist
erst der Anfang Ihrer Reise.

Programmieren lernt man am besten durch Übung. Setzen Sie sich regelmäßig hin und
schreiben Sie Code. Lösen Sie Probleme, bauen Sie kleine Projekte, und scheuen Sie
sich nicht vor Fehlern – sie sind die besten Lehrer.

Die Python-Community ist hilfsbereit und freundlich. Wenn Sie Fragen haben, finden
Sie auf Stack Overflow, in Foren und Discord-Servern immer jemanden, der Ihnen hilft.

Viel Erfolg auf Ihrer weiteren Reise mit Python!
    """.strip())

    # Ausgabe-Verzeichnis erstellen
    ausgabe_dir = Path("output")
    ausgabe_dir.mkdir(exist_ok=True)

    # Als PDF und DOCX exportieren
    pdf_pfad, docx_pfad = generator.als_beide(ausgabe_dir / "python_einsteiger")

    # Auch als JSON speichern (für spätere Bearbeitung)
    json_pfad = ausgabe_dir / "python_einsteiger.json"
    generator.als_json(json_pfad)

    print("E-Book erfolgreich erstellt!")
    print(f"  PDF:  {pdf_pfad}")
    print(f"  DOCX: {docx_pfad}")
    print(f"  JSON: {json_pfad}")
    print()
    print(generator.zusammenfassung())


def minimales_beispiel():
    """Zeigt ein minimales Beispiel für die schnelle E-Book-Erstellung."""

    # Minimale Konfiguration
    generator = EBookGenerator("Kurzer Ratgeber", "Max Mustermann")

    generator.kapitel_hinzufuegen(
        "Einleitung",
        "Dies ist ein kurzes Beispiel-E-Book."
    )

    generator.kapitel_hinzufuegen(
        "Hauptteil",
        "Hier steht der Hauptinhalt des Buches."
    )

    generator.kapitel_hinzufuegen(
        "Fazit",
        "Vielen Dank fürs Lesen!"
    )

    # Nur als PDF exportieren
    Path("output").mkdir(exist_ok=True)
    generator.als_pdf("output/kurzer_ratgeber.pdf")

    print("Minimales E-Book erstellt: output/kurzer_ratgeber.pdf")


if __name__ == "__main__":
    print("=== Haupt-Beispiel ===\n")
    hauptbeispiel()

    print("\n=== Minimales Beispiel ===\n")
    minimales_beispiel()
