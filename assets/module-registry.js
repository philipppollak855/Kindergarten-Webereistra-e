const LAYOUT_DEFAULTS = {
    width: "normal",
    paddingY: "normal",
    scale: "normal"
};

const LAYOUT_FIELDS = [
    { key: "width", label: "Breite", type: "select", options: ["full", "wide", "normal", "narrow"] },
    { key: "paddingY", label: "Abstand oben/unten", type: "select", options: ["none", "small", "normal", "large", "xl"] },
    { key: "scale", label: "Größe / Skalierung", type: "select", options: ["small", "normal", "large", "xl"] }
];

const MODULE_TYPES = {
    hero: {
        label: "Hero",
        icon: "🏠",
        canHaveChildren: false,
        defaults: {
            badge: "Willkommen",
            h1: "Überschrift",
            intro: "Einleitungstext",
            image: "images/aussen-spielplatz.png",
            imageHeight: "large",
            ctaPrimary: "Kontakt",
            ctaPrimaryLink: "kontakt.html",
            ctaSecondary: "Mehr erfahren",
            ctaSecondaryLink: "#"
        },
        fields: [
            { key: "badge", label: "Badge", type: "text" },
            { key: "h1", label: "Überschrift", type: "textarea" },
            { key: "intro", label: "Einleitung", type: "textarea" },
            { key: "image", label: "Bild", type: "text" },
            { key: "imageHeight", label: "Bildhöhe", type: "select", options: ["small", "medium", "large", "full"] },
            { key: "ctaPrimary", label: "Button 1 Text", type: "text" },
            { key: "ctaPrimaryLink", label: "Button 1 Link", type: "text" },
            { key: "ctaSecondary", label: "Button 2 Text", type: "text" },
            { key: "ctaSecondaryLink", label: "Button 2 Link", type: "text" }
        ]
    },
    text: {
        label: "Textblock",
        icon: "📝",
        canHaveChildren: false,
        defaults: { title: "Überschrift", lead: "", body: "Inhalt" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "lead", label: "Einleitung", type: "textarea" },
            { key: "body", label: "Text", type: "textarea" }
        ]
    },
    cards: {
        label: "Karten",
        icon: "🃏",
        canHaveChildren: false,
        defaults: {
            title: "Abschnittstitel",
            columns: "3",
            items: [{ title: "Karte 1", text: "Text", image: "" }]
        },
        fields: [
            { key: "title", label: "Abschnittstitel", type: "text" },
            { key: "columns", label: "Spalten", type: "select", options: ["2", "3", "4"] }
        ],
        itemFields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" },
            { key: "image", label: "Bild", type: "text" }
        ],
        itemsKey: "items"
    },
    slideshow: {
        label: "Slideshow",
        icon: "🎠",
        canHaveChildren: false,
        defaults: {
            title: "Bildergalerie",
            autoPlay: true,
            intervalMs: 4500,
            imageHeight: "medium",
            images: [{ src: "images/aussen-spielplatz.png", alt: "Bild" }]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "autoPlay", label: "Automatisch", type: "checkbox" },
            { key: "intervalMs", label: "Intervall (ms)", type: "number" },
            { key: "imageHeight", label: "Bildhöhe", type: "select", options: ["small", "medium", "large", "full"] }
        ],
        itemFields: [
            { key: "src", label: "Bildpfad", type: "text" },
            { key: "alt", label: "Alt-Text", type: "text" }
        ],
        itemsKey: "images"
    },
    split: {
        label: "Bild + Text",
        icon: "↔️",
        canHaveChildren: false,
        defaults: { title: "Titel", text: "Text", image: "", reverse: false, imageHeight: "medium" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" },
            { key: "image", label: "Bild", type: "text" },
            { key: "imageHeight", label: "Bildhöhe", type: "select", options: ["small", "medium", "large", "full"] },
            { key: "reverse", label: "Bild rechts", type: "checkbox" }
        ]
    },
    gallery: {
        label: "Galerie",
        icon: "🖼️",
        canHaveChildren: false,
        defaults: {
            title: "Galerie",
            columns: "3",
            imageHeight: "medium",
            images: [{ src: "images/gruppenraum-hell.png", alt: "Bild", caption: "" }]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "columns", label: "Spalten", type: "select", options: ["2", "3", "4"] },
            { key: "imageHeight", label: "Bildhöhe", type: "select", options: ["small", "medium", "large"] }
        ],
        itemFields: [
            { key: "src", label: "Bild", type: "text" },
            { key: "alt", label: "Alt", type: "text" },
            { key: "caption", label: "Beschriftung", type: "text" }
        ],
        itemsKey: "images"
    },
    team: {
        label: "Team",
        icon: "👥",
        canHaveChildren: false,
        defaults: { title: "Unser Team", intro: "", source: "global" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" },
            { key: "source", label: "Quelle (global)", type: "text" }
        ]
    },
    gruppen: {
        label: "Gruppen",
        icon: "🌈",
        canHaveChildren: false,
        defaults: { title: "Unsere Gruppen", intro: "", source: "global" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" }
        ]
    },
    news: {
        label: "News-Liste",
        icon: "📰",
        canHaveChildren: false,
        defaults: { title: "Aktuelles", intro: "", source: "global" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" }
        ]
    },
    aktuell: {
        label: "Startseiten-Aktuelles",
        icon: "⚡",
        canHaveChildren: false,
        defaults: { title: "Aktuelles", intro: "News und Termine von der Startseite", maxItems: 5 },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" },
            { key: "maxItems", label: "Max. Einträge", type: "number" }
        ]
    },
    kalender: {
        label: "Kalender",
        icon: "📅",
        canHaveChildren: false,
        defaults: { title: "Termine", intro: "", showGrid: true, showList: true },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" },
            { key: "showGrid", label: "Monatsraster", type: "checkbox" },
            { key: "showList", label: "Terminliste", type: "checkbox" }
        ]
    },
    speiseplan: {
        label: "Speiseplan",
        icon: "🍽️",
        canHaveChildren: false,
        defaults: { title: "Speiseplan", intro: "", defaultView: "week", allowViewSwitch: true },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" },
            { key: "defaultView", label: "Standard-Ansicht", type: "select", options: ["week", "14days"] },
            { key: "allowViewSwitch", label: "Woche/14-Tage umschaltbar", type: "checkbox" }
        ]
    },
    kontakt: {
        label: "Kontakt",
        icon: "📞",
        canHaveChildren: false,
        defaults: { title: "Kontakt", intro: "", source: "global" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "intro", label: "Einleitung", type: "textarea" }
        ]
    },
    ablauf: {
        label: "Tagesablauf",
        icon: "⏰",
        canHaveChildren: false,
        defaults: {
            title: "Tagesablauf",
            items: [{ time: "08:00", title: "Ankommen", text: "" }]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [
            { key: "time", label: "Uhrzeit", type: "text" },
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" }
        ],
        itemsKey: "items"
    },
    accordion: {
        label: "Akkordeon",
        icon: "📋",
        canHaveChildren: false,
        defaults: {
            title: "Häufige Fragen",
            items: [{ title: "Frage", body: "Antwort" }]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "body", label: "Inhalt", type: "textarea" }
        ],
        itemsKey: "items"
    },
    video: {
        label: "Video",
        icon: "🎬",
        canHaveChildren: false,
        defaults: { title: "", embedUrl: "" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "embedUrl", label: "Embed-URL", type: "text" }
        ]
    },
    image: {
        label: "Einzelbild",
        icon: "🖼",
        canHaveChildren: false,
        defaults: { src: "", alt: "", caption: "", imageHeight: "medium" },
        fields: [
            { key: "src", label: "Bildpfad", type: "text" },
            { key: "alt", label: "Alt-Text", type: "text" },
            { key: "caption", label: "Beschriftung", type: "text" },
            { key: "imageHeight", label: "Bildhöhe", type: "select", options: ["small", "medium", "large", "full"] }
        ]
    },
    cta: {
        label: "Call-to-Action",
        icon: "🔔",
        canHaveChildren: false,
        defaults: { title: "Jetzt anmelden", text: "", buttonLabel: "Kontakt", buttonLink: "kontakt.html" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" },
            { key: "buttonLabel", label: "Button", type: "text" },
            { key: "buttonLink", label: "Link", type: "text" }
        ]
    },
    spacer: {
        label: "Abstand",
        icon: "↕️",
        canHaveChildren: false,
        defaults: { height: 40 },
        fields: [{ key: "height", label: "Höhe (px)", type: "number" }]
    },
    section: {
        label: "Bereich (Container)",
        icon: "📦",
        canHaveChildren: true,
        defaults: { title: "", background: "white" },
        fields: [
            { key: "title", label: "Titel (optional)", type: "text" },
            { key: "background", label: "Hintergrund", type: "select", options: ["white", "mint", "wood", "apricot"] }
        ]
    },
    columns: {
        label: "Spalten (Container)",
        icon: "▦",
        canHaveChildren: true,
        defaults: { columns: 2, gap: 20 },
        fields: [
            { key: "columns", label: "Spalten", type: "number" },
            { key: "gap", label: "Abstand", type: "number" }
        ]
    },
    zitat: {
        label: "Zitat",
        icon: "💬",
        canHaveChildren: false,
        defaults: { text: "Ein schönes Zitat über unseren Kindergarten.", author: "Eltern", role: "", image: "" },
        fields: [
            { key: "text", label: "Zitat", type: "textarea" },
            { key: "author", label: "Autor/in", type: "text" },
            { key: "role", label: "Rolle (optional)", type: "text" },
            { key: "image", label: "Bild (optional)", type: "text" }
        ]
    },
    zahlen: {
        label: "Zahlen & Fakten",
        icon: "🔢",
        canHaveChildren: false,
        defaults: {
            title: "Unsere Kindergarten-Zahlen",
            columns: "4",
            items: [
                { value: "60", label: "Kinder", icon: "👧" },
                { value: "3", label: "Gruppen", icon: "🌈" },
                { value: "8", label: "Pädagogen", icon: "👩‍🏫" },
                { value: "2020", label: "Eröffnung", icon: "🏠" }
            ]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "columns", label: "Spalten", type: "select", options: ["2", "3", "4"] }
        ],
        itemFields: [
            { key: "icon", label: "Icon (Emoji)", type: "text" },
            { key: "value", label: "Zahl", type: "text" },
            { key: "label", label: "Bezeichnung", type: "text" }
        ],
        itemsKey: "items"
    },
    hinweis: {
        label: "Hinweis-Box",
        icon: "ℹ️",
        canHaveChildren: false,
        defaults: { title: "Wichtiger Hinweis", text: "Information für Eltern.", variant: "info", icon: "ℹ️" },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" },
            { key: "icon", label: "Icon (Emoji)", type: "text" },
            { key: "variant", label: "Stil", type: "select", options: ["info", "success", "warning", "mint", "wood"] }
        ]
    },
    icons: {
        label: "Icon-Karten",
        icon: "✨",
        canHaveChildren: false,
        defaults: {
            title: "Unsere Schwerpunkte",
            columns: "3",
            items: [
                { icon: "🌿", title: "Natur", text: "Draußen spielen und entdecken." },
                { icon: "🎨", title: "Kreativität", text: "Malen, Basteln, Musizieren." },
                { icon: "🤝", title: "Gemeinschaft", text: "Zusammen wachsen und lernen." }
            ]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "columns", label: "Spalten", type: "select", options: ["2", "3", "4"] }
        ],
        itemFields: [
            { key: "icon", label: "Icon (Emoji)", type: "text" },
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" }
        ],
        itemsKey: "items"
    },
    buttons: {
        label: "Button-Leiste",
        icon: "🔗",
        canHaveChildren: false,
        defaults: {
            title: "",
            align: "center",
            items: [
                { label: "Kontakt", link: "kontakt.html", style: "primary" },
                { label: "Anmeldung", link: "#", style: "soft" }
            ]
        },
        fields: [
            { key: "title", label: "Titel (optional)", type: "text" },
            { key: "align", label: "Ausrichtung", type: "select", options: ["left", "center", "right"] }
        ],
        itemFields: [
            { key: "label", label: "Button-Text", type: "text" },
            { key: "link", label: "Link", type: "text" },
            { key: "style", label: "Stil", type: "select", options: ["primary", "soft"] }
        ],
        itemsKey: "items"
    },
    downloads: {
        label: "Downloads",
        icon: "📥",
        canHaveChildren: false,
        defaults: {
            title: "Formulare & Downloads",
            items: [{ title: "Anmeldeformular", file: "downloads/anmeldung.pdf", description: "PDF zum Ausdrucken" }]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [
            { key: "title", label: "Name", type: "text" },
            { key: "file", label: "Dateipfad / URL", type: "text" },
            { key: "description", label: "Beschreibung", type: "text" }
        ],
        itemsKey: "items"
    },
    karte: {
        label: "Karte / Standort",
        icon: "🗺️",
        canHaveChildren: false,
        defaults: {
            title: "So finden Sie uns",
            embedUrl: "https://maps.google.com/maps?q=Webereistra%C3%9Fe+2A,+2630+Ternitz,+AUT&output=embed",
            address: "Webereistraße 2A, 2630 Ternitz",
            mapsLink: "https://maps.google.com/?q=Webereistra%C3%9Fe+2A,+2630+Ternitz,+AUT",
            height: 360
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "embedUrl", label: "Karten-Embed-URL", type: "text" },
            { key: "address", label: "Adresse", type: "text" },
            { key: "mapsLink", label: "Link Google Maps", type: "text" },
            { key: "height", label: "Höhe (px)", type: "number" }
        ]
    },
    oeffnungszeiten: {
        label: "Öffnungszeiten",
        icon: "🕐",
        canHaveChildren: false,
        defaults: {
            title: "Öffnungszeiten",
            note: "An Feiertagen geschlossen.",
            items: [
                { day: "Montag – Freitag", time: "07:00 – 16:30" },
                { day: "Mittagspause Betreuung", time: "11:30 – 13:30" }
            ]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "note", label: "Fußnote", type: "textarea" }
        ],
        itemFields: [
            { key: "day", label: "Tag / Zeitraum", type: "text" },
            { key: "time", label: "Uhrzeit", type: "text" }
        ],
        itemsKey: "items"
    },
    partner: {
        label: "Partner / Logos",
        icon: "🤝",
        canHaveChildren: false,
        defaults: {
            title: "Unsere Partner",
            items: [{ name: "Partner", logo: "images/avatars/placeholder.svg", link: "" }]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [
            { key: "name", label: "Name", type: "text" },
            { key: "logo", label: "Logo-Bild", type: "text" },
            { key: "link", label: "Link (optional)", type: "text" }
        ],
        itemsKey: "items"
    },
    checkliste: {
        label: "Checkliste",
        icon: "✅",
        canHaveChildren: false,
        defaults: {
            title: "Das brauchen Sie zur Anmeldung",
            items: [{ text: "Geburtsurkunde des Kindes" }, { text: "Impfpass" }]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [{ key: "text", label: "Eintrag", type: "text" }],
        itemsKey: "items"
    },
    tabs: {
        label: "Tabs / Reiter",
        icon: "📑",
        canHaveChildren: false,
        defaults: {
            title: "",
            items: [
                { tab: "Vormittag", title: "Vormittagsbetreuung", body: "Freispiel, Frühstück, Morgenkreis." },
                { tab: "Nachmittag", title: "Nachmittagsbetreuung", body: "Mittagessen, Ruhezeit, Projekte." }
            ]
        },
        fields: [{ key: "title", label: "Titel (optional)", type: "text" }],
        itemFields: [
            { key: "tab", label: "Reiter-Name", type: "text" },
            { key: "title", label: "Inhalt-Titel", type: "text" },
            { key: "body", label: "Text", type: "textarea" }
        ],
        itemsKey: "items"
    },
    banner: {
        label: "Banner / Ankündigung",
        icon: "📢",
        canHaveChildren: false,
        defaults: {
            text: "Anmeldungen für das Kindergartenjahr 2026/27 sind möglich!",
            link: "kontakt.html",
            linkLabel: "Jetzt anfragen",
            variant: "mint",
            icon: "📢"
        },
        fields: [
            { key: "text", label: "Text", type: "textarea" },
            { key: "icon", label: "Icon", type: "text" },
            { key: "linkLabel", label: "Link-Text", type: "text" },
            { key: "link", label: "Link", type: "text" },
            { key: "variant", label: "Farbe", type: "select", options: ["mint", "wood", "apricot", "white"] }
        ]
    },
    testimonials: {
        label: "Elternstimmen",
        icon: "⭐",
        canHaveChildren: false,
        defaults: {
            title: "Was Eltern sagen",
            columns: "2",
            items: [
                { text: "Unser Kind fühlt sich hier sehr wohl.", author: "Familie M.", stars: "5" },
                { text: "Tolles Team und schöne Räume!", author: "Familie K.", stars: "5" }
            ]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "columns", label: "Spalten", type: "select", options: ["1", "2", "3"] }
        ],
        itemFields: [
            { key: "text", label: "Zitat", type: "textarea" },
            { key: "author", label: "Autor", type: "text" },
            { key: "stars", label: "Sterne (1–5)", type: "text" }
        ],
        itemsKey: "items"
    },
    trennlinie: {
        label: "Trennlinie",
        icon: "➖",
        canHaveChildren: false,
        defaults: { text: "", style: "dots", icon: "" },
        fields: [
            { key: "text", label: "Text in der Mitte (optional)", type: "text" },
            { key: "icon", label: "Icon (optional)", type: "text" },
            { key: "style", label: "Stil", type: "select", options: ["line", "dots", "wave"] }
        ]
    },
    heroKompakt: {
        label: "Hero (kompakt)",
        icon: "🏡",
        canHaveChildren: false,
        defaults: {
            title: "Überschrift",
            subtitle: "Kurzer Untertitel",
            background: "mint",
            image: "",
            buttonLabel: "",
            buttonLink: ""
        },
        fields: [
            { key: "title", label: "Überschrift", type: "text" },
            { key: "subtitle", label: "Untertitel", type: "textarea" },
            { key: "background", label: "Hintergrund", type: "select", options: ["mint", "wood", "apricot", "white"] },
            { key: "image", label: "Hintergrundbild (optional)", type: "text" },
            { key: "buttonLabel", label: "Button (optional)", type: "text" },
            { key: "buttonLink", label: "Button-Link", type: "text" }
        ]
    },
    preisliste: {
        label: "Preisliste / Gebühren",
        icon: "💶",
        canHaveChildren: false,
        defaults: {
            title: "Beiträge & Gebühren",
            note: "Alle Angaben ohne Gewähr.",
            items: [
                { title: "Monatsbeitrag", price: "€ 0,–", description: "Gemäß Landesregelung" },
                { title: "Verpflegung", price: "€ 3,50", description: "pro Tag" }
            ]
        },
        fields: [
            { key: "title", label: "Titel", type: "text" },
            { key: "note", label: "Fußnote", type: "textarea" }
        ],
        itemFields: [
            { key: "title", label: "Bezeichnung", type: "text" },
            { key: "price", label: "Preis", type: "text" },
            { key: "description", label: "Beschreibung", type: "text" }
        ],
        itemsKey: "items"
    },
    timeline: {
        label: "Zeitleiste",
        icon: "📍",
        canHaveChildren: false,
        defaults: {
            title: "Unsere Geschichte",
            items: [
                { year: "2020", title: "Eröffnung", text: "Der Kindergarten öffnet seine Türen." },
                { year: "2023", title: "Erweiterung", text: "Neuer Gruppenraum und Spielplatz." }
            ]
        },
        fields: [{ key: "title", label: "Titel", type: "text" }],
        itemFields: [
            { key: "year", label: "Jahr / Datum", type: "text" },
            { key: "title", label: "Titel", type: "text" },
            { key: "text", label: "Text", type: "textarea" }
        ],
        itemsKey: "items"
    }
};

