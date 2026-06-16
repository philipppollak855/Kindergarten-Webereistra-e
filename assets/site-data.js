window.KG_SITE = {
    version: 1,
    global: {
        siteName: "NÖ Landeskindergarten Ternitz - Webereistraße",
        brandPrefix: "NÖ Landeskindergarten",
        brandHighlight: "Webereistraße",
        header: {
            brandLink: "index.html",
            logo: "",
            logoAlt: "",
            showNavigation: true,
            sticky: true,
            ctaLabel: "",
            ctaLink: "",
            ctaStyle: "soft"
        },
        footer: {
            copyright: "© 2026 NÖ Landeskindergarten Ternitz - Webereistraße",
            tagline: "Landeskindergarten des Landes Niederösterreich",
            legalNote: "Impressum und Datenschutz gemäß österreichischem Recht (ECG, MedienG, DSGVO, DSG).",
            links: [
                { id: "impressum", label: "Impressum", href: "impressum.html", enabled: true },
                { id: "datenschutz", label: "Datenschutz", href: "datenschutz.html", enabled: true },
                { id: "kontakt", label: "Kontakt", href: "kontakt.html", enabled: true }
            ],
            showAdminLink: true,
            adminLinkLabel: "Inhalte pflegen"
        },
        kontakt: {
            address: "Webereistraße 2A, 2630 Ternitz, AUT",
            mapsUrl: "https://maps.google.com/?q=Webereistra%C3%9Fe+2A,+2630+Ternitz,+AUT",
            mapsLabel: "Auf Karte ansehen",
            phoneDisplay: "+43 676 4143331",
            phoneLink: "tel:+436764143331",
            email: "webereistrasse@lkg-ternitz.at",
            emailLink: "mailto:webereistrasse@lkg-ternitz.at"
        },
        team: {
            members: [
                { avatar: "images/avatars/placeholder.svg", name: "Maria Huber", position: "Leitung", gruppe: "", intro: "Leitung des Kindergartens." },
                { avatar: "images/avatars/placeholder.svg", name: "Anna Berger", position: "Pädagogin", gruppe: "Gruppe Sonne", intro: "Kreative Projekte." },
                { avatar: "images/avatars/placeholder.svg", name: "Thomas Klein", position: "Pädagoge", gruppe: "Gruppe Mond", intro: "Bewegung und Natur." },
                { avatar: "images/avatars/placeholder.svg", name: "Lisa Wagner", position: "Pädagogin", gruppe: "Gruppe Stern", intro: "Schulvorbereitung." }
            ]
        },
        gruppen: {
            teamLabel: "Unser Team in dieser Gruppe",
            items: [
                { name: "Gruppe Sonne", ageRange: "3–4 Jahre", capacity: "bis 20 Kinder", description: "Lebendiger Einstieg.", image: "images/gruppenraum-hell.png" },
                { name: "Gruppe Mond", ageRange: "4–5 Jahre", capacity: "bis 22 Kinder", description: "Kreative Projekte.", image: "images/atelier-pastell.png" },
                { name: "Gruppe Stern", ageRange: "5–6 Jahre", capacity: "bis 24 Kinder", description: "Schulvorbereitung.", image: "images/spielraum-pastell.png" }
            ]
        },
        news: {
            items: [
                { id: "willkommen-website", date: "16.06.2026", title: "Willkommen auf unserer Website", teaser: "Unser Kindergarten online.", image: "images/aussen-spielplatz.png", body: "Willkommen!\n\nHier finden Sie News und Termine.", images: [{ src: "images/aussen-spielplatz.png", alt: "Spielplatz" }], videos: [], publishAt: "", showOnHomepage: true },
                { id: "sommerfest", date: "10.06.2026", title: "Sommerfest", teaser: "Fest im Garten.", image: "images/gebaeude-garten.png", body: "Sommerfest im Garten.", images: [], videos: [], publishAt: "", showOnHomepage: false }
            ]
        },
        kalender: {
            events: [
                { id: "sommerfest-2026", date: "2026-06-28", time: "14:00", title: "Sommerfest", description: "Fest im Garten.", category: "Fest", image: "images/gebaeude-garten.png", body: "Gemeinsames Sommerfest.", images: [{ src: "images/gebaeude-garten.png", alt: "Garten" }], publishAt: "", showOnHomepage: true },
                { id: "elternabend-juni", date: "2026-06-20", time: "18:30", title: "Elternabend", description: "Informationsabend.", category: "Eltern", image: "", body: "", images: [], publishAt: "2026-06-15T08:00:00.000Z", showOnHomepage: true }
            ]
        },
        speiseplan: {
            plans: [
                {
                    id: "speiseplan-kw25",
                    title: "Speiseplan KW 25",
                    startDate: "2026-06-15",
                    durationDays: 7,
                    publishAt: "",
                    days: [
                        { date: "2026-06-15", breakfast: "Vollkornbrot, Butter, Marmelade", snack: "Apfel", lunch: "Gemüsesuppe mit Nudeln", note: "" },
                        { date: "2026-06-16", breakfast: "Müsli mit Joghurt", snack: "Banane", lunch: "Reis mit Tomatensoße", note: "" },
                        { date: "2026-06-17", breakfast: "Brötchen, Käse", snack: "Karottensticks", lunch: "Kartoffel-Gemüse-Pfanne", note: "" },
                        { date: "2026-06-18", breakfast: "Brot, Honig", snack: "Trauben", lunch: "Linsensuppe mit Brot", note: "" },
                        { date: "2026-06-19", breakfast: "Porridge", snack: "Birne", lunch: "Nudeln mit Brokkoli", note: "" },
                        { date: "2026-06-20", breakfast: "Butterbrot, Aufstrich", snack: "Obstmix", lunch: "Erdäpfelsuppe", note: "Freitag" },
                        { date: "2026-06-21", breakfast: "—", snack: "—", lunch: "—", note: "Wochenende – kein Kindergarten" }
                    ]
                },
                {
                    id: "speiseplan-juli-1",
                    title: "Speiseplan Juli (1. Hälfte)",
                    startDate: "2026-06-29",
                    durationDays: 14,
                    publishAt: "2026-06-22T08:00:00.000Z",
                    days: [
                        { date: "2026-06-29", breakfast: "Brot, Butter", snack: "Apfel", lunch: "Nudelsuppe", note: "" },
                        { date: "2026-06-30", breakfast: "Müsli", snack: "Banane", lunch: "Reis mit Gemüse", note: "" },
                        { date: "2026-07-01", breakfast: "Brötchen", snack: "Karotten", lunch: "Kartoffeln mit Soße", note: "" },
                        { date: "2026-07-02", breakfast: "Porridge", snack: "Birne", lunch: "Linseneintopf", note: "" },
                        { date: "2026-07-03", breakfast: "Brot, Käse", snack: "Obst", lunch: "Gemüsepfanne", note: "" },
                        { date: "2026-07-04", breakfast: "—", snack: "—", lunch: "—", note: "Wochenende" },
                        { date: "2026-07-05", breakfast: "—", snack: "—", lunch: "—", note: "Wochenende" },
                        { date: "2026-07-06", breakfast: "Müsli", snack: "Apfel", lunch: "Tomatensuppe", note: "" },
                        { date: "2026-07-07", breakfast: "Brot", snack: "Banane", lunch: "Nudeln mit Sauce", note: "" },
                        { date: "2026-07-08", breakfast: "Brötchen", snack: "Trauben", lunch: "Reis mit Erbsen", note: "" },
                        { date: "2026-07-09", breakfast: "Porridge", snack: "Karotten", lunch: "Kartoffelsuppe", note: "" },
                        { date: "2026-07-10", breakfast: "Butterbrot", snack: "Obst", lunch: "Gemüse-Reis-Pfanne", note: "" },
                        { date: "2026-07-11", breakfast: "—", snack: "—", lunch: "—", note: "Wochenende" },
                        { date: "2026-07-12", breakfast: "—", snack: "—", lunch: "—", note: "Wochenende" }
                    ]
                }
            ]
        },
        theme: {
            presetId: "holz-pastell",
            custom: {},
            fontFamily: "",
            borderRadius: "",
            showClouds: null
        },
        media: {
            folders: [{ id: "media-root", name: "Medien", parentId: null }],
            items: []
        }
    },
    pages: [
        {
            id: "home",
            title: "Startseite",
            navLabel: "Start",
            inNav: true,
            path: "index.html",
            modules: [
                { id: "home-hero", type: "hero", props: { badge: "Willkommen in Ternitz-Pottschach", h1: "Ein moderner Kindergarten\nmit Herz, Holz und Licht.", intro: "Der NÖ Landeskindergarten Ternitz - Webereistraße ist ein heller Ort für Kinder.", image: "images/aussen-spielplatz.png", ctaPrimary: "Kontakt aufnehmen", ctaPrimaryLink: "kontakt.html", ctaSecondary: "Bilder ansehen", ctaSecondaryLink: "raeume.html" } },
                { id: "home-aktuell", type: "aktuell", props: { title: "Aktuelles", intro: "News und Termine", maxItems: 5 } },
                { id: "home-cards", type: "cards", props: { title: "Was uns besonders macht", items: [
                    { title: "Helle Räume", text: "Viel Tageslicht.", image: "images/gruppenraum-hell.png" },
                    { title: "Holzbau", text: "Natürliche Materialien.", image: "images/innen-rutsche.png" },
                    { title: "Bewegung", text: "Aktiver Alltag.", image: "images/spielraum-pastell.png" }
                ] } },
                { id: "home-slideshow", type: "slideshow", props: { title: "Eindrücke", autoPlay: true, intervalMs: 4500, images: [
                    { src: "images/aussen-spielplatz.png", alt: "Spielplatz" },
                    { src: "images/gebaeude-garten.png", alt: "Garten" }
                ] } }
            ]
        },
        {
            id: "paedagogik",
            title: "Pädagogik",
            navLabel: "Pädagogik",
            inNav: true,
            path: "paedagogik.html",
            modules: [
                { id: "paed-intro", type: "text", props: { title: "Pädagogik mit Struktur und Herz", lead: "Ganzheitliche Begleitung.", body: "" } },
                { id: "paed-leitbild", type: "split", props: { title: "Unser Leitbild", text: "Jedes Kind ist einzigartig.", image: "images/gruppenraum-hell.png", reverse: false } },
                { id: "paed-principles", type: "cards", props: { title: "Grundsätze", items: [
                    { title: "Beziehung", text: "Vertrauen und Sicherheit.", image: "images/atelier-pastell.png" },
                    { title: "Selbstständigkeit", text: "Eigene Wege gehen.", image: "images/spielraum-pastell.png" }
                ] } },
                { id: "paed-ablauf", type: "ablauf", props: { title: "Tagesablauf", items: [
                    { time: "07:00", title: "Ankommen", text: "Freispiel" },
                    { time: "09:00", title: "Morgenkreis", text: "Gemeinschaft" }
                ] } },
                { id: "paed-section", type: "section", props: { title: "Erweiterbarer Bereich", background: "mint" }, children: [
                    { id: "paed-nested-text", type: "text", props: { title: "Partizipation", lead: "", body: "Kinder gestalten den Alltag mit." } },
                    { id: "paed-nested-cta", type: "cta", props: { title: "Fragen?", text: "Wir beraten Sie gerne.", buttonLabel: "Kontakt", buttonLink: "kontakt.html" } }
                ] }
            ]
        },
        { id: "raeume", title: "Räume", navLabel: "Räume", inNav: true, path: "raeume.html", modules: [
            { id: "raeume-split", type: "split", props: { title: "Architektur", text: "Moderne Räume.", image: "images/innen-rutsche.png", reverse: false } },
            { id: "raeume-gallery", type: "gallery", props: { title: "Galerie", images: [
                { src: "images/gruppenraum-hell.png", alt: "Gruppenraum", caption: "Gruppenraum" },
                { src: "images/atelier-pastell.png", alt: "Atelier", caption: "Atelier" }
            ] } }
        ] },
        { id: "team", title: "Team", navLabel: "Team", inNav: true, path: "team.html", modules: [
            { id: "team-mod", type: "team", props: { title: "Unser Team", intro: "Liebevolle Begleitung." } }
        ] },
        { id: "gruppen", title: "Gruppen", navLabel: "Gruppen", inNav: true, path: "gruppen.html", modules: [
            { id: "gruppen-mod", type: "gruppen", props: { title: "Unsere Gruppen", intro: "" } }
        ] },
        { id: "news", title: "News", navLabel: "News", inNav: true, path: "news.html", modules: [
            { id: "news-mod", type: "news", props: { title: "Aktuelles", intro: "" } }
        ] },
        { id: "kalender", title: "Kalender", navLabel: "Kalender", inNav: true, path: "kalender.html", modules: [
            { id: "kal-mod", type: "kalender", props: { title: "Termine", intro: "", showGrid: true, showList: true } }
        ] },
        { id: "speiseplan", title: "Speiseplan", navLabel: "Speiseplan", inNav: true, path: "speiseplan.html", modules: [
            { id: "sp-mod", type: "speiseplan", props: { title: "Unser Speiseplan", intro: "Aktuelle Mahlzeiten im Überblick – wahlweise als Woche oder 14 Tage.", defaultView: "week", allowViewSwitch: true } }
        ] },
        { id: "kontakt", title: "Kontakt", navLabel: "Kontakt", inNav: true, path: "kontakt.html", modules: [
            { id: "kontakt-mod", type: "kontakt", props: { title: "Kontakt", intro: "" } }
        ] },
        { id: "impressum", title: "Impressum", navLabel: "Impressum", inNav: false, path: "impressum.html", modules: [
            { id: "impressum-text", type: "text", props: {
                title: "Impressum",
                lead: "Angaben gemäß § 5 E-Commerce-Gesetz und § 25 Mediengesetz",
                body: "NÖ Landeskindergarten Ternitz - Webereistraße\nWebereistraße 2A\n2630 Ternitz\nÖsterreich\n\nTelefon: +43 676 4143331\nE-Mail: webereistrasse@lkg-ternitz.at\n\nTräger: Land Niederösterreich\n\nVerantwortlich für den Inhalt: Kindergartenleitung"
            } }
        ] },
        { id: "datenschutz", title: "Datenschutz", navLabel: "Datenschutz", inNav: false, path: "datenschutz.html", modules: [
            { id: "datenschutz-text", type: "text", props: {
                title: "Datenschutzerklärung",
                lead: "Informationen zur Verarbeitung personenbezogener Daten",
                body: "Der Schutz Ihrer persönlichen Daten ist uns wichtig. Personenbezogene Daten werden auf dieser Website nur im technisch notwendigen Umfang erhoben.\n\nKontaktaufnahme\nWenn Sie uns per E-Mail oder Telefon kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert.\n\nCookies\nDiese Website verwendet ggf. technisch notwendige Cookies.\n\nIhre Rechte\nSie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Wenden Sie sich dazu an webereistrasse@lkg-ternitz.at."
            } }
        ] }
    ]
};
