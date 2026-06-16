# Kindergarten Website – Pflege & Seiten-Builder

## Seiten-Builder (admin.html)

Der **Seiten-Builder** ist die zentrale Pflegemaske:

1. `admin.html` im Browser öffnen
2. **Module per Drag & Drop** aus der Palette auf die Seite ziehen
3. Module **umordnen** (ziehen am Modul-Kopf)
4. In **Container-Module** (Bereich, Spalten) weitere Module als **Unterelemente** ablegen
5. Modul anklicken (✎) → **Eigenschaften** rechts bearbeiten
6. **Unterelemente** (z. B. Karten, Slideshow-Bilder) im Eigenschaften-Panel pflegen
7. **Speichern** → Vorschau im Browser
8. **site-data.js exportieren** → Datei nach `assets/site-data.js` kopieren

## Neue Seiten anlegen

- Im Builder links auf **„+ Neue Seite"** klicken
- Seite erscheint unter `seite.html?p=ihre-seite-id`
- Module per Drag & Drop hinzufügen
- Navigation wird automatisch ergänzt (wenn `inNav` aktiv)

## News & Termine (Schnellpflege)

Tab **News & Termine** im Builder:

- **News:** Kartenübersicht, Editor rechts, Veröffentlichungszeitpunkt, Startseite-Toggle
- **Termine:** Kalender mit Monatsnavigation (‹ ›), Tagesauswahl, Editor
- **Status:** Live / Geplant (erscheint automatisch ab Datum & Uhrzeit)
- **Startseite:** Modul „Startseiten-Aktuelles" auf der Homepage zeigt geplante Einträge

Kalender auf der Website: **‹ ›** für vorherigen/nächsten Monat.

## Medien-Galerie (Tab „Medien")

- **Ordnerstruktur:** Verschachtelte Ordner anlegen, Medien per Drag & Drop sortieren
- **Hochladen:** Dateien in die Galerie ziehen oder „Hochladen“ klicken
- **Ansichten:** Kacheln, große Kacheln, Liste
- **In Modulen nutzen:** Button „Galerie“ oder Bild aus Galerie in Eigenschaften ziehen
- **Bearbeiten:** Umbenennen, Alt-Text, Ordner wechseln, löschen

Hinweis: Hochgeladene Bilder werden im Browser gespeichert. Für die Live-Website Dateien nach `images/` legen oder exportieren.

## Header & Footer (Tab „Globale Daten")

- **Header:** Marke, Logo, Navigation ein/aus, Sticky, optionaler Button
- **Footer:** Copyright, Zusatzzeile, Links (Impressum, Datenschutz, …) anlegen/umsortieren
- Seiten **Impressum** und **Datenschutz** im Seiten-Builder bearbeiten

## Design anpassen (Tab „Design")

- **19 Farbkonzepte** (filterbar: Klassisch, Bunt, Modern)
- **8 Dekorationen:** Wolken, Blasen, Sterne, Blätter, Punkte, Sonnenstrahlen, Wellen, Keine
- **6 Scroll-Animationen:** Von unten, Einblenden, Hereinschieben, Heranzoomen, Hüpfend, Keine
- Feineinstellung aller Farben und Ecken-Rundung

8 **Referenz-Designs** als Ausgangspunkt:

| Design | Stil |
|--------|------|
| Holz & Pastell | Klassisch, freundlich (Standard) |
| Natur & Grün | Waldig, frisch |
| Himmelblau | Luftig, hell |
| Sonnenschein | Warm, orange-gelb |
| Regenbogen | Bunt, verspielt |
| Modern Minimal | Reduziert, klar |
| Waldabenteuer | Erdig, naturverbunden |
| Kirschblüte | Rosa, zart |

- Vorlage anklicken → sofort in der **Live-Vorschau** sichtbar
- **Feineinstellungen:** 10 Farben per Color-Picker, Ecken-Rundung, Wolken an/aus
- **Design speichern** → gilt für die ganze Website (auch Live-Vorschau im Builder)
- Export über `site-data.js` (Design liegt in `global.theme`)

## Live-Vorschau & Größe

- **Struktur | Live-Vorschau** umschalten in der Mitte
- In der Vorschau Modul anklicken → springt zur Bearbeitung
- Jedes Modul hat **Größe & Layout**: Breite, Abstand, Skalierung
- Karten/Galerie: **Spaltenanzahl**; Hero/Split/Slideshow: **Bildhöhe**
- **Unterelemente** (Karten, Slideshow …): per **⋮⋮** ziehen zum Umordnen

## Module (36 Typen, gruppiert in der Palette)

| Kategorie | Module |
|-----------|--------|
| **Basis** | Hero, Hero (kompakt), Textblock, Banner, Trennlinie, Abstand |
| **Inhalt** | Karten, Icon-Karten, Bild+Text, Galerie, Slideshow, Einzelbild, Video, Zitat, Elternstimmen, Zahlen & Fakten, Zeitleiste, Checkliste, Hinweis-Box, Tabs, Preisliste |
| **Daten** | Team, Gruppen, News, Kalender, Kontakt, Karte/Standort, Öffnungszeiten, Downloads, Partner/Logos |
| **Aktion** | Call-to-Action, Button-Leiste, Tagesablauf, Akkordeon |
| **Layout** | Bereich (Container), Spalten (Container) |

## Dateien

- `assets/site-data.js` – gesamte Seitenstruktur (exportieren & ersetzen)
- `assets/module-registry.js` – Modul-Typen & Rendering
- `assets/page-shell.js` – rendert Seiten dynamisch
- `seite.html?p=...` – universelle Zusatzseite

## Detailseiten

- News: `news-artikel.html?id=...`
- Kalender: `kalender-artikel.html?id=...`

## Ordner

`C:\Users\phili\Downloads\kindergarten-webereistrasse`