const MODULE_META = {
    hero: { description: "Großer Startbereich mit Überschrift, Text, Bild und zwei Buttons.", usage: "Ideal für die Startseite. Bildhöhe und Buttons anpassbar." },
    heroKompakt: { description: "Schmaler Kopfbereich ohne großes Seitenbild.", usage: "Für Unterseiten oder Abschnittsüberschriften mit Hintergrundfarbe." },
    text: { description: "Einfacher Textblock mit Titel, Einleitung und Fließtext.", usage: "Für längere Inhalte, Absätze mit Leerzeile trennen." },
    banner: { description: "Auffälliger Ankündigungs-Streifen über die volle Breite.", usage: "Für Hinweise wie Anmeldungen, Schließtage oder Events." },
    trennlinie: { description: "Dekorative Trennung zwischen Abschnitten.", usage: "Optional mit Text oder Icon in der Mitte." },
    spacer: { description: "Leerer Abstand in definierter Höhe.", usage: "Luft zwischen Modulen schaffen, Höhe in Pixel einstellbar." },
    cards: { description: "Raster aus Karten mit Bild, Titel und Text.", usage: "Unterelemente per Drag & Drop sortierbar. Spaltenanzahl wählbar." },
    icons: { description: "Karten mit Emoji-Icon statt Foto.", usage: "Schwerpunkte, Werte oder Angebote übersichtlich darstellen." },
    split: { description: "Bild und Text nebeneinander.", usage: "Bild links oder rechts. Gut für Vorstellungen mit Foto." },
    gallery: { description: "Bildergalerie mit Beschriftungen.", usage: "Beliebig viele Bilder als Unterelemente." },
    slideshow: { description: "Automatisches Bildkarussell.", usage: "Wechselintervall einstellbar. Mehrere Bilder als Unterelemente." },
    image: { description: "Einzelnes Bild mit Alt-Text und Beschriftung.", usage: "Bildhöhe und Layout-Größe anpassbar." },
    video: { description: "Eingebettetes Video (YouTube/Vimeo).", usage: "Embed-URL aus dem Teilen-Dialog des Anbieters einfügen." },
    zitat: { description: "Hervorgehobenes Zitat mit Autor.", usage: "Für Elternstimmen, Leitbild-Zitate oder Referenzen." },
    testimonials: { description: "Mehrere Zitate in Karten mit Sternebewertung.", usage: "Elternstimmen oder Rückmeldungen gesammelt anzeigen." },
    zahlen: { description: "Kennzahlen mit Icon, Zahl und Bezeichnung.", usage: "z. B. Kinderanzahl, Gruppen, Teamgröße." },
    timeline: { description: "Chronologische Zeitleiste mit Jahreszahlen.", usage: "Geschichte des Kindergartens oder Meilensteine." },
    checkliste: { description: "Liste mit Häkchen-Symbolen.", usage: "Anmeldeunterlagen, Mitbringlisten, Checklisten." },
    hinweis: { description: "Farbige Info-Box für wichtige Hinweise.", usage: "Stile: Info, Erfolg, Warnung. Gut für Elternhinweise." },
    tabs: { description: "Inhalte in umschaltbaren Reitern.", usage: "Mehrere Themen auf wenig Platz, z. B. Vormittag/Nachmittag." },
    preisliste: { description: "Übersicht von Beiträgen und Gebühren.", usage: "Preis pro Zeile mit optionaler Beschreibung." },
    team: { description: "Zeigt alle Teammitglieder aus den globalen Daten.", usage: "Personal im Tab Globale Daten pflegen." },
    gruppen: { description: "Gruppenübersicht mit Bild und zugeordnetem Team.", usage: "Gruppen global pflegen, erscheinen automatisch hier." },
    news: { description: "Liste aller News-Beiträge mit Vorschau.", usage: "News im Tab News & Termine pflegen. Geplante Veröffentlichung möglich." },
    aktuell: { description: "News und Termine auf der Startseite mit Erscheinungszeit.", usage: "Im Tab News & Termine planen. Erscheint automatisch zum Zeitpunkt." },
    kalender: { description: "Monatskalender und/oder Terminliste.", usage: "Termine im Tab News & Termine pflegen. Monate mit Pfeilen wechseln." },
    speiseplan: { description: "Speiseplan als Wochen- oder 14-Tage-Tabelle.", usage: "Pläne im Tab News & Termine → Speiseplan pflegen. Vorplanung mit Veröffentlichungsdatum möglich." },
    kontakt: { description: "Kontaktkarten mit Adresse, Telefon und E-Mail.", usage: "Daten aus globalen Kontakt-Einstellungen." },
    karte: { description: "Google-Maps-Karte mit Adresse.", usage: "Embed-URL und Adresse im Modul einstellbar." },
    oeffnungszeiten: { description: "Tabelle mit Öffnungszeiten.", usage: "Zeilen als Unterelemente, Fußnote optional." },
    downloads: { description: "Liste zum Herunterladen von Dateien.", usage: "PDFs und Formulare mit Pfad oder URL verlinken." },
    partner: { description: "Logo-Leiste von Partnern und Sponsoren.", usage: "Logos als Unterelemente mit optionalem Link." },
    cta: { description: "Aufforderungs-Bereich mit Titel, Text und Button.", usage: "z. B. Jetzt anmelden mit Link zur Kontaktseite." },
    buttons: { description: "Mehrere Buttons nebeneinander.", usage: "Links zu Seiten oder externen URLs. Stil primary/soft." },
    ablauf: { description: "Tagesablauf mit Uhrzeiten.", usage: "Zeitblöcke als Unterelemente, z. B. für Pädagogik-Seite." },
    accordion: { description: "Aufklappbare Fragen-und-Antworten-Bereiche.", usage: "FAQ, häufige Fragen der Eltern." },
    section: { description: "Container-Bereich mit Hintergrundfarbe.", usage: "Andere Module per Drag & Drop hineinziehen (Untermodule)." },
    columns: { description: "Spalten-Layout für nebeneinander liegende Module.", usage: "2–3 Spalten. Module in Spalten als Kinder ablegen." }
};

