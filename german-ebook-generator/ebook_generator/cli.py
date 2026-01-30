"""
Kommandozeilen-Interface für den E-Book-Generator.

Dieses Modul bietet eine benutzerfreundliche CLI zur Erstellung
und Konvertierung von E-Books.
"""

import argparse
import sys
from pathlib import Path

from ebook_generator import __version__
from ebook_generator.generator import EBookGenerator
from ebook_generator.models.ebook import Seitenformat, Schriftart


def erstelle_parser() -> argparse.ArgumentParser:
    """Erstellt den Argument-Parser."""
    parser = argparse.ArgumentParser(
        prog="ebook-generator",
        description="Professioneller E-Book-Generator auf Deutsch",
        epilog="Beispiel: ebook-generator create --titel 'Mein Buch' --autor 'Max Mustermann' --output buch.pdf",
    )

    parser.add_argument(
        "--version",
        action="version",
        version=f"%(prog)s {__version__}",
    )

    subparsers = parser.add_subparsers(dest="befehl", help="Verfügbare Befehle")

    # Create-Befehl
    create_parser = subparsers.add_parser(
        "create",
        aliases=["erstellen"],
        help="Erstellt ein neues E-Book",
    )

    create_parser.add_argument(
        "--titel", "-t",
        required=True,
        help="Titel des E-Books",
    )

    create_parser.add_argument(
        "--autor", "-a",
        required=True,
        help="Name des Autors",
    )

    create_parser.add_argument(
        "--untertitel", "-u",
        default="",
        help="Untertitel des E-Books",
    )

    create_parser.add_argument(
        "--beschreibung", "-b",
        default="",
        help="Kurze Beschreibung",
    )

    create_parser.add_argument(
        "--verlag", "-v",
        default="",
        help="Name des Verlags",
    )

    create_parser.add_argument(
        "--output", "-o",
        required=True,
        help="Ausgabedatei (unterstützt .pdf, .docx oder beides mit Basisname)",
    )

    create_parser.add_argument(
        "--format", "-f",
        choices=["pdf", "docx", "beide"],
        default="pdf",
        help="Ausgabeformat (Standard: pdf)",
    )

    create_parser.add_argument(
        "--seitenformat", "-s",
        choices=["A4", "A5", "Letter", "Taschenbuch", "Grossdruck"],
        default="A5",
        help="Seitenformat (Standard: A5)",
    )

    create_parser.add_argument(
        "--kapitel", "-k",
        action="append",
        nargs=2,
        metavar=("TITEL", "DATEI"),
        help="Kapitel hinzufügen: --kapitel 'Kapitel 1' kapitel1.txt",
    )

    create_parser.add_argument(
        "--vorwort",
        help="Pfad zur Vorwort-Textdatei",
    )

    create_parser.add_argument(
        "--nachwort",
        help="Pfad zur Nachwort-Textdatei",
    )

    create_parser.add_argument(
        "--widmung",
        help="Widmungstext",
    )

    create_parser.add_argument(
        "--cover",
        help="Pfad zum Coverbild",
    )

    create_parser.add_argument(
        "--kein-inhaltsverzeichnis",
        action="store_true",
        help="Inhaltsverzeichnis deaktivieren",
    )

    # Convert-Befehl
    convert_parser = subparsers.add_parser(
        "convert",
        aliases=["konvertieren"],
        help="Konvertiert eine JSON-E-Book-Definition",
    )

    convert_parser.add_argument(
        "eingabe",
        help="Pfad zur JSON-Eingabedatei",
    )

    convert_parser.add_argument(
        "--output", "-o",
        required=True,
        help="Ausgabedatei",
    )

    convert_parser.add_argument(
        "--format", "-f",
        choices=["pdf", "docx", "beide"],
        default="pdf",
        help="Ausgabeformat",
    )

    # Info-Befehl
    info_parser = subparsers.add_parser(
        "info",
        help="Zeigt Informationen über ein E-Book",
    )

    info_parser.add_argument(
        "eingabe",
        help="Pfad zur JSON-E-Book-Definition",
    )

    # Demo-Befehl
    demo_parser = subparsers.add_parser(
        "demo",
        help="Erstellt ein Beispiel-E-Book",
    )

    demo_parser.add_argument(
        "--output", "-o",
        default="demo_ebook",
        help="Basisname für die Ausgabedateien",
    )

    return parser


