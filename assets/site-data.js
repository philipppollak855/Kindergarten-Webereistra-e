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
            tagline: "",
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