function getModuleMeta(type) {
    const def = MODULE_TYPES[type];
    const meta = MODULE_META[type] || {};
    return {
        label: def?.label || type,
        icon: def?.icon || "📦",
        description: meta.description || "Baustein für Ihre Seite.",
        usage: meta.usage || "",
        canHaveChildren: def?.canHaveChildren || false,
        hasSubItems: !!(def?.itemsKey)
    };
}

function createPreviewModule(type) {
    const mod = createModule(type);
    if (!mod) return null;
    if (type === "section") {
        const child = createModule("text");
        if (child) mod.children = [child];
    }
    if (type === "columns") {
        mod.children = [createModule("text"), createModule("text")].filter(Boolean);
    }
    return mod;
}

function createModule(type) {
    const def = MODULE_TYPES[type];
    if (!def) return null;
    const mod = {
        id: uid("mod"),
        type,
        props: { ...structuredClone(LAYOUT_DEFAULTS), ...structuredClone(def.defaults) }
    };
    if (def.canHaveChildren) mod.children = [];
    return mod;
}

function layoutClasses(p) {
    const w = p.width || "normal";
    const py = p.paddingY || "normal";
    const sc = p.scale || "normal";
    return `mod-layout mod-w-${w} mod-py-${py} mod-scale-${sc}`;
}

