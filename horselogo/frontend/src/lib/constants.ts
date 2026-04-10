import type { Industry, Motif, DesignStyle, ColorPalette } from '../types'

export const INDUSTRIES: { value: Industry; label: string; icon: string }[] = [
  { value: 'reitstall', label: 'Reitstall / Reitschule', icon: '🏇' },
  { value: 'hufpflege', label: 'Hufpflege / Hufschmied', icon: '🔨' },
  { value: 'pferdezucht', label: 'Pferdezucht', icon: '🐴' },
  { value: 'osteopathie', label: 'Pferdeosteopathie / -physio', icon: '🌿' },
  { value: 'turnier', label: 'Reitturnier / Verein', icon: '🏆' },
  { value: 'pferdehandel', label: 'Pferdehandel', icon: '🤝' },
  { value: 'shop', label: 'Reitsport-Shop', icon: '🛍️' },
  { value: 'pension', label: 'Pferdepension', icon: '🌾' },
  { value: 'western', label: 'Western Ranch', icon: '⭐' },
  { value: 'transport', label: 'Pferde-Transport', icon: '🚛' },
  { value: 'tierarzt', label: 'Tierarzt / Equine Vet', icon: '⚕️' },
  { value: 'sonstiges', label: 'Sonstiges', icon: '✦' },
]

export const MOTIFS: { value: Motif; label: string; icon: string }[] = [
  { value: 'kopf-profil', label: 'Pferdekopf Profil', icon: '◐' },
  { value: 'kopf-frontal', label: 'Pferdekopf Frontal', icon: '◉' },
  { value: 'galoppierend', label: 'Galoppierend', icon: '⟶' },
  { value: 'steigend', label: 'Steigend', icon: '↑' },
  { value: 'springend', label: 'Springend', icon: '⌒' },
  { value: 'dressur', label: 'Dressur', icon: '⊙' },
  { value: 'hufeisen', label: 'Hufeisen', icon: '∩' },
  { value: 'huf-barhuf', label: 'Huf / Barhuf', icon: '⋂' },
  { value: 'western', label: 'Western', icon: '✦' },
  { value: 'abstrakt', label: 'Abstrakt / Modern', icon: '◈' },
  { value: 'stute-fohlen', label: 'Stute & Fohlen', icon: '♾' },
  { value: 'keltisch', label: 'Keltisches Pferd', icon: '⚜' },
]

export const STYLES: { value: DesignStyle; label: string; symbol: string; description: string }[] = [
  { value: 'minimalistisch', label: 'Minimalistisch', symbol: '—', description: 'Klar & reduziert' },
  { value: 'elegant', label: 'Elegant', symbol: '✧', description: 'Fein & vornehm' },
  { value: 'kraftvoll', label: 'Kraftvoll', symbol: '■', description: 'Bold & dominant' },
  { value: 'vintage', label: 'Vintage', symbol: '❦', description: 'Klassisch & zeitlos' },
  { value: 'geometrisch', label: 'Geometrisch', symbol: '◇', description: 'Modern & strukturiert' },
  { value: 'handgezeichnet', label: 'Handgezeichnet', symbol: '✎', description: 'Organisch & authentisch' },
]

export const PALETTES: {
  value: ColorPalette
  label: string
  primary: string
  secondary: string
}[] = [
  { value: 'noir-gold', label: 'Noir & Gold', primary: '#0D0D0D', secondary: '#C9A84C' },
  { value: 'midnight-silver', label: 'Midnight Silver', primary: '#1A2332', secondary: '#9EAAB8' },
  { value: 'erde-warm', label: 'Erde & Warm', primary: '#3D2B1F', secondary: '#C4956A' },
  { value: 'forest-moss', label: 'Forest & Moss', primary: '#1E3328', secondary: '#8BAF7C' },
  { value: 'bordeaux', label: 'Bordeaux', primary: '#4A1528', secondary: '#D4A0A0' },
  { value: 'ocean-pearl', label: 'Ocean & Pearl', primary: '#0F2B3C', secondary: '#7DBCC9' },
  { value: 'pure-mono', label: 'Pure Mono', primary: '#111111', secondary: '#777777' },
  { value: 'custom', label: 'Eigene Farben', primary: '#000000', secondary: '#ffffff' },
]

export const LAYOUT_NAMES = [
  'Zentriert Klassisch',
  'Horizontal',
  'Badge / Emblem',
  'Gestapelt',
  'Minimal Mark',
  'Editorial Links',
]
