"""
Professioneller E-Book-Generator auf Deutsch

Ein leistungsstarkes Tool zur Erstellung von E-Books mit PDF- und DOCX-Export.
"""

from ebook_generator.models.ebook import (
    EBook,
    Kapitel,
    Abschnitt,
    Bild,
    Metadaten,
    Schriftart,
    Seitenformat,
)
from ebook_generator.generator import EBookGenerator

__version__ = "1.0.0"
__author__ = "E-Book Generator Team"

__all__ = [
    "EBook",
    "Kapitel",
    "Abschnitt",
    "Bild",
    "Metadaten",
    "Schriftart",
    "Seitenformat",
    "EBookGenerator",
]