def text_aus_datei(pfad: str) -> str:
    """Liest Text aus einer Datei."""
    return Path(pfad).read_text(encoding="utf-8")


def seitenformat_parsen(name: str) -> Seitenformat:
    """Konvertiert einen String in ein Seitenformat."""
    mapping = {
        "A4": Seitenformat.A4,
        "A5": Seitenformat.A5,
        "Letter": Seitenformat.LETTER,
        "Taschenbuch": Seitenformat.TASCHENBUCH,
        "Grossdruck": Seitenformat.GROSSDRUCK,
    }
    return mapping.get(name, Seitenformat.A5)


def befehl_create(args: argparse.Namespace) -> int:
    """Führt den Create-Befehl aus."""
    print(f"Erstelle E-Book: {args.titel}")

    generator = EBookGenerator(
        titel=args.titel,
        autor=args.autor,
        untertitel=args.untertitel,
        beschreibung=args.beschreibung,
        verlag=args.verlag,
    )

    # Seitenformat
    generator.stil_anpassen(seitenformat=seitenformat_parsen(args.seitenformat))

    # Optionale Inhalte
    if args.vorwort:
        generator.vorwort_setzen(text_aus_datei(args.vorwort))
        print("  + Vorwort hinzugefügt")

    if args.nachwort:
        generator.nachwort_setzen(text_aus_datei(args.nachwort))
        print("  + Nachwort hinzugefügt")

    if args.widmung:
        generator.widmung_setzen(args.widmung)
        print("  + Widmung hinzugefügt")

    if args.cover:
        generator.coverbild_setzen(args.cover)
        print("  + Cover hinzugefügt")

    if args.kein_inhaltsverzeichnis:
        generator.inhaltsverzeichnis_aktivieren(False)

    # Kapitel hinzufügen
    if args.kapitel:
        for titel, datei in args.kapitel:
            inhalt = text_aus_datei(datei)
            generator.kapitel_hinzufuegen(titel=titel, inhalt=inhalt)
            print(f"  + Kapitel '{titel}' hinzugefügt")
    else:
        # Demo-Kapitel wenn keine angegeben
        generator.kapitel_hinzufuegen(
            titel="Einleitung",
            inhalt="Dies ist ein Platzhalter-Kapitel. "
            "Verwenden Sie --kapitel um eigene Kapitel hinzuzufügen.",
        )
        print("  + Demo-Kapitel hinzugefügt")

    # Export
    ausgabe = Path(args.output)

    if args.format == "beide":
        pdf_pfad, docx_pfad = generator.als_beide(ausgabe.stem)
        print(f"\nErfolgreich erstellt:")
        print(f"  PDF:  {pdf_pfad}")
        print(f"  DOCX: {docx_pfad}")
    elif args.format == "docx":
        if not ausgabe.suffix:
            ausgabe = ausgabe.with_suffix(".docx")
        pfad = generator.als_docx(ausgabe)
        print(f"\nErfolgreich erstellt: {pfad}")
    else:
        if not ausgabe.suffix:
            ausgabe = ausgabe.with_suffix(".pdf")
        pfad = generator.als_pdf(ausgabe)
        print(f"\nErfolgreich erstellt: {pfad}")

    return 0


def befehl_convert(args: argparse.Namespace) -> int:
    """Führt den Convert-Befehl aus."""
    eingabe = Path(args.eingabe)

    if not eingabe.exists():
        print(f"Fehler: Datei nicht gefunden: {eingabe}", file=sys.stderr)
        return 1

    print(f"Lade E-Book aus: {eingabe}")
    generator = EBookGenerator.aus_json(eingabe)

    ausgabe = Path(args.output)

    if args.format == "beide":
        pdf_pfad, docx_pfad = generator.als_beide(ausgabe.stem)
        print(f"\nErfolgreich konvertiert:")
        print(f"  PDF:  {pdf_pfad}")
        print(f"  DOCX: {docx_pfad}")
    elif args.format == "docx":
        if not ausgabe.suffix:
            ausgabe = ausgabe.with_suffix(".docx")
        pfad = generator.als_docx(ausgabe)
        print(f"\nErfolgreich konvertiert: {pfad}")
    else:
        if not ausgabe.suffix:
            ausgabe = ausgabe.with_suffix(".pdf")
        pfad = generator.als_pdf(ausgabe)
        print(f"\nErfolgreich konvertiert: {pfad}")

    return 0


