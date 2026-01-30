"""
Hauptgenerator-Klasse für E-Books.

Dieses Modul enthält die zentrale Klasse zur Erstellung und
Verwaltung von E-Books sowie deren Export in verschiedene Formate.
"""

import json
from pathlib import Path
from typing import Optional

from ebook_generator.models.ebook import (
    EBook,
    Kapitel,
    Abschnitt,
    Bild,
    Metadaten,
    Stilvorlage,
    Seitenformat,
    Schriftart,
)
from ebook_generator.exporters.pdf_exporter import PDFExporter
from ebook_generator.exporters.docx_exporter import DOCXExporter


class EBookGenerator:
    """
    Hauptklasse zur Erstellung und Verwaltung von E-Books.

    Diese Klasse bietet eine benutzerfreundliche API zur Erstellung
    von E-Books mit Kapiteln, Abschnitten und Bildern sowie deren
    Export in PDF- und DOCX-Format.

    Example:
        >>> generator = EBookGenerator("Mein Buch", "Max Mustermann")
        >>> kapitel = generator.kapitel_hinzufuegen("Einleitung", "Willkommen...")
        >>> generator.als_pdf("mein_buch.pdf")
    """

    def __init__(
        self,
        titel: str,
        autor: str,
        untertitel: str = "",
        beschreibung: str = "",
        verlag: str = "",
    ):
        """
        Initialisiert einen neuen E-Book-Generator.

        Args:
            titel: Titel des E-Books
            autor: Name des Autors
            untertitel: Optionaler Untertitel
            beschreibung: Kurze Beschreibung des E-Books
            verlag: Name des Verlags
        """
        self.metadaten = Metadaten(
            titel=titel,
            autor=autor,
            untertitel=untertitel,
            beschreibung=beschreibung,
            verlag=verlag,
        )
        self.stilvorlage = Stilvorlage()
        self._ebook: Optional[EBook] = None
        self._kapitel: list[Kapitel] = []
        self._vorwort: str = ""
        self._nachwort: str = ""
        self._widmung: str = ""
        self._coverbild: Optional[Path] = None
        self._inhaltsverzeichnis: bool = True
        self._titelseite: bool = True

    def kapitel_hinzufuegen(
        self,
        titel: str,
        inhalt: str = "",
        kapitelnummer: Optional[int] = None,
    ) -> Kapitel:
        """
        Fügt ein neues Kapitel zum E-Book hinzu.

        Args:
            titel: Titel des Kapitels
            inhalt: Textinhalt des Kapitels
            kapitelnummer: Optionale Kapitelnummer (wird automatisch vergeben)

        Returns:
            Das erstellte Kapitel-Objekt
        """
        if kapitelnummer is None:
            kapitelnummer = len(self._kapitel) + 1

        kapitel = Kapitel(
            titel=titel,
            inhalt=inhalt,
            kapitelnummer=kapitelnummer,
        )
        self._kapitel.append(kapitel)
        return kapitel

    def abschnitt_hinzufuegen(
        self,
        kapitel: Kapitel,
        ueberschrift: str,
        inhalt: str,
    ) -> Abschnitt:
        """
        Fügt einen Abschnitt zu einem Kapitel hinzu.

        Args:
            kapitel: Das Kapitel, zu dem der Abschnitt hinzugefügt wird
            ueberschrift: Überschrift des Abschnitts
            inhalt: Textinhalt des Abschnitts

        Returns:
            Das erstellte Abschnitt-Objekt
        """
        abschnitt = Abschnitt(ueberschrift=ueberschrift, inhalt=inhalt)
        kapitel.abschnitt_hinzufuegen(abschnitt)
        return abschnitt

    def bild_hinzufuegen(
        self,
        abschnitt: Abschnitt,
        pfad: str | Path,
        bildunterschrift: str = "",
        breite: Optional[float] = None,
        hoehe: Optional[float] = None,
    ) -> Bild:
        """
        Fügt ein Bild zu einem Abschnitt hinzu.

        Args:
            abschnitt: Der Abschnitt, zu dem das Bild hinzugefügt wird
            pfad: Pfad zur Bilddatei
            bildunterschrift: Optionale Bildunterschrift
            breite: Optionale Breite in Punkten
            hoehe: Optionale Höhe in Punkten

        Returns:
            Das erstellte Bild-Objekt
        """
        bild = Bild(
            pfad=Path(pfad),
            bildunterschrift=bildunterschrift,
            breite=breite,
            hoehe=hoehe,
        )
        abschnitt.bild_hinzufuegen(bild)
        return bild

    def vorwort_setzen(self, text: str) -> None:
        """Setzt das Vorwort des E-Books."""
        self._vorwort = text

    def nachwort_setzen(self, text: str) -> None:
        """Setzt das Nachwort des E-Books."""
        self._nachwort = text

    def widmung_setzen(self, text: str) -> None:
        """Setzt die Widmung des E-Books."""
        self._widmung = text

    def coverbild_setzen(self, pfad: str | Path) -> None:
        """Setzt das Coverbild des E-Books."""
        self._coverbild = Path(pfad)

    def inhaltsverzeichnis_aktivieren(self, aktiviert: bool = True) -> None:
        """Aktiviert oder deaktiviert das Inhaltsverzeichnis."""
        self._inhaltsverzeichnis = aktiviert

    def titelseite_aktivieren(self, aktiviert: bool = True) -> None:
        """Aktiviert oder deaktiviert die Titelseite."""
        self._titelseite = aktiviert

    def stil_anpassen(
        self,
        seitenformat: Optional[Seitenformat] = None,
        schriftart_text: Optional[Schriftart] = None,
        schriftart_ueberschrift: Optional[Schriftart] = None,
        schriftgroesse_text: Optional[int] = None,
        zeilenabstand: Optional[float] = None,
        seitenraender: Optional[tuple[float, float, float, float]] = None,
    ) -> None:
        """
        Passt die Stilvorlage des E-Books an.

        Args:
            seitenformat: Seitenformat (A4, A5, etc.)
            schriftart_text: Schriftart für Fließtext
            schriftart_ueberschrift: Schriftart für Überschriften
            schriftgroesse_text: Schriftgröße für Fließtext in Punkten
            zeilenabstand: Zeilenabstand als Faktor
            seitenraender: Seitenränder (oben, rechts, unten, links) in cm
        """
        if seitenformat:
            self.stilvorlage.seitenformat = seitenformat
        if schriftart_text:
            self.stilvorlage.schriftart_text = schriftart_text
        if schriftart_ueberschrift:
            self.stilvorlage.schriftart_ueberschrift = schriftart_ueberschrift
        if schriftgroesse_text:
            self.stilvorlage.schriftgroesse_text = schriftgroesse_text
        if zeilenabstand:
            self.stilvorlage.zeilenabstand = zeilenabstand
        if seitenraender:
            self.stilvorlage.seitenraender = seitenraender

    def _ebook_erstellen(self) -> EBook:
        """Erstellt das EBook-Objekt aus den gesammelten Daten."""
        return EBook(
            metadaten=self.metadaten,
            kapitel=self._kapitel,
            stilvorlage=self.stilvorlage,
            vorwort=self._vorwort,
            nachwort=self._nachwort,
            widmung=self._widmung,
            inhaltsverzeichnis=self._inhaltsverzeichnis,
            titelseite=self._titelseite,
            coverbild=self._coverbild,
        )

    def als_pdf(self, ausgabepfad: str | Path) -> Path:
        """
        Exportiert das E-Book als PDF-Datei.

        Args:
            ausgabepfad: Pfad für die Ausgabedatei

        Returns:
            Pfad zur erstellten PDF-Datei
        """
        ebook = self._ebook_erstellen()
        exporter = PDFExporter()
        return exporter.exportieren(ebook, Path(ausgabepfad))

    def als_docx(self, ausgabepfad: str | Path) -> Path:
        """
        Exportiert das E-Book als DOCX-Datei.

        Args:
            ausgabepfad: Pfad für die Ausgabedatei

        Returns:
            Pfad zur erstellten DOCX-Datei
        """
        ebook = self._ebook_erstellen()
        exporter = DOCXExporter()
        return exporter.exportieren(ebook, Path(ausgabepfad))

    def als_beide(self, basisname: str | Path) -> tuple[Path, Path]:
        """
        Exportiert das E-Book sowohl als PDF als auch als DOCX.

        Args:
            basisname: Basisname für die Ausgabedateien (ohne Erweiterung)

        Returns:
            Tuple mit Pfaden zu PDF und DOCX
        """
        basisname = Path(basisname)
        pdf_pfad = basisname.with_suffix(".pdf")
        docx_pfad = basisname.with_suffix(".docx")

        return self.als_pdf(pdf_pfad), self.als_docx(docx_pfad)

    def zusammenfassung(self) -> str:
        """Gibt eine Zusammenfassung des E-Books zurück."""
        ebook = self._ebook_erstellen()
        return ebook.zusammenfassung()

    def als_json(self, ausgabepfad: Optional[str | Path] = None) -> str:
        """
        Exportiert die E-Book-Struktur als JSON.

        Args:
            ausgabepfad: Optionaler Pfad zum Speichern der JSON-Datei

        Returns:
            JSON-String der E-Book-Struktur
        """
        ebook = self._ebook_erstellen()

        def kapitel_zu_dict(k: Kapitel) -> dict:
            return {
                "kapitelnummer": k.kapitelnummer,
                "titel": k.titel,
                "inhalt": k.inhalt,
                "abschnitte": [
                    {
                        "ueberschrift": a.ueberschrift,
                        "inhalt": a.inhalt,
                        "bilder": [
                            {
                                "pfad": str(b.pfad),
                                "bildunterschrift": b.bildunterschrift,
                            }
                            for b in a.bilder
                        ],
                    }
                    for a in k.abschnitte
                ],
            }

        daten = {
            "metadaten": {
                "titel": ebook.metadaten.titel,
                "autor": ebook.metadaten.autor,
                "untertitel": ebook.metadaten.untertitel,
                "beschreibung": ebook.metadaten.beschreibung,
                "verlag": ebook.metadaten.verlag,
                "erscheinungsdatum": str(ebook.metadaten.erscheinungsdatum),
                "isbn": ebook.metadaten.isbn,
                "sprache": ebook.metadaten.sprache,
                "schluesselwoerter": ebook.metadaten.schluesselwoerter,
                "copyright": ebook.metadaten.copyright,
            },
            "vorwort": ebook.vorwort,
            "widmung": ebook.widmung,
            "kapitel": [kapitel_zu_dict(k) for k in ebook.kapitel],
            "nachwort": ebook.nachwort,
            "statistik": {
                "anzahl_kapitel": ebook.anzahl_kapitel,
                "gesamtwoerter": ebook.gesamtwoerter,
            },
        }

        json_str = json.dumps(daten, ensure_ascii=False, indent=2)

        if ausgabepfad:
            Path(ausgabepfad).write_text(json_str, encoding="utf-8")

        return json_str

    @classmethod
    def aus_json(cls, json_pfad: str | Path) -> "EBookGenerator":
        """
        Lädt ein E-Book aus einer JSON-Datei.

        Args:
            json_pfad: Pfad zur JSON-Datei

        Returns:
            EBookGenerator-Instanz mit den geladenen Daten
        """
        daten = json.loads(Path(json_pfad).read_text(encoding="utf-8"))

        meta = daten["metadaten"]
        generator = cls(
            titel=meta["titel"],
            autor=meta["autor"],
            untertitel=meta.get("untertitel", ""),
            beschreibung=meta.get("beschreibung", ""),
            verlag=meta.get("verlag", ""),
        )

        if daten.get("vorwort"):
            generator.vorwort_setzen(daten["vorwort"])
        if daten.get("widmung"):
            generator.widmung_setzen(daten["widmung"])
        if daten.get("nachwort"):
            generator.nachwort_setzen(daten["nachwort"])

        for kap_daten in daten.get("kapitel", []):
            kapitel = generator.kapitel_hinzufuegen(
                titel=kap_daten["titel"],
                inhalt=kap_daten.get("inhalt", ""),
            )
            for abs_daten in kap_daten.get("abschnitte", []):
                abschnitt = generator.abschnitt_hinzufuegen(
                    kapitel=kapitel,
                    ueberschrift=abs_daten["ueberschrift"],
                    inhalt=abs_daten.get("inhalt", ""),
                )
                for bild_daten in abs_daten.get("bilder", []):
                    generator.bild_hinzufuegen(
                        abschnitt=abschnitt,
                        pfad=bild_daten["pfad"],
                        bildunterschrift=bild_daten.get("bildunterschrift", ""),
                    )

        return generator
