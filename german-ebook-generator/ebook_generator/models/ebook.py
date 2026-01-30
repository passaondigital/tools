"""
Datenmodelle für E-Books.

Dieses Modul definiert alle Datenstrukturen, die für die Erstellung
von E-Books benötigt werden.
"""

from dataclasses import dataclass, field
from datetime import date
from enum import Enum
from pathlib import Path
from typing import Optional


class Seitenformat(Enum):
    """Verfügbare Seitenformate für das E-Book."""

    A4 = "A4"
    A5 = "A5"
    LETTER = "Letter"
    TASCHENBUCH = "Taschenbuch"  # 12.7 x 20.32 cm (5" x 8")
    GROSSDRUCK = "Grossdruck"  # Größeres Format für bessere Lesbarkeit


class Schriftart(Enum):
    """Verfügbare Schriftarten für das E-Book."""

    TIMES = "Times-Roman"
    HELVETICA = "Helvetica"
    COURIER = "Courier"
    GEORGIA = "Georgia"


@dataclass
class Bild:
    """
    Repräsentiert ein Bild im E-Book.

    Attributes:
        pfad: Pfad zur Bilddatei
        bildunterschrift: Optionale Bildunterschrift
        breite: Optionale Breite in Punkten (pt)
        hoehe: Optionale Höhe in Punkten (pt)
        ausrichtung: Ausrichtung des Bildes (links, mitte, rechts)
    """

    pfad: Path
    bildunterschrift: str = ""
    breite: Optional[float] = None
    hoehe: Optional[float] = None
    ausrichtung: str = "mitte"

    def __post_init__(self):
        if isinstance(self.pfad, str):
            self.pfad = Path(self.pfad)


@dataclass
class Abschnitt:
    """
    Repräsentiert einen Abschnitt innerhalb eines Kapitels.

    Attributes:
        ueberschrift: Überschrift des Abschnitts
        inhalt: Textinhalt des Abschnitts
        bilder: Liste von Bildern im Abschnitt
    """

    ueberschrift: str
    inhalt: str
    bilder: list[Bild] = field(default_factory=list)

    def bild_hinzufuegen(self, bild: Bild) -> None:
        """Fügt ein Bild zum Abschnitt hinzu."""
        self.bilder.append(bild)


@dataclass
class Kapitel:
    """
    Repräsentiert ein Kapitel im E-Book.

    Attributes:
        titel: Titel des Kapitels
        inhalt: Hauptinhalt des Kapitels
        abschnitte: Liste von Unterabschnitten
        kapitelnummer: Optionale Kapitelnummer
    """

    titel: str
    inhalt: str = ""
    abschnitte: list[Abschnitt] = field(default_factory=list)
    kapitelnummer: Optional[int] = None

    def abschnitt_hinzufuegen(self, abschnitt: Abschnitt) -> None:
        """Fügt einen Abschnitt zum Kapitel hinzu."""
        self.abschnitte.append(abschnitt)

    def neuer_abschnitt(self, ueberschrift: str, inhalt: str) -> Abschnitt:
        """Erstellt einen neuen Abschnitt und fügt ihn hinzu."""
        abschnitt = Abschnitt(ueberschrift=ueberschrift, inhalt=inhalt)
        self.abschnitte.append(abschnitt)
        return abschnitt


@dataclass
class Metadaten:
    """
    Metadaten für das E-Book.

    Attributes:
        titel: Titel des E-Books
        autor: Name des Autors
        untertitel: Optionaler Untertitel
        beschreibung: Kurze Beschreibung des E-Books
        verlag: Name des Verlags
        erscheinungsdatum: Datum der Veröffentlichung
        isbn: Optionale ISBN-Nummer
        sprache: Sprache des E-Books
        schluesselwoerter: Liste von Schlagwörtern
        copyright: Copyright-Hinweis
    """

    titel: str
    autor: str
    untertitel: str = ""
    beschreibung: str = ""
    verlag: str = ""
    erscheinungsdatum: date = field(default_factory=date.today)
    isbn: str = ""
    sprache: str = "de"
    schluesselwoerter: list[str] = field(default_factory=list)
    copyright: str = ""

    def __post_init__(self):
        if not self.copyright and self.autor:
            jahr = self.erscheinungsdatum.year
            self.copyright = f"© {jahr} {self.autor}. Alle Rechte vorbehalten."