function imgHeightClass(p) {
    return `mod-img-h-${p.imageHeight || "medium"}`;
}

function wrapWithLayout(html, module) {
    if (module.type === "spacer") return html;
    const cls = layoutClasses(module.props || {});
    return `<div class="${cls}" data-module-id="${escapeHtml(module.id)}" data-module-type="${module.type}">${html}</div>`;
}

function renderModule(module, site, depth = 0) {
    const inner = renderModuleInner(module, site, depth);
    if (!inner) return "";
    return wrapWithLayout(inner, module);
}

function renderTextBody(body) {
    return String(body ?? "")
        .split("\n\n")
        .filter((block) => block.trim())
        .map((block) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("## ")) {
                return `<h3 class="text-section-title">${escapeHtml(trimmed.slice(3))}</h3>`;
            }
            if (trimmed.startsWith("### ")) {
                return `<h4 class="text-section-subtitle">${escapeHtml(trimmed.slice(4))}</h4>`;
            }
            if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^- /, "").trim()).filter(Boolean);
                return `<ul class="text-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
            }
            return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
        })
        .join("");
}

function renderModuleInner(module, site, depth = 0) {
    const p = module.props || {};
    const type = module.type;

    if (type === "section" || type === "columns") {
        const bgClass = type === "section" ? `mod-bg-${p.background || "white"}` : "";
        const colStyle = type === "columns" ? `grid-template-columns:repeat(${p.columns || 2},1fr);gap:${p.gap || 20}px` : "";
        const childrenHtml = (module.children || []).map((child) => renderModule(child, site, depth + 1)).join("");
        return `
            <section class="mod-${type} ${bgClass} visible" style="${type === "columns" ? `display:grid;${colStyle}` : ""}">
                ${p.title ? `<h2 class="section-header-inline">${escapeHtml(p.title)}</h2>` : ""}
                ${childrenHtml}
            </section>`;
    }

    switch (type) {
        case "hero":
            return `<section class="container hero-grid visible ${imgHeightClass(p)}">
                <div><div class="badge">${escapeHtml(p.badge)}</div>
                <h1>${escapeHtml(p.h1).replace(/\n/g, "<br>")}</h1>
                <p class="lead">${escapeHtml(p.intro)}</p>
                <div class="btn-row">
                    <a class="btn primary" href="${escapeHtml(p.ctaPrimaryLink)}">${escapeHtml(p.ctaPrimary)}</a>
                    <a class="btn soft" href="${escapeHtml(p.ctaSecondaryLink)}">${escapeHtml(p.ctaSecondary)}</a>
                </div></div>
                <div class="frame"><img src="${escapeHtml(p.image)}" alt=""></div>
            </section>`;
        case "text":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                ${p.lead ? `<p class="lead">${escapeHtml(p.lead)}</p>` : ""}
                <div class="text-body">${renderTextBody(p.body)}</div>
            </section>`;
        case "cards":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="cards cards-cols-${p.columns || "3"}">${(p.items || []).map((c) => `
                    <article class="card card-with-image">
                        ${c.image ? `<img class="card-image" src="${escapeHtml(c.image)}" alt="">` : ""}
                        <h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.text)}</p>
                    </article>`).join("")}</div>
            </section>`;
        case "slideshow": {
            const imgs = (p.images || []).map((i) => ({ src: i.src, alt: i.alt }));
            const carousel = typeof buildCarouselHtml === "function" ? buildCarouselHtml(imgs, { autoPlay: p.autoPlay !== false, interval: p.intervalMs || 4500 }) : "";
            return `<section class="container section visible ${imgHeightClass(p)}">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                ${carousel}
            </section>`;
        }
        case "split":
            return `<section class="container section visible"><div class="split ${p.reverse ? "split-reverse" : ""} ${imgHeightClass(p)}">
                ${p.image ? `<img src="${escapeHtml(p.image)}" alt="">` : ""}
                <div><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.text)}</p></div>
            </div></section>`;
        case "gallery":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="gallery gallery-cols-${p.columns || "3"} ${imgHeightClass(p)}">${(p.images || []).map((i) => `
                    <article><img src="${escapeHtml(i.src)}" alt="${escapeHtml(i.alt)}"><h4>${escapeHtml(i.caption || i.alt)}</h4></article>`).join("")}</div>
            </section>`;
        case "team": {
            const members = site.global?.team?.members || [];
            return `<section class="container section visible">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                <div class="team-grid">${members.map((m) => `
                    <article class="team-card"><img class="team-avatar" src="${escapeHtml(m.avatar)}" alt="">
                    <h3>${escapeHtml(m.name)}</h3><p class="team-position">${escapeHtml(m.position)}</p><p>${escapeHtml(m.intro)}</p></article>`).join("")}</div>
            </section>`;
        }
        case "gruppen": {
            const items = site.global?.gruppen?.items || [];
            return `<section class="container section visible">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                <div class="gruppen-list">${items.map((g) => {
                    const team = (site.global?.team?.members || []).filter((m) => m.gruppe === g.name);
                    return `<article class="gruppe-card"><img src="${escapeHtml(g.image)}" alt=""><div class="gruppe-body">
                        <h3>${escapeHtml(g.name)}</h3><p class="gruppe-meta">${escapeHtml(g.ageRange)} · ${escapeHtml(g.capacity)}</p>
                        <p>${escapeHtml(g.description)}</p>
                        ${team.length ? `<div class="gruppe-team"><h4>Team</h4>${team.map((m) => `<div class="gruppe-team-member"><img src="${escapeHtml(m.avatar)}" alt=""><div><strong>${escapeHtml(m.name)}</strong><span>${escapeHtml(m.position)}</span></div></div>`).join("")}</div>` : ""}
                    </div></article>`;
                }).join("")}</div>
            </section>`;
        }
        case "news": {
            const items = typeof filterPublished === "function"
                ? filterPublished(site.global?.news?.items || [])
                : (site.global?.news?.items || []);
            return `<section class="container section visible">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                <div class="news-list">${items.map((n) => `
                    <a class="news-card-link" href="news-artikel.html?id=${encodeURIComponent(n.id)}">
                    <article class="news-card">${n.image ? `<img src="${escapeHtml(n.image)}" alt="">` : ""}
                    <div class="news-body"><time>${escapeHtml(n.date)}</time><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.teaser)}</p><span class="read-more">Weiterlesen →</span></div></article></a>`).join("")}</div>
            </section>`;
        }
        case "aktuell": {
            const feed = typeof getHomepageFeed === "function" ? getHomepageFeed(site) : [];
            const max = Number(p.maxItems) || 5;
            const items = feed.slice(0, max);
            return `<section class="container section visible">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                ${items.length ? `<div class="aktuell-feed">${items.map((item) => {
                    const isNews = item._feedType === "news";
                    const href = isNews ? `news-artikel.html?id=${encodeURIComponent(item.id)}` : `kalender-artikel.html?id=${encodeURIComponent(item.id)}`;
                    const label = isNews ? "News" : "Termin";
                    const meta = isNews ? item.date : `${item.date}${item.time ? ` · ${item.time}` : ""}`;
                    const text = isNews ? item.teaser : (item.description || "");
                    return `<a class="aktuell-item" href="${href}">
                        <span class="aktuell-type">${label}</span>
                        <div class="aktuell-body">
                            <time>${escapeHtml(meta)}</time>
                            <h3>${escapeHtml(item.title)}</h3>
                            <p>${escapeHtml(text)}</p>
                            <span class="read-more">Mehr erfahren →</span>
                        </div>
                    </a>`;
                }).join("")}</div>` : `<p class="kalender-empty">Derzeit nichts Geplantes für die Startseite.</p>`}
            </section>`;
        }
        case "kalender":
            return `<section class="container section visible" data-mod-kalender data-show-grid="${p.showGrid !== false}" data-show-list="${p.showList !== false}">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                ${p.showGrid !== false ? '<div data-render="kalender-grid"></div>' : ""}
                ${p.showList !== false ? '<div class="kalender-events" data-render="kalender-list"></div>' : ""}
            </section>`;
        case "speiseplan":
            return `<section class="container section visible" data-mod-speiseplan data-default-view="${escapeHtml(p.defaultView || "week")}" data-allow-switch="${p.allowViewSwitch !== false}">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                <div data-render="speiseplan-root"></div>
            </section>`;
        case "kontakt": {
            const k = site.global?.kontakt || {};
            return `<section class="container section visible">
                <div class="section-header"><h2>${escapeHtml(p.title)}</h2>${p.intro ? `<p class="lead">${escapeHtml(p.intro)}</p>` : ""}</div>
                <div class="contact-grid">
                    <article class="contact-card"><h3>Adresse</h3><p>${escapeHtml(k.address)}</p><p><a href="${escapeHtml(k.mapsUrl)}">Auf Karte ansehen</a></p></article>
                    <article class="contact-card"><h3>Telefon</h3><p><a href="${escapeHtml(k.phoneLink)}">${escapeHtml(k.phoneDisplay)}</a></p></article>
                    <article class="contact-card"><h3>E-Mail</h3><p><a href="${escapeHtml(k.emailLink)}">${escapeHtml(k.email)}</a></p></article>
                </div>
            </section>`;
        }
        case "ablauf":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="ablauf-list">${(p.items || []).map((a) => `
                    <article class="ablauf-item"><span class="ablauf-time">${escapeHtml(a.time)}</span>
                    <div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.text)}</p></div></article>`).join("")}</div>
            </section>`;
        case "accordion":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="accordion">${(p.items || []).map((item, i) => `
                    <details class="accordion-item" ${i === 0 ? "open" : ""}>
                        <summary>${escapeHtml(item.title)}</summary><p>${escapeHtml(item.body)}</p>
                    </details>`).join("")}</div>
            </section>`;
        case "video":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="video-embed"><iframe src="${escapeHtml(p.embedUrl)}" allowfullscreen loading="lazy"></iframe></div>
            </section>`;
        case "image":
            return `<section class="container section visible mod-single-image ${imgHeightClass(p)}">
                <figure><img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}">${p.caption ? `<figcaption>${escapeHtml(p.caption)}</figcaption>` : ""}</figure>
            </section>`;
        case "cta":
            return `<section class="container section visible"><div class="cta-box">
                <h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.text)}</p>
                <a class="btn primary" href="${escapeHtml(p.buttonLink)}">${escapeHtml(p.buttonLabel)}</a>
            </div></section>`;
        case "spacer":
            return `<div class="mod-spacer visible" style="height:${Number(p.height) || 40}px"></div>`;
        case "zitat":
            return `<section class="container section visible">
                <blockquote class="mod-quote">
                    ${p.image ? `<img class="mod-quote-avatar" src="${escapeHtml(p.image)}" alt="">` : ""}
                    <p class="mod-quote-text">„${escapeHtml(p.text)}"</p>
                    <footer><strong>${escapeHtml(p.author)}</strong>${p.role ? ` <span>· ${escapeHtml(p.role)}</span>` : ""}</footer>
                </blockquote>
            </section>`;
        case "zahlen":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="mod-stats stats-cols-${p.columns || "4"}">${(p.items || []).map((s) => `
                    <article class="mod-stat">
                        ${s.icon ? `<span class="mod-stat-icon">${escapeHtml(s.icon)}</span>` : ""}
                        <span class="mod-stat-value">${escapeHtml(s.value)}</span>
                        <span class="mod-stat-label">${escapeHtml(s.label)}</span>
                    </article>`).join("")}</div>
            </section>`;
        case "hinweis":
            return `<section class="container section visible">
                <div class="mod-notice mod-notice-${p.variant || "info"}">
                    ${p.icon ? `<span class="mod-notice-icon">${escapeHtml(p.icon)}</span>` : ""}
                    <div>
                        ${p.title ? `<h3>${escapeHtml(p.title)}</h3>` : ""}
                        <p>${escapeHtml(p.text).replace(/\n/g, "<br>")}</p>
                    </div>
                </div>
            </section>`;
        case "icons":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="mod-icon-cards cards-cols-${p.columns || "3"}">${(p.items || []).map((c) => `
                    <article class="mod-icon-card">
                        <span class="mod-icon-card-emoji">${escapeHtml(c.icon || "✨")}</span>
                        <h3>${escapeHtml(c.title)}</h3>
                        <p>${escapeHtml(c.text)}</p>
                    </article>`).join("")}</div>
            </section>`;
        case "buttons":
            return `<section class="container section visible mod-buttons mod-buttons-${p.align || "center"}">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="btn-row">${(p.items || []).map((b) => `
                    <a class="btn ${b.style === "soft" ? "soft" : "primary"}" href="${escapeHtml(b.link || "#")}">${escapeHtml(b.label)}</a>
                `).join("")}</div>
            </section>`;
        case "downloads":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <ul class="mod-downloads">${(p.items || []).map((d) => `
                    <li><a href="${escapeHtml(d.file)}" download>
                        <span class="mod-dl-icon">📄</span>
                        <span><strong>${escapeHtml(d.title)}</strong>${d.description ? `<small>${escapeHtml(d.description)}</small>` : ""}</span>
                    </a></li>`).join("")}</ul>
            </section>`;
        case "karte":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="mod-map">
                    <iframe src="${escapeHtml(p.embedUrl)}" style="height:${Number(p.height) || 360}px" loading="lazy" allowfullscreen title="Karte"></iframe>
                    <p class="mod-map-address">${escapeHtml(p.address)} · <a href="${escapeHtml(p.mapsLink)}" target="_blank" rel="noopener">Route planen</a></p>
                </div>
            </section>`;
        case "oeffnungszeiten":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="mod-hours">
                    <table>${(p.items || []).map((row) => `
                        <tr><th>${escapeHtml(row.day)}</th><td>${escapeHtml(row.time)}</td></tr>
                    `).join("")}</table>
                    ${p.note ? `<p class="mod-hours-note">${escapeHtml(p.note)}</p>` : ""}
                </div>
            </section>`;
        case "partner":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="mod-partners">${(p.items || []).map((pt) => {
                    const inner = `<img src="${escapeHtml(pt.logo)}" alt="${escapeHtml(pt.name)}">`;
                    return pt.link
                        ? `<a href="${escapeHtml(pt.link)}" target="_blank" rel="noopener">${inner}</a>`
                        : `<span>${inner}</span>`;
                }).join("")}</div>
            </section>`;
        case "checkliste":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <ul class="mod-checklist">${(p.items || []).map((item) => `
                    <li>${escapeHtml(item.text)}</li>`).join("")}</ul>
            </section>`;
        case "tabs": {
            const items = p.items || [];
            const tabsId = `tabs-${module.id}`;
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="mod-tabs" data-tabs="${tabsId}">
                    <div class="mod-tabs-nav" role="tablist">${items.map((item, i) => `
                        <button type="button" role="tab" class="${i === 0 ? "active" : ""}" data-tab-index="${i}" aria-selected="${i === 0}">${escapeHtml(item.tab)}</button>
                    `).join("")}</div>
                    <div class="mod-tabs-panels">${items.map((item, i) => `
                        <div class="mod-tab-panel ${i === 0 ? "active" : ""}" role="tabpanel" data-tab-panel="${i}">
                            ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ""}
                            <p>${escapeHtml(item.body).replace(/\n/g, "<br>")}</p>
                        </div>
                    `).join("")}</div>
                </div>
            </section>`;
        }
        case "banner":
            return `<section class="mod-banner mod-banner-${p.variant || "mint"} visible">
                <div class="container mod-banner-inner">
                    ${p.icon ? `<span class="mod-banner-icon">${escapeHtml(p.icon)}</span>` : ""}
                    <p>${escapeHtml(p.text)}</p>
                    ${p.link && p.linkLabel ? `<a class="btn soft" href="${escapeHtml(p.link)}">${escapeHtml(p.linkLabel)}</a>` : ""}
                </div>
            </section>`;
        case "testimonials":
            return `<section class="container section visible">
                ${p.title ? `<div class="section-header"><h2>${escapeHtml(p.title)}</h2></div>` : ""}
                <div class="mod-testimonials testimonials-cols-${p.columns || "2"}">${(p.items || []).map((t) => `
                    <article class="mod-testimonial">
                        <div class="mod-testimonial-stars">${"★".repeat(Math.min(5, Number(t.stars) || 5))}</div>
                        <p>„${escapeHtml(t.text)}"</p>
                        <footer>— ${escapeHtml(t.author)}</footer>
                    </article>`).join("")}</div>
            </section>`;
        case "trennlinie":
            return `<div class="container mod-divider mod-divider-${p.style || "dots"} visible">
                ${p.text || p.icon ? `<span class="mod-divider-label">${p.icon ? escapeHtml(p.icon) + " " : ""}${escapeHtml(p.text)}</span>` : ""}
            </div>`;
        case "heroKompakt": {
            const bg = `mod-bg-${p.background || "mint"}`;
            const bgImg = p.image ? `style="background-image:linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.9)),url('${escapeHtml(p.image)}')"` : "";
            return `<section class="mod-hero-compact ${bg} visible" ${bgImg}>
                <div class="container mod-hero-compact-inner">
                    <h1>${escapeHtml(p.title)}</h1>
                    ${p.subtitle ? `<p class="lead">${escapeHtml(p.subtitle)}</p>` : ""}
                    ${p.buttonLabel ? `<a class="btn primary" href="${escapeHtml(p.buttonLink || "#")}">${escapeHtml(p.buttonLabel)}</a>` : ""}
                </div>
            </section>`;
        }
        case "preisliste":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="mod-pricing">${(p.items || []).map((item) => `
                    <article class="mod-price-item">
                        <div><h3>${escapeHtml(item.title)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}</div>
                        <span class="mod-price-value">${escapeHtml(item.price)}</span>
                    </article>`).join("")}</div>
                ${p.note ? `<p class="mod-pricing-note">${escapeHtml(p.note)}</p>` : ""}
            </section>`;
        case "timeline":
            return `<section class="container section visible">
                ${p.title ? `<h2>${escapeHtml(p.title)}</h2>` : ""}
                <div class="mod-timeline">${(p.items || []).map((item) => `
                    <article class="mod-timeline-item">
                        <span class="mod-timeline-year">${escapeHtml(item.year)}</span>
                        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
                    </article>`).join("")}</div>
            </section>`;
        default:
            return "";
    }
}

