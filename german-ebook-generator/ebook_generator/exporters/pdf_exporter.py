"""
PDF-Exporter für E-Books.

Dieses Modul verwendet ReportLab zur Erstellung professioneller
PDF-Dokumente aus E-Book-Daten.
"""

from pathlib import Path
from typing import Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, A5, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Image,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
)
from reportlab.platypus.tableofcontents import TableOfContents

from ebook_generator.models.ebook import EBook, Seitenformat


class PDFExporter:
    """
    Exportiert E-Books in das PDF-Format.

    Diese Klasse verwendet ReportLab, um professionelle PDF-Dokumente
    mit Titelseite, Inhaltsverzeichnis und formatiertem Text zu erstellen.
    """

    # Seitenformate-Mapping
    SEITENFORMATE = {
        Seitenformat.A4: A4,
        Seitenformat.A5: A5,
        Seitenformat.LETTER: letter,
        Seitenformat.TASCHENBUCH: (12.7 * cm, 20.32 * cm),
        Seitenformat.GROSSDRUCK: (17 * cm, 24 * cm),
    }

    def __init__(self):
        """Initialisiert den PDF-Exporter."""
        self.styles = getSampleStyleSheet()
        self._eigene_stile_erstellen()

    def _eigene_stile_erstellen(self) -> None:
        """Erstellt benutzerdefinierte Stilvorlagen."""
        # Titelstil
        self.styles.add(
            ParagraphStyle(
                name="BuchTitel",
                parent=self.styles["Heading1"],
                fontSize=28,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#1a1a1a"),
            )
        )

        # Untertitelstil
        self.styles.add(
            ParagraphStyle(
                name="BuchUntertitel",
                parent=self.styles["Normal"],
                fontSize=16,
                spaceAfter=20,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#4a4a4a"),
                fontStyle="italic",
            )
        )

        # Autorstil
        self.styles.add(
            ParagraphStyle(
                name="BuchAutor",
                parent=self.styles["Normal"],
                fontSize=14,
                spaceAfter=50,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#2a2a2a"),
            )
        )

        # Kapitelüberschrift
        self.styles.add(
            ParagraphStyle(
                name="KapitelTitel",
                parent=self.styles["Heading1"],
                fontSize=20,
                spaceBefore=30,
                spaceAfter=20,
                textColor=colors.HexColor("#1a1a1a"),
                keepWithNext=True,
            )
        )

        # Abschnittsüberschrift
        self.styles.add(
            ParagraphStyle(
                name="AbschnittTitel",
                parent=self.styles["Heading2"],
                fontSize=14,
                spaceBefore=20,
                spaceAfter=12,
                textColor=colors.HexColor("#2a2a2a"),
                keepWithNext=True,
            )
        )

        # Fließtext
        self.styles.add(
            ParagraphStyle(
                name="Fliesstext",
                parent=self.styles["Normal"],
                fontSize=11,
                leading=16,
                spaceAfter=8,
                alignment=TA_JUSTIFY,
                firstLineIndent=0.5 * cm,
            )
        )

        # Erster Absatz (ohne Einzug)
        self.styles.add(
            ParagraphStyle(
                name="FliesstextErster",
                parent=self.styles["Fliesstext"],
                firstLineIndent=0,
            )
        )

        # Widmung
        self.styles.add(
            ParagraphStyle(
                name="Widmung",
                parent=self.styles["Normal"],
                fontSize=12,
                alignment=TA_CENTER,
                fontStyle="italic",
                spaceBefore=100,
                spaceAfter=100,
            )
        )

        # Bildunterschrift
        self.styles.add(
            ParagraphStyle(
                name="Bildunterschrift",
                parent=self.styles["Normal"],
                fontSize=9,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#4a4a4a"),
                fontStyle="italic",
                spaceBefore=6,
                spaceAfter=12,
            )
        )

        # Copyright
        self.styles.add(
            ParagraphStyle(
                name="Copyright",
                parent=self.styles["Normal"],
                fontSize=9,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#6a6a6a"),
            )
        )

        # Inhaltsverzeichnis-Eintrag
        self.styles.add(
            ParagraphStyle(
                name="IVZEintrag",
                parent=self.styles["Normal"],
                fontSize=11,
                leftIndent=0,
                spaceBefore=4,
                spaceAfter=4,
            )
        )

    def exportieren(self, ebook: EBook, ausgabepfad: Path) -> Path:
        """
        Exportiert das E-Book als PDF.

        Args:
            ebook: Das zu exportierende E-Book
            ausgabepfad: Pfad für die Ausgabedatei

        Returns:
            Pfad zur erstellten PDF-Datei
        """
        # Seitenformat bestimmen
        seitengroesse = self.SEITENFORMATE.get(
            ebook.stilvorlage.seitenformat, A5
        )

        # Seitenränder konvertieren (cm -> points)
        raender = ebook.stilvorlage.seitenraender
        rand_oben = raender[0] * cm
        rand_rechts = raender[1] * cm
        rand_unten = raender[2] * cm
        rand_links = raender[3] * cm

        # Dokument erstellen
        doc = SimpleDocTemplate(
            str(ausgabepfad),
            pagesize=seitengroesse,
            topMargin=rand_oben,
            rightMargin=rand_rechts,
            bottomMargin=rand_unten,
            leftMargin=rand_links,
            title=ebook.metadaten.titel,
            author=ebook.metadaten.autor,
            subject=ebook.metadaten.beschreibung,
            keywords=", ".join(ebook.metadaten.schluesselwoerter),
        )

        # Inhalt zusammenstellen
        inhalt = []

        # Titelseite
        if ebook.titelseite:
            inhalt.extend(self._titelseite_erstellen(ebook, seitengroesse))
            inhalt.append(PageBreak())

        # Copyright-Seite
        inhalt.extend(self._copyright_seite_erstellen(ebook))
        inhalt.append(PageBreak())

        # Widmung
        if ebook.widmung:
            inhalt.extend(self._widmung_erstellen(ebook))
            inhalt.append(PageBreak())

        # Inhaltsverzeichnis
        if ebook.inhaltsverzeichnis:
            inhalt.extend(self._inhaltsverzeichnis_erstellen(ebook))
            inhalt.append(PageBreak())

        # Vorwort
        if ebook.vorwort:
            inhalt.extend(self._vorwort_erstellen(ebook))
            inhalt.append(PageBreak())

        # Kapitel
        for i, kapitel in enumerate(ebook.kapitel):
            inhalt.extend(self._kapitel_erstellen(kapitel))
            if i < len(ebook.kapitel) - 1:
                inhalt.append(PageBreak())

        # Nachwort
        if ebook.nachwort:
            inhalt.append(PageBreak())
            inhalt.extend(self._nachwort_erstellen(ebook))

        # PDF generieren
        doc.build(inhalt)

        return ausgabepfad

    def _titelseite_erstellen(
        self, ebook: EBook, seitengroesse: tuple
    ) -> list:
        """Erstellt die Titelseite."""
        elemente = []

        # Abstand oben
        elemente.append(Spacer(1, 3 * cm))

        # Coverbild falls vorhanden
        if ebook.coverbild and ebook.coverbild.exists():
            breite = seitengroesse[0] * 0.6
            try:
                img = Image(str(ebook.coverbild), width=breite)
                img.hAlign = "CENTER"
                elemente.append(img)
                elemente.append(Spacer(1, 1 * cm))
            except Exception:
                pass  # Bild konnte nicht geladen werden

        # Titel
        elemente.append(
            Paragraph(ebook.metadaten.titel, self.styles["BuchTitel"])
        )

        # Untertitel
        if ebook.metadaten.untertitel:
            elemente.append(
                Paragraph(
                    ebook.metadaten.untertitel, self.styles["BuchUntertitel"]
                )
            )

        elemente.append(Spacer(1, 2 * cm))

        # Autor
        elemente.append(
            Paragraph(ebook.metadaten.autor, self.styles["BuchAutor"])
        )

        # Verlag
        if ebook.metadaten.verlag:
            elemente.append(Spacer(1, 3 * cm))
            elemente.append(
                Paragraph(ebook.metadaten.verlag, self.styles["Copyright"])
            )

        return elemente

    def _copyright_seite_erstellen(self, ebook: EBook) -> list:
        """Erstellt die Copyright-Seite."""
        elemente = []
        elemente.append(Spacer(1, 15 * cm))

        # Copyright-Text
        elemente.append(
            Paragraph(ebook.metadaten.copyright, self.styles["Copyright"])
        )

        # ISBN
        if ebook.metadaten.isbn:
            elemente.append(Spacer(1, 0.5 * cm))
            elemente.append(
                Paragraph(
                    f"ISBN: {ebook.metadaten.isbn}", self.styles["Copyright"]
                )
            )

        # Erscheinungsdatum
        elemente.append(Spacer(1, 0.5 * cm))
        datum = ebook.metadaten.erscheinungsdatum.strftime("%B %Y")
        elemente.append(
            Paragraph(f"Erschienen: {datum}", self.styles["Copyright"])
        )

        return elemente

    def _widmung_erstellen(self, ebook: EBook) -> list:
        """Erstellt die Widmungsseite."""
        return [Paragraph(ebook.widmung, self.styles["Widmung"])]

    def _inhaltsverzeichnis_erstellen(self, ebook: EBook) -> list:
        """Erstellt das Inhaltsverzeichnis."""
        elemente = []

        elemente.append(
            Paragraph("Inhaltsverzeichnis", self.styles["KapitelTitel"])
        )
        elemente.append(Spacer(1, 0.5 * cm))

        for kapitel in ebook.kapitel:
            # Kapiteleintrag
            text = f"<b>Kapitel {kapitel.kapitelnummer}:</b> {kapitel.titel}"
            elemente.append(Paragraph(text, self.styles["IVZEintrag"]))

            # Abschnitte eingerückt
            for abschnitt in kapitel.abschnitte:
                stil = ParagraphStyle(
                    "IVZAbschnitt",
                    parent=self.styles["IVZEintrag"],
                    leftIndent=1 * cm,
                    fontSize=10,
                )
                elemente.append(
                    Paragraph(f"• {abschnitt.ueberschrift}", stil)
                )

        return elemente

    def _vorwort_erstellen(self, ebook: EBook) -> list:
        """Erstellt das Vorwort."""
        elemente = []

        elemente.append(Paragraph("Vorwort", self.styles["KapitelTitel"]))
        elemente.append(Spacer(1, 0.5 * cm))

        # Text in Absätze aufteilen
        absaetze = ebook.vorwort.strip().split("\n\n")
        for i, absatz in enumerate(absaetze):
            if absatz.strip():
                stil = (
                    self.styles["FliesstextErster"]
                    if i == 0
                    else self.styles["Fliesstext"]
                )
                elemente.append(Paragraph(absatz.strip(), stil))

        return elemente

    def _nachwort_erstellen(self, ebook: EBook) -> list:
        """Erstellt das Nachwort."""
        elemente = []

        elemente.append(Paragraph("Nachwort", self.styles["KapitelTitel"]))
        elemente.append(Spacer(1, 0.5 * cm))

        absaetze = ebook.nachwort.strip().split("\n\n")
        for i, absatz in enumerate(absaetze):
            if absatz.strip():
                stil = (
                    self.styles["FliesstextErster"]
                    if i == 0
                    else self.styles["Fliesstext"]
                )
                elemente.append(Paragraph(absatz.strip(), stil))

        return elemente

    def _kapitel_erstellen(self, kapitel) -> list:
        """Erstellt ein Kapitel."""
        elemente = []

        # Kapitelüberschrift
        titel_text = f"Kapitel {kapitel.kapitelnummer}: {kapitel.titel}"
        elemente.append(Paragraph(titel_text, self.styles["KapitelTitel"]))
        elemente.append(Spacer(1, 0.5 * cm))

        # Kapitelinhalt
        if kapitel.inhalt:
            absaetze = kapitel.inhalt.strip().split("\n\n")
            for i, absatz in enumerate(absaetze):
                if absatz.strip():
                    stil = (
                        self.styles["FliesstextErster"]
                        if i == 0
                        else self.styles["Fliesstext"]
                    )
                    # HTML-Formatierung unterstützen
                    text = self._text_formatieren(absatz.strip())
                    elemente.append(Paragraph(text, stil))

        # Abschnitte
        for abschnitt in kapitel.abschnitte:
            elemente.extend(self._abschnitt_erstellen(abschnitt))

        return elemente

    def _abschnitt_erstellen(self, abschnitt) -> list:
        """Erstellt einen Abschnitt."""
        elemente = []

        # Abschnittsüberschrift
        elemente.append(
            Paragraph(abschnitt.ueberschrift, self.styles["AbschnittTitel"])
        )

        # Abschnittsinhalt
        if abschnitt.inhalt:
            absaetze = abschnitt.inhalt.strip().split("\n\n")
            for i, absatz in enumerate(absaetze):
                if absatz.strip():
                    stil = (
                        self.styles["FliesstextErster"]
                        if i == 0
                        else self.styles["Fliesstext"]
                    )
                    text = self._text_formatieren(absatz.strip())
                    elemente.append(Paragraph(text, stil))

        # Bilder
        for bild in abschnitt.bilder:
            elemente.extend(self._bild_erstellen(bild))

        return elemente

    def _bild_erstellen(self, bild) -> list:
        """Erstellt ein Bild mit optionaler Bildunterschrift."""
        elemente = []

        if not bild.pfad.exists():
            return elemente

        try:
            # Bildgröße bestimmen
            breite = bild.breite if bild.breite else 10 * cm
            hoehe = bild.hoehe

            if hoehe:
                img = Image(str(bild.pfad), width=breite, height=hoehe)
            else:
                img = Image(str(bild.pfad), width=breite)

            # Ausrichtung
            if bild.ausrichtung == "links":
                img.hAlign = "LEFT"
            elif bild.ausrichtung == "rechts":
                img.hAlign = "RIGHT"
            else:
                img.hAlign = "CENTER"

            elemente.append(Spacer(1, 0.5 * cm))
            elemente.append(img)

            # Bildunterschrift
            if bild.bildunterschrift:
                elemente.append(
                    Paragraph(
                        bild.bildunterschrift, self.styles["Bildunterschrift"]
                    )
                )

        except Exception:
            pass  # Bild konnte nicht verarbeitet werden

        return elemente

    def _text_formatieren(self, text: str) -> str:
        """
        Formatiert Text für ReportLab.

        Unterstützt einfache Markdown-Formatierung:
        - **fett** -> <b>fett</b>
        - *kursiv* -> <i>kursiv</i>
        """
        import re

        # Fett
        text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
        # Kursiv
        text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
        # Unterstrichen
        text = re.sub(r"__(.+?)__", r"<u>\1</u>", text)

        return text