@dataclass
class Stilvorlage:
    """
    Stilvorlage für das E-Book-Layout.

    Attributes:
        schriftart_text: Schriftart für den Fließtext
        schriftart_ueberschrift: Schriftart für Überschriften
        schriftgroesse_text: Schriftgröße für Fließtext in Punkten
        schriftgroesse_h1: Schriftgröße für Hauptüberschriften
        schriftgroesse_h2: Schriftgröße für Kapitelüberschriften
        schriftgroesse_h3: Schriftgröße für Abschnittsüberschriften
        zeilenabstand: Zeilenabstand als Faktor
        absatzabstand: Abstand zwischen Absätzen in Punkten
        seitenraender: Seitenränder (oben, rechts, unten, links) in cm
        seitenformat: Format der Seiten
    """

    schriftart_text: Schriftart = Schriftart.TIMES
    schriftart_ueberschrift: Schriftart = Schriftart.HELVETICA
    schriftgroesse_text: int = 11
    schriftgroesse_h1: int = 24
    schriftgroesse_h2: int = 18
    schriftgroesse_h3: int = 14
    zeilenabstand: float = 1.5
    absatzabstand: int = 12
    seitenraender: tuple[float, float, float, float] = (2.5, 2.0, 2.5, 2.0)
    seitenformat: Seitenformat = Seitenformat.A5


@dataclass
class EBook:
    """
    Hauptklasse für ein E-Book.

    Diese Klasse repräsentiert ein vollständiges E-Book mit allen
    Metadaten, Kapiteln und Stileinstellungen.

    Attributes:
        metadaten: Metadaten des E-Books
        kapitel: Liste der Kapitel
        stilvorlage: Stilvorlage für das Layout
        vorwort: Optionales Vorwort
        nachwort: Optionales Nachwort
        widmung: Optionale Widmung
        inhaltsverzeichnis: Ob ein Inhaltsverzeichnis generiert werden soll
        titelseite: Ob eine Titelseite generiert werden soll
        coverbild: Optionaler Pfad zum Coverbild
    """

    metadaten: Metadaten
    kapitel: list[Kapitel] = field(default_factory=list)
    stilvorlage: Stilvorlage = field(default_factory=Stilvorlage)
    vorwort: str = ""
    nachwort: str = ""
    widmung: str = ""
    inhaltsverzeichnis: bool = True
    titelseite: bool = True
    coverbild: Optional[Path] = None

    def __post_init__(self):
        if isinstance(self.coverbild, str):
            self.coverbild = Path(self.coverbild)

    def kapitel_hinzufuegen(self, kapitel: Kapitel) -> None:
        """Fügt ein Kapitel zum E-Book hinzu."""
        if kapitel.kapitelnummer is None:
            kapitel.kapitelnummer = len(self.kapitel) + 1
        self.kapitel.append(kapitel)

    def neues_kapitel(self, titel: str, inhalt: str = "") -> Kapitel:
        """Erstellt ein neues Kapitel und fügt es hinzu."""
        kapitel = Kapitel(
            titel=titel,
            inhalt=inhalt,
            kapitelnummer=len(self.kapitel) + 1
        )
        self.kapitel.append(kapitel)
        return kapitel

    @property
    def anzahl_kapitel(self) -> int:
        """Gibt die Anzahl der Kapitel zurück."""
        return len(self.kapitel)

    @property
    def gesamtwoerter(self) -> int:
        """Berechnet die Gesamtzahl der Wörter im E-Book."""
        woerter = 0

        if self.vorwort:
            woerter += len(self.vorwort.split())

        for kapitel in self.kapitel:
            woerter += len(kapitel.inhalt.split())
            for abschnitt in kapitel.abschnitte:
                woerter += len(abschnitt.inhalt.split())

        if self.nachwort:
            woerter += len(self.nachwort.split())

        return woerter

    def zusammenfassung(self) -> str:
        """Gibt eine Zusammenfassung des E-Books zurück."""
        return (
            f"E-Book: {self.metadaten.titel}\n"
            f"Autor: {self.metadaten.autor}\n"
            f"Kapitel: {self.anzahl_kapitel}\n"
            f"Wörter: {self.gesamtwoerter:,}\n"
            f"Format: {self.stilvorlage.seitenformat.value}"
        )