function renderPage(site, pageId) {
    const page = getPageById(site, pageId);
    if (!page) return "<p>Seite nicht gefunden.</p>";
    return (page.modules || []).map((m) => renderModule(m, site)).join("");
}

function initPageCarousels(root) {
    root.querySelectorAll(".carousel").forEach((el) => {
        if (typeof initCarousel === "function") initCarousel(el);
    });
}

function initPageTabs(root) {
    root.querySelectorAll(".mod-tabs").forEach((tabs) => {
        const buttons = tabs.querySelectorAll("[data-tab-index]");
        const panels = tabs.querySelectorAll("[data-tab-panel]");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = btn.dataset.tabIndex;
                buttons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
                panels.forEach((p) => p.classList.remove("active"));
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                tabs.querySelector(`[data-tab-panel="${idx}"]`)?.classList.add("active");
            });
        });
    });
}

function initKalenderModules(root, site) {
    if (typeof renderKalender === "function" && root.querySelector("[data-mod-kalender]")) {
        window.KG_CONTENT = migrateSiteToLegacyContent(site);
        renderKalender();
    }
}

function migrateSiteToLegacyContent(site) {
    return {
        site: { name: site.global.siteName, brandPrefix: site.global.brandPrefix, brandHighlight: site.global.brandHighlight, footer: site.global.footer?.copyright || site.global.footer, nav: {} },
        kontakt: site.global.kontakt,
        team: site.global.team,
        gruppen: site.global.gruppen,
        news: site.global.news,
        kalender: site.global.kalender,
        speiseplan: site.global.speiseplan,
        images: site.global.images || {}
    };
}
