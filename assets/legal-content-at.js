const LEGAL_PAGE_IDS = ["impressum", "datenschutz"];

function isLegacyLegalPage(page) {
    if (!page?.modules || page.modules.length !== 1) return false;
    const mod = page.modules[0];
    return mod.type === "text" && (mod.id === "impressum-text" || mod.id === "datenschutz-text");
}

function buildImpressumPage(site) {
    const k = site.global.kontakt || {};
    const name = site.global.siteName || "NÖ Landeskindergarten Ternitz - Webereistraße";
    return {
        id: "impressum",
        title: "Impressum",
        navLabel: "Impressum",
        inNav: false,
        path: "impressum.html",
        modules: [
            {
                id: "imp-intro",
                type: "text",
                props: {
                    title: "Impressum",
                    lead: "Informationspflicht gemäß § 5 E-Commerce-Gesetz (ECG), § 25 Mediengesetz (MedienG) und Offenlegung gemäß § 25 Abs. 5 MedienG",
                    body: "Diese Website dient der Information über unseren Kindergarten, über pädagogische Schwerpunkte, Termine und Kontaktmöglichkeiten für Eltern und Interessierte."
                }
            },
            {
                id: "imp-medieninhaber",
                type: "text",
                props: {
                    title: "Medieninhaber und Herausgeber",
                    lead: "",
                    body: `${name}\n\nTräger: Land Niederösterreich (Landeskindergarten)\n\n${k.address || "Webereistraße 2A, 2630 Ternitz, Österreich"}`
                }
            },
            {
                id: "imp-kontakt",
                type: "text",
                props: {
                    title: "Kontakt",
                    lead: "",
                    body: `Telefon: ${k.phoneDisplay || "+43 676 4143331"}\nE-Mail: ${k.email || "webereistrasse@lkg-ternitz.at"}\n\nVerantwortlich für den Inhalt dieser Website: Kindergartenleitung`
                }
            },
            {
                id: "imp-offenlegung",
                type: "text",
                props: {
                    title: "Offenlegung gemäß § 25 Abs. 5 Mediengesetz",
                    lead: "",
                    body: "Unternehmensgegenstand: Betrieb eines öffentlichen Kindergartens im Rahmen der NÖ Landeskindergärten.\n\nGrundlegende Richtung der Website: Information der Öffentlichkeit, insbesondere von Eltern und Erziehungsberechtigten, über Angebot, Team, Termine und Kontakt der Einrichtung."
                }
            },
            {
                id: "imp-haftung-inhalt",
                type: "text",
                props: {
                    title: "Haftung für Inhalte",
                    lead: "",
                    body: "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird jedoch keine Gewähr übernommen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 ECG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.\n\nVerpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen."
                }
            },
            {
                id: "imp-haftung-links",
                type: "text",
                props: {
                    title: "Haftung für Links",
                    lead: "",
                    body: "Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.\n\nBei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."
                }
            },
            {
                id: "imp-urheberrecht",
                type: "text",
                props: {
                    title: "Urheberrecht",
                    lead: "",
                    body: "Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem österreichischen Urheberrecht. Jede Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.\n\nDownloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet, sofern nicht anders gekennzeichnet."
                }
            },
            {
                id: "imp-avg",
                type: "hinweis",
                props: {
                    title: "Verwaltungsbeschwerde",
                    text: "Sofern Sie von einer Einrichtung des Landes Niederösterreich betroffen sind und eine verwaltungsrechtliche Entscheidung anfechten möchten, informieren wir über das Recht auf Beschwerde gemäß § 13 Allgemeines Verwaltungsverfahrensgesetz (AVG) an die zuständige Behörde bzw. an das Landesverwaltungsgericht. Für inhaltliche Anliegen zu dieser Website wenden Sie sich bitte zuerst an die oben genannte Kontaktadresse.",
                    icon: "⚖️",
                    variant: "info"
                }
            }
        ]
    };
}