def befehl_info(args: argparse.Namespace) -> int:
    """Führt den Info-Befehl aus."""
    eingabe = Path(args.eingabe)

    if not eingabe.exists():
        print(f"Fehler: Datei nicht gefunden: {eingabe}", file=sys.stderr)
        return 1

    generator = EBookGenerator.aus_json(eingabe)
    print(generator.zusammenfassung())

    return 0


def befehl_demo(args: argparse.Namespace) -> int:
    """Erstellt ein Demo-E-Book."""
    print("Erstelle Demo-E-Book...")

    generator = EBookGenerator(
        titel="Die Kunst des Schreibens",
        autor="Maria Müller",
        untertitel="Ein Leitfaden für angehende Autoren",
        beschreibung="Ein umfassender Ratgeber für alle, die das Schreiben lernen möchten.",
        verlag="Deutscher Literaturverlag",
    )

    generator.widmung_setzen("Für alle, die den Mut haben, ihre Geschichten zu erzählen.")

    generator.vorwort_setzen(
        """Willkommen zu diesem Buch über die Kunst des Schreibens.

Das Schreiben ist eine der ältesten und mächtigsten Formen der menschlichen Kommunikation. Seit Jahrtausenden nutzen Menschen Worte, um Geschichten zu erzählen, Wissen weiterzugeben und Gefühle auszudrücken.

In diesem Buch werden wir gemeinsam die Grundlagen des kreativen Schreibens erkunden. Sie werden lernen, wie Sie Ihre Ideen strukturieren, Ihre Charaktere zum Leben erwecken und Ihre Leser fesseln können.

Ich wünsche Ihnen viel Freude beim Lesen und vor allem beim Schreiben!"""
    )

    # Kapitel 1
    kap1 = generator.kapitel_hinzufuegen(
        titel="Die Grundlagen",
        inhalt="""Jede große Reise beginnt mit dem ersten Schritt – und beim Schreiben ist dieser erste Schritt oft der schwierigste. Viele angehende Autoren sitzen vor einem leeren Blatt Papier und wissen nicht, wo sie anfangen sollen.

Der wichtigste Rat, den ich Ihnen geben kann, lautet: **Fangen Sie einfach an.** Es spielt keine Rolle, ob Ihre ersten Worte perfekt sind. Das Wichtigste ist, dass Sie überhaupt schreiben.

Schreiben ist wie ein Muskel – je mehr Sie ihn trainieren, desto stärker wird er. Setzen Sie sich jeden Tag hin und schreiben Sie, auch wenn es nur für zehn Minuten ist. Mit der Zeit werden Sie feststellen, dass die Worte immer leichter fließen."""
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap1,
        ueberschrift="Die richtige Umgebung",
        inhalt="""Eine gute Schreibumgebung kann Wunder wirken. Suchen Sie sich einen ruhigen Ort, an dem Sie ungestört arbeiten können. Das kann ein gemütliches Arbeitszimmer sein, ein Café oder sogar ein Park.

Achten Sie darauf, dass Sie alle Ablenkungen minimieren. Schalten Sie Ihr Telefon stumm und schließen Sie unnötige Browser-Tabs. Ihre volle Aufmerksamkeit sollte dem Schreiben gehören."""
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap1,
        ueberschrift="Werkzeuge des Autors",
        inhalt="""Ob Sie lieber mit Stift und Papier arbeiten oder am Computer schreiben – wählen Sie die Werkzeuge, die sich für Sie am besten anfühlen. Es gibt kein richtig oder falsch.

Einige Autoren schwören auf spezielle Schreibprogramme, andere bevorzugen einfache Textverarbeitung. Experimentieren Sie und finden Sie heraus, was für Sie funktioniert."""
    )

    # Kapitel 2
    kap2 = generator.kapitel_hinzufuegen(
        titel="Charakterentwicklung",
        inhalt="""Charaktere sind das Herz jeder Geschichte. Ohne überzeugende Figuren wird selbst die spannendste Handlung fade und langweilig. In diesem Kapitel lernen Sie, wie Sie *dreidimensionale* Charaktere erschaffen, die Ihre Leser fesseln.

Ein guter Charakter hat Stärken und Schwächen, Träume und Ängste. Er entwickelt sich im Laufe der Geschichte weiter und überrascht den Leser immer wieder."""
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap2,
        ueberschrift="Die Hintergrundgeschichte",
        inhalt="""Jeder Charakter hat eine Vergangenheit, die ihn geprägt hat. Auch wenn Sie nicht alles davon in Ihrer Geschichte erwähnen, sollten Sie als Autor diese Hintergrundgeschichte kennen.

Stellen Sie sich Fragen: Wo ist Ihr Charakter aufgewachsen? Welche prägenden Erlebnisse hatte er? Was sind seine größten Ängste und tiefsten Wünsche?"""
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap2,
        ueberschrift="Dialog und Stimme",
        inhalt="""Jeder Charakter sollte eine eigene *Stimme* haben. Die Art, wie er spricht, verrät viel über seine Persönlichkeit, seinen Hintergrund und seine Bildung.

Achten Sie darauf, dass sich Ihre Charaktere im Dialog unterscheiden. Ein Professor spricht anders als ein Teenager, ein Bauer anders als ein Geschäftsmann."""
    )

    # Kapitel 3
    kap3 = generator.kapitel_hinzufuegen(
        titel="Struktur und Handlung",
        inhalt="""Eine gute Geschichte braucht eine solide Struktur. Die klassische Drei-Akt-Struktur – Anfang, Mitte, Ende – hat sich über Jahrhunderte bewährt und bildet das Fundament vieler erfolgreicher Geschichten.

Im **ersten Akt** führen Sie Ihre Charaktere und die Welt der Geschichte ein. Der **zweite Akt** enthält die Haupthandlung mit ihren Konflikten und Hindernissen. Im **dritten Akt** kommt es zur Auflösung."""
    )

    generator.abschnitt_hinzufuegen(
        kapitel=kap3,
        ueberschrift="Spannung aufbauen",
        inhalt="""Spannung ist der Motor Ihrer Geschichte. Sie hält den Leser bei der Stange und lässt ihn Seite um Seite umblättern. Aber wie baut man Spannung auf?

Ein bewährtes Mittel ist der **Konflikt**. Stellen Sie Ihren Charakteren Hindernisse in den Weg. Lassen Sie sie kämpfen, scheitern und es erneut versuchen. Je größer die Hürden, desto befriedigender der Erfolg."""
    )

    generator.nachwort_setzen(
        """Sie haben nun die Grundlagen des Schreibens kennengelernt. Aber das Wichtigste liegt noch vor Ihnen: die Praxis.

Setzen Sie sich hin und schreiben Sie. Schreiben Sie jeden Tag, auch wenn es schwerfällt. Mit der Zeit werden Sie feststellen, dass Sie besser werden, dass die Worte leichter fließen und Ihre Geschichten lebendiger werden.

Ich wünsche Ihnen viel Erfolg auf Ihrer Reise als Autor. Mögen Ihre Worte die Welt erreichen und die Herzen Ihrer Leser berühren."""
    )

    # Export
    ausgabe = Path(args.output)
    pdf_pfad, docx_pfad = generator.als_beide(ausgabe)

    # JSON auch speichern
    json_pfad = ausgabe.with_suffix(".json")
    generator.als_json(json_pfad)

    print(f"\nDemo-E-Book erfolgreich erstellt:")
    print(f"  PDF:  {pdf_pfad}")
    print(f"  DOCX: {docx_pfad}")
    print(f"  JSON: {json_pfad}")
    print(f"\n{generator.zusammenfassung()}")

    return 0


def main() -> int:
    """Haupteinstiegspunkt für die CLI."""
    parser = erstelle_parser()
    args = parser.parse_args()

    if args.befehl is None:
        parser.print_help()
        return 0

    befehle = {
        "create": befehl_create,
        "erstellen": befehl_create,
        "convert": befehl_convert,
        "konvertieren": befehl_convert,
        "info": befehl_info,
        "demo": befehl_demo,
    }

    try:
        return befehle[args.befehl](args)
    except FileNotFoundError as e:
        print(f"Fehler: Datei nicht gefunden: {e.filename}", file=sys.stderr)
        return 1
    except PermissionError as e:
        print(f"Fehler: Keine Berechtigung: {e.filename}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Fehler: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