function buildDatenschutzPage(site) {
    const k = site.global.kontakt || {};
    const name = site.global.siteName || "NÖ Landeskindergarten Ternitz - Webereistraße";
    const email = k.email || "webereistrasse@lkg-ternitz.at";
    return {
        id: "datenschutz",
        title: "Datenschutz",
        navLabel: "Datenschutz",
        inNav: false,
        path: "datenschutz.html",
        modules: [
            {
                id: "dsg-intro",
                type: "text",
                props: {
                    title: "Datenschutzerklärung",
                    lead: "Informationen zur Verarbeitung personenbezogener Daten gemäß Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG)",
                    body: `Stand: Juni 2026\n\nDer Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, DSG, TKG 2021).`
                }
            },
            {
                id: "dsg-verantwortlicher",
                type: "text",
                props: {
                    title: "1. Verantwortlicher",
                    lead: "",
                    body: `${name}\n${k.address || "Webereistraße 2A, 2630 Ternitz, Österreich"}\n\nTelefon: ${k.phoneDisplay || "+43 676 4143331"}\nE-Mail: ${email}\n\nVerantwortlich für die Datenverarbeitung im Rahmen dieser Website: Kindergartenleitung im Auftrag des Trägers Land Niederösterreich.`
                }
            },
            {
                id: "dsg-allgemein",
                type: "text",
                props: {
                    title: "2. Allgemeine Hinweise",
                    lead: "",
                    body: "Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Diese Erklärung informiert darüber, welche Daten wir auf dieser Website verarbeiten, zu welchem Zweck und auf welcher Rechtsgrundlage.\n\nRechtsgrundlagen können insbesondere sein:\n• Art. 6 Abs. 1 lit. a DSGVO – Einwilligung\n• Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung bzw. vorvertragliche Maßnahmen\n• Art. 6 Abs. 1 lit. c DSGVO – rechtliche Verpflichtung\n• Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse (z. B. sichere Bereitstellung der Website)"
                }
            },
            {
                id: "dsg-hosting",
                type: "text",
                props: {
                    title: "3. Bereitstellung der Website und Server-Logfiles",
                    lead: "",
                    body: "Beim Aufruf dieser Website werden durch den eingesetzten Hosting-Anbieter bzw. Webserver technisch notwendige Daten verarbeitet (z. B. IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, Browsertyp, Betriebssystem).\n\nDiese Verarbeitung erfolgt zur Gewährleistung eines sicheren und stabilen Betriebs der Website auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO. Die Logdaten werden gelöscht, sobald sie für den Zweck der Erhebung nicht mehr erforderlich sind."
                }
            },
            {
                id: "dsg-kontakt",
                type: "text",
                props: {
                    title: "4. Kontaktaufnahme",
                    lead: "",
                    body: `Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir die von Ihnen übermittelten Daten (z. B. Name, E-Mail-Adresse, Inhalt der Nachricht) zur Bearbeitung Ihres Anliegens.\n\nRechtsgrundlage ist je nach Anliegen Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche/vertragliche Kommunikation) oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.`
                }
            },
            {
                id: "dsg-cookies",
                type: "text",
                props: {
                    title: "5. Cookies und lokale Speicherung",
                    lead: "",
                    body: "Diese Website verwendet für Besucherinnen und Besucher im Regelfall keine Tracking-Cookies zu Marketingzwecken.\n\nTechnisch notwendige Speicherung: Beim Aufruf des internen Admin-Bereichs (Seiten-Builder) können Inhalte lokal im Browser (localStorage) gespeichert werden, um Bearbeitungen zu ermöglichen. Dies betrifft nicht reguläre Besucher der öffentlichen Website.\n\nSofern künftig einwilligungspflichtige Cookies oder Analyse-Tools eingesetzt werden, werden wir Sie vorab informieren und – soweit erforderlich – Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO einholen."
                }
            },
            {
                id: "dsg-extern",
                type: "text",
                props: {
                    title: "6. Externe Dienste (Schriftarten, Karten)",
                    lead: "",
                    body: "Zur einheitlichen Darstellung laden wir Schriftarten von Google Fonts (Google Ireland Limited bzw. Google LLC). Dabei kann Ihre IP-Adresse an Google übermittelt werden. Rechtsgrundlage ist unser berechtigtes Interesse an einer ansprechenden Darstellung gemäß Art. 6 Abs. 1 lit. f DSGVO.\n\nAuf unserer Kontaktseite kann ein Link zu Google Maps eingebunden sein. Beim Anklicken verlassen Sie unsere Website; es gelten die Datenschutzbestimmungen von Google. Wir empfehlen, die Datenschutzhinweise des jeweiligen Anbieters zu lesen."
                }
            },
            {
                id: "dsg-rechte",
                type: "text",
                props: {
                    title: "7. Ihre Rechte",
                    lead: "",
                    body: `Sie haben gegenüber uns insbesondere folgende Rechte bezüglich Ihrer personenbezogenen Daten:\n• Auskunft (Art. 15 DSGVO)\n• Berichtigung (Art. 16 DSGVO)\n• Löschung (Art. 17 DSGVO)\n• Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Datenübertragbarkeit (Art. 20 DSGVO)\n• Widerspruch gegen Verarbeitung (Art. 21 DSGVO)\n• Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO) mit Wirkung für die Zukunft\n\nZur Ausübung Ihrer Rechte wenden Sie sich bitte an: ${email}`
                }
            },
            {
                id: "dsg-beschwerde",
                type: "text",
                props: {
                    title: "8. Beschwerderecht bei der Aufsichtsbehörde",
                    lead: "",
                    body: "Sie haben das Recht, Beschwerde bei der zuständigen Datenschutz-Aufsichtsbehörde zu erheben:\n\nÖsterreichische Datenschutzbehörde\nBarichgasse 40–42\n1030 Wien\nTelefon: +43 1 52 152-0\nE-Mail: dsb@dsb.gv.at\nWebsite: https://www.dsb.gv.at"
                }
            },
            {
                id: "dsg-hinweis",
                type: "hinweis",
                props: {
                    title: "Hinweis",
                    text: "Diese Datenschutzerklärung ist eine Vorlage für den österreichischen Rechtsraum und sollte bei wesentlichen Änderungen der Website (z. B. Kontaktformulare, Newsletter, Tracking) an den tatsächlichen Betrieb angepasst werden. Bei rechtlichen Fragen wenden Sie sich an den Träger oder eine Rechtsberatung.",
                    icon: "ℹ️",
                    variant: "info"
                }
            }
        ]
    };
}

function ensureLegalPages(site) {
    if (!site?.global?.pages && !site?.pages) return;
    if (!site.pages) return;

    const impressumIdx = site.pages.findIndex((p) => p.id === "impressum");
    const datenschutzIdx = site.pages.findIndex((p) => p.id === "datenschutz");
    const impressumPage = buildImpressumPage(site);
    const datenschutzPage = buildDatenschutzPage(site);

    if (impressumIdx < 0) {
        site.pages.push(impressumPage);
    } else if (isLegacyLegalPage(site.pages[impressumIdx])) {
        site.pages[impressumIdx] = impressumPage;
    }

    if (datenschutzIdx < 0) {
        site.pages.push(datenschutzPage);
    } else if (isLegacyLegalPage(site.pages[datenschutzIdx])) {
        site.pages[datenschutzIdx] = datenschutzPage;
    }
}
