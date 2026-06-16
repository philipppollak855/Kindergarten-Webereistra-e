const PANELS = [
    { id: "allgemein", label: "Allgemein" },
    { id: "start", label: "Startseite" },
    { id: "paedagogik", label: "Pädagogik" },
    { id: "team", label: "Team" },
    { id: "gruppen", label: "Gruppen" },
    { id: "news", label: "News" },
    { id: "kalender", label: "Kalender" },
    { id: "bilder", label: "Bilder" },
    { id: "kontakt", label: "Kontakt" }
];

let content = structuredClone(loadContent());

function field(label, id, value = "", type = "text", hint = "") {
    const inputTag = type === "textarea"
        ? `<textarea id="${id}" name="${id}">${escapeHtml(value)}</textarea>`
        : `<input type="${type}" id="${id}" name="${id}" value="${escapeAttr(value)}">`;
    return `<div class="field"><label for="${id}">${label}</label>${inputTag}${hint ? `<p class="field-hint">${hint}</p>` : ""}</div>`;
}

function fieldCheckbox(label, id, checked) {
    return `<div class="field"><label><input type="checkbox" id="${id}" ${checked ? "checked" : ""}> ${label}</label></div>`;
}

function escapeHtml(text) { return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function escapeAttr(text) { return escapeHtml(text).replaceAll('"', "&quot;"); }

function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9äöüß]+/gi, "-").replace(/(^-|-$)/g, "");
}

function linesToImages(text) {
    return text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
        const [src, alt] = line.split("|");
        return { src: src.trim(), alt: (alt || "").trim() };
    });
}

function imagesToLines(images) {
    return (images || []).map((img) => img.alt ? `${img.src}|${img.alt}` : img.src).join("\n");
}

function linesToVideos(text) {
    return text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
        const [title, url] = line.split("|");
        return { title: (title || "Video").trim(), url: (url || title).trim() };
    });
}

function videosToLines(videos) {
    return (videos || []).map((v) => `${v.title}|${v.url}`).join("\n");
}

function fieldSelect(label, id, options, selected = "", hint = "") {
    const optionsHtml = options.map((o) => `<option value="${escapeAttr(o.value)}" ${o.value === selected ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("");
    return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${optionsHtml}</select>${hint ? `<p class="field-hint">${hint}</p>` : ""}</div>`;
}

function getGruppeOptions() {
    return [{ value: "", label: "— Keine Gruppe —" }, ...(content.gruppen?.items || []).map((g) => ({ value: g.name, label: g.name }))];
}

function renderNav() {
    const nav = document.getElementById("adminNav");
    nav.innerHTML = PANELS.map((p, i) => `<button type="button" data-panel="${p.id}" class="${i === 0 ? "active" : ""}">${p.label}</button>`).join("");
    nav.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
            collectFormData();
            nav.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            showPanel(btn.dataset.panel);
        });
    });
}

function showPanel(id) {
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === id));
}

function renderTeamList() {
    return (content.team?.members || []).map((m, i) => `
        <div class="list-item"><div class="list-item-header"><h3>Person ${i + 1}</h3><button type="button" class="btn-danger" data-remove-team="${i}">Entfernen</button></div>
        ${field("Name", `team-name-${i}`, m.name)}${field("Position", `team-position-${i}`, m.position)}
        ${fieldSelect("Gruppe", `team-gruppe-${i}`, getGruppeOptions(), m.gruppe || "")}
        ${field("Avatar", `team-avatar-${i}`, m.avatar)}${field("Vorstellung", `team-intro-${i}`, m.intro, "textarea")}</div>`).join("");
}

function renderGruppenList() {
    return (content.gruppen?.items || []).map((g, i) => `
        <div class="list-item"><div class="list-item-header"><h3>Gruppe ${i + 1}</h3><button type="button" class="btn-danger" data-remove-gruppe="${i}">Entfernen</button></div>
        ${field("Name", `gruppe-name-${i}`, g.name)}${field("Alter", `gruppe-age-${i}`, g.ageRange)}
        ${field("Kapazität", `gruppe-capacity-${i}`, g.capacity)}${field("Bild", `gruppe-image-${i}`, g.image)}
        ${field("Beschreibung", `gruppe-desc-${i}`, g.description, "textarea")}</div>`).join("");
}

function renderNewsList() {
    return (content.news?.items || []).map((n, i) => `
        <div class="list-item"><div class="list-item-header"><h3>News ${i + 1}</h3><button type="button" class="btn-danger" data-remove-news="${i}">Entfernen</button></div>
        ${field("ID (URL)", `news-id-${i}`, n.id, "text", "z. B. sommerfest — wird für news-artikel.html?id=... verwendet")}
        ${field("Datum", `news-date-${i}`, n.date)}${field("Titel", `news-title-${i}`, n.title)}
        ${field("Titelbild", `news-image-${i}`, n.image)}${field("Kurztext", `news-teaser-${i}`, n.teaser, "textarea")}
        ${field("Ausführlicher Text", `news-body-${i}`, n.body || "", "textarea", "Absätze mit Leerzeile trennen")}
        ${field("Karussell-Bilder", `news-images-${i}`, imagesToLines(n.images), "textarea", "Ein Bild pro Zeile: pfad.jpg|Alt-Text")}
        ${field("Videos", `news-videos-${i}`, videosToLines(n.videos), "textarea", "Pro Zeile: Titel|Embed-URL (YouTube/Vimeo)")}</div>`).join("");
}

function renderKalenderList() {
    return (content.kalender?.events || []).map((e, i) => `
        <div class="list-item"><div class="list-item-header"><h3>Termin ${i + 1}</h3><button type="button" class="btn-danger" data-remove-event="${i}">Entfernen</button></div>
        ${field("ID", `event-id-${i}`, e.id)}${field("Datum", `event-date-${i}`, e.date, "text", "YYYY-MM-DD")}
        ${field("Uhrzeit", `event-time-${i}`, e.time || "")}${field("Kategorie", `event-category-${i}`, e.category || "")}
        ${field("Titel", `event-title-${i}`, e.title)}
        ${field("Kurzbeschreibung", `event-desc-${i}`, e.description || "", "textarea")}
        ${field("Titelbild", `event-image-${i}`, e.image || "")}
        ${field("Ausführlicher Text", `event-body-${i}`, e.body || "", "textarea", "Absätze mit Leerzeile trennen")}
        ${field("Weitere Bilder (Karussell)", `event-images-${i}`, imagesToLines(e.images), "textarea", "Ein Bild pro Zeile: pfad.jpg|Alt-Text")}</div>`).join("");
}

function renderPaedagogikPrinciples() {
    const items = content.paedagogik?.principles || [];
    return items.map((p, i) => `
        ${field(`Grundsatz ${i + 1} Titel`, `paed-principle-title-${i}`, p.title)}
        ${field(`Grundsatz ${i + 1} Text`, `paed-principle-text-${i}`, p.text, "textarea")}
        ${field(`Grundsatz ${i + 1} Bild`, `paed-principle-image-${i}`, p.image || "")}
    `).join("");
}

function renderPaedagogikBereiche() {
    return (content.paedagogik?.bildungsbereiche || []).map((b, i) => `
        ${field(`Bereich ${i + 1} Titel`, `paed-bereich-title-${i}`, b.title)}
        ${field(`Bereich ${i + 1} Text`, `paed-bereich-text-${i}`, b.text, "textarea")}
    `).join("");
}

function renderPaedagogikAblauf() {
    return (content.paedagogik?.tagesablauf || []).map((a, i) => `
        <div class="list-item"><div class="list-item-header"><h3>Zeitblock ${i + 1}</h3><button type="button" class="btn-danger" data-remove-ablauf="${i}">Entfernen</button></div>
        ${field("Uhrzeit", `ablauf-time-${i}`, a.time)}${field("Titel", `ablauf-title-${i}`, a.title)}
        ${field("Beschreibung", `ablauf-text-${i}`, a.text, "textarea")}</div>`).join("");
}

function renderPaedagogikSections() {
    return (content.paedagogik?.sections || []).map((s, i) => `
        <div class="list-item"><div class="list-item-header"><h3>Abschnitt ${i + 1}</h3><button type="button" class="btn-danger" data-remove-paed-section="${i}">Entfernen</button></div>
        ${field("Titel", `paed-section-title-${i}`, s.title)}${field("Bild", `paed-section-image-${i}`, s.image || "")}
        ${field("Text", `paed-section-text-${i}`, s.text, "textarea")}</div>`).join("");
}

function renderPanels() {
    const ss = content.index?.slideshow || { images: [], autoPlay: true, intervalMs: 4500 };
    document.getElementById("adminPanels").innerHTML = `
        <section class="admin-panel active" data-panel="allgemein"><h2>Allgemein</h2>
            ${field("Einrichtungsname", "site-name", content.site.name)}${field("Footer", "site-footer", content.site.footer)}</section>

        <section class="admin-panel" data-panel="start"><h2>Startseite</h2>
            ${field("Badge", "index-badge", content.index.badge)}${field("Überschrift", "index-h1", content.index.h1, "textarea")}
            ${field("Einleitung", "index-intro", content.index.intro, "textarea")}
            ${field("Button 1", "index-cta-primary", content.index.ctaPrimary)}${field("Button 2", "index-cta-secondary", content.index.ctaSecondary)}
            ${field("Abschnittstitel", "index-section-title", content.index.sectionTitle)}
            <h3 style="margin:16px 0 8px">Karten „Was uns besonders macht"</h3>
            ${(content.index.cards || []).map((c, i) => `
                ${field(`Karte ${i+1} Titel`, `index-card-title-${i}`, c.title)}
                ${field(`Karte ${i+1} Text`, `index-card-text-${i}`, c.text, "textarea")}
                ${field(`Karte ${i+1} Bild`, `index-card-image-${i}`, c.image || "")}`).join("")}
            <h3 style="margin:24px 0 8px">Slideshow</h3>
            ${field("Slideshow-Titel", "ss-title", ss.title || "")}
            ${fieldCheckbox("Automatisch weiterschalten", "ss-autoplay", ss.autoPlay !== false)}
            ${field("Wechsel-Intervall (ms)", "ss-interval", ss.intervalMs || 4500, "number")}
            ${field("Bilder", "ss-images", imagesToLines(ss.images), "textarea", "Ein Bild pro Zeile: pfad.jpg|Alt-Text")}</section>

        <section class="admin-panel" data-panel="paedagogik"><h2>Pädagogik</h2>
            ${field("Seitentitel", "paed-h1", content.paedagogik.h1)}${field("Einleitung", "paed-intro", content.paedagogik.intro, "textarea")}
            <h3>Leitbild</h3>
            ${field("Leitbild Titel", "paed-leitbild-title", content.paedagogik.leitbild?.title || "")}
            ${field("Leitbild Text", "paed-leitbild-text", content.paedagogik.leitbild?.text || "", "textarea")}
            ${field("Leitbild Bild", "paed-leitbild-image", content.paedagogik.leitbild?.image || "")}
            <h3 style="margin-top:16px">Grundsätze</h3>${renderPaedagogikPrinciples()}
            <h3 style="margin-top:16px">Bildungsbereiche</h3>${renderPaedagogikBereiche()}
            <h3 style="margin-top:16px">Tagesablauf</h3><div id="ablaufList">${renderPaedagogikAblauf()}</div>
            <button type="button" class="btn-add" id="addAblaufBtn">+ Zeitblock</button>
            ${field("Fokus Titel", "paed-focus-title", content.paedagogik.focusTitle)}
            ${field("Fokus Text", "paed-focus-text", content.paedagogik.focusText, "textarea")}
            <h3 style="margin-top:16px">Weitere Abschnitte</h3><div id="paedSectionList">${renderPaedagogikSections()}</div>
            <button type="button" class="btn-add" id="addPaedSectionBtn">+ Abschnitt</button></section>

        <section class="admin-panel" data-panel="team"><h2>Team</h2>
            ${field("Titel", "team-h1", content.team.h1)}${field("Einleitung", "team-intro", content.team.intro, "textarea")}
            <div id="teamList">${renderTeamList()}</div><button type="button" class="btn-add" id="addTeamBtn">+ Person</button></section>

        <section class="admin-panel" data-panel="gruppen"><h2>Gruppen</h2>
            ${field("Titel", "gruppen-h1", content.gruppen.h1)}${field("Einleitung", "gruppen-intro", content.gruppen.intro, "textarea")}
            ${field("Team-Label", "gruppen-team-label", content.gruppen.teamLabel)}
            <div id="gruppenList">${renderGruppenList()}</div><button type="button" class="btn-add" id="addGruppeBtn">+ Gruppe</button></section>

        <section class="admin-panel" data-panel="news"><h2>News</h2>
            ${field("Titel", "news-h1", content.news.h1)}${field("Einleitung", "news-intro", content.news.intro, "textarea")}
            <div id="newsList">${renderNewsList()}</div><button type="button" class="btn-add" id="addNewsBtn">+ News</button></section>

        <section class="admin-panel" data-panel="kalender"><h2>Kalender</h2>
            ${field("Titel", "kalender-h1", content.kalender?.h1 || "")}${field("Einleitung", "kalender-intro", content.kalender?.intro || "", "textarea")}
            <div id="kalenderList">${renderKalenderList()}</div><button type="button" class="btn-add" id="addEventBtn">+ Termin</button></section>

        <section class="admin-panel" data-panel="bilder"><h2>Bilder</h2>
            ${field("Hero", "img-hero-src", content.images.hero.src)}${field("Hero Alt", "img-hero-alt", content.images.hero.alt)}
            ${field("Pädagogik Fokus", "img-paedagogik-src", content.images.paedagogikFocus.src)}
            ${field("Räume Fokus", "img-raeume-src", content.images.raeumeFocus.src)}
            ${[1,2,3,4,5].map(n => field(`Galerie ${n}`, `img-g${n}-src`, content.images[`galerie${n}`].src)).join("")}</section>

        <section class="admin-panel" data-panel="kontakt"><h2>Kontakt</h2>
            ${field("Adresse", "kontakt-address", content.kontakt.address)}
            ${field("Telefon", "kontakt-phone-display", content.kontakt.phoneDisplay)}
            ${field("Telefon Link", "kontakt-phone-link", content.kontakt.phoneLink)}
            ${field("E-Mail", "kontakt-email", content.kontakt.email)}
            ${field("Karten-URL", "kontakt-maps-url", content.kontakt.mapsUrl)}
            ${field("Seitentitel", "kontakt-h1", content.kontaktPage.h1)}
            ${field("Einleitung", "kontakt-intro", content.kontaktPage.intro, "textarea")}</section>`;
    bindListActions();
}

function valueOf(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }
function checkedOf(id) { const el = document.getElementById(id); return el ? el.checked : false; }

function collectFormData() {
    content.site.name = valueOf("site-name");
    content.site.footer = valueOf("site-footer");

    content.index.badge = valueOf("index-badge");
    content.index.h1 = valueOf("index-h1");
    content.index.intro = valueOf("index-intro");
    content.index.ctaPrimary = valueOf("index-cta-primary");
    content.index.ctaSecondary = valueOf("index-cta-secondary");
    content.index.sectionTitle = valueOf("index-section-title");
    (content.index.cards || []).forEach((c, i) => {
        c.title = valueOf(`index-card-title-${i}`);
        c.text = valueOf(`index-card-text-${i}`);
        c.image = valueOf(`index-card-image-${i}`);
    });
    content.index.slideshow = {
        title: valueOf("ss-title"),
        autoPlay: checkedOf("ss-autoplay"),
        intervalMs: Number(valueOf("ss-interval")) || 4500,
        images: linesToImages(valueOf("ss-images"))
    };

    content.paedagogik.h1 = valueOf("paed-h1");
    content.paedagogik.intro = valueOf("paed-intro");
    content.paedagogik.leitbild = {
        title: valueOf("paed-leitbild-title"),
        text: valueOf("paed-leitbild-text"),
        image: valueOf("paed-leitbild-image")
    };
    (content.paedagogik.principles || []).forEach((p, i) => {
        p.title = valueOf(`paed-principle-title-${i}`);
        p.text = valueOf(`paed-principle-text-${i}`);
        p.image = valueOf(`paed-principle-image-${i}`);
    });
    (content.paedagogik.bildungsbereiche || []).forEach((b, i) => {
        b.title = valueOf(`paed-bereich-title-${i}`);
        b.text = valueOf(`paed-bereich-text-${i}`);
    });
    content.paedagogik.tagesablauf = (content.paedagogik.tagesablauf || []).map((a, i) => ({
        time: valueOf(`ablauf-time-${i}`),
        title: valueOf(`ablauf-title-${i}`),
        text: valueOf(`ablauf-text-${i}`)
    }));
    content.paedagogik.focusTitle = valueOf("paed-focus-title");
    content.paedagogik.focusText = valueOf("paed-focus-text");
    content.paedagogik.sections = (content.paedagogik.sections || []).map((s, i) => ({
        title: valueOf(`paed-section-title-${i}`),
        text: valueOf(`paed-section-text-${i}`),
        image: valueOf(`paed-section-image-${i}`)
    }));

    content.team.h1 = valueOf("team-h1");
    content.team.intro = valueOf("team-intro");
    content.team.members = (content.team.members || []).map((m, i) => ({
        name: valueOf(`team-name-${i}`),
        position: valueOf(`team-position-${i}`),
        gruppe: valueOf(`team-gruppe-${i}`),
        avatar: valueOf(`team-avatar-${i}`) || "images/avatars/placeholder.svg",
        intro: valueOf(`team-intro-${i}`)
    }));

    content.gruppen.h1 = valueOf("gruppen-h1");
    content.gruppen.intro = valueOf("gruppen-intro");
    content.gruppen.teamLabel = valueOf("gruppen-team-label");
    content.gruppen.items = (content.gruppen.items || []).map((g, i) => ({
        name: valueOf(`gruppe-name-${i}`),
        ageRange: valueOf(`gruppe-age-${i}`),
        capacity: valueOf(`gruppe-capacity-${i}`),
        image: valueOf(`gruppe-image-${i}`),
        description: valueOf(`gruppe-desc-${i}`)
    }));

    content.news.h1 = valueOf("news-h1");
    content.news.intro = valueOf("news-intro");
    content.news.items = (content.news.items || []).map((n, i) => {
        const title = valueOf(`news-title-${i}`);
        let id = valueOf(`news-id-${i}`) || slugify(title);
        return {
            id,
            date: valueOf(`news-date-${i}`),
            title,
            image: valueOf(`news-image-${i}`),
            teaser: valueOf(`news-teaser-${i}`),
            body: valueOf(`news-body-${i}`),
            images: linesToImages(valueOf(`news-images-${i}`)),
            videos: linesToVideos(valueOf(`news-videos-${i}`))
        };
    });

    if (!content.kalender) content.kalender = { events: [] };
    content.kalender.h1 = valueOf("kalender-h1");
    content.kalender.intro = valueOf("kalender-intro");
    content.kalender.events = (content.kalender.events || []).map((e, i) => ({
        id: valueOf(`event-id-${i}`) || slugify(valueOf(`event-title-${i}`)),
        date: valueOf(`event-date-${i}`),
        time: valueOf(`event-time-${i}`),
        category: valueOf(`event-category-${i}`),
        title: valueOf(`event-title-${i}`),
        description: valueOf(`event-desc-${i}`),
        image: valueOf(`event-image-${i}`),
        body: valueOf(`event-body-${i}`),
        images: linesToImages(valueOf(`event-images-${i}`))
    }));

    content.images.hero.src = valueOf("img-hero-src");
    content.images.hero.alt = valueOf("img-hero-alt");
    content.images.paedagogikFocus.src = valueOf("img-paedagogik-src");
    content.images.raeumeFocus.src = valueOf("img-raeume-src");
    [1,2,3,4,5].forEach(n => { content.images[`galerie${n}`].src = valueOf(`img-g${n}-src`); });

    content.kontakt.address = valueOf("kontakt-address");
    content.kontakt.phoneDisplay = valueOf("kontakt-phone-display");
    content.kontakt.phoneLink = valueOf("kontakt-phone-link");
    content.kontakt.email = valueOf("kontakt-email");
    content.kontakt.emailLink = `mailto:${content.kontakt.email}`;
    content.kontakt.mapsUrl = valueOf("kontakt-maps-url");
    content.kontaktPage.h1 = valueOf("kontakt-h1");
    content.kontaktPage.intro = valueOf("kontakt-intro");
}

function bindListActions() {
    document.getElementById("addTeamBtn")?.addEventListener("click", () => {
        collectFormData();
        content.team.members.push({ avatar: "images/avatars/placeholder.svg", name: "Neue Person", position: "", gruppe: "", intro: "" });
        renderPanels(); showPanel("team");
    });
    document.getElementById("addGruppeBtn")?.addEventListener("click", () => {
        collectFormData();
        content.gruppen.items.push({ name: "Neue Gruppe", ageRange: "", capacity: "", description: "", image: "" });
        renderPanels(); showPanel("gruppen");
    });
    document.getElementById("addNewsBtn")?.addEventListener("click", () => {
        collectFormData();
        content.news.items.unshift({
            id: `news-${Date.now()}`,
            date: new Date().toLocaleDateString("de-AT"),
            title: "Neue Meldung",
            teaser: "",
            image: "",
            body: "",
            images: [],
            videos: []
        });
        renderPanels(); showPanel("news");
    });
    document.getElementById("addEventBtn")?.addEventListener("click", () => {
        collectFormData();
        if (!content.kalender) content.kalender = { events: [] };
        content.kalender.events.push({ id: `event-${Date.now()}`, date: "", time: "", title: "Neuer Termin", description: "", category: "", image: "", body: "", images: [] });
        renderPanels(); showPanel("kalender");
    });
    document.getElementById("addAblaufBtn")?.addEventListener("click", () => {
        collectFormData();
        content.paedagogik.tagesablauf.push({ time: "", title: "", text: "" });
        renderPanels(); showPanel("paedagogik");
    });
    document.getElementById("addPaedSectionBtn")?.addEventListener("click", () => {
        collectFormData();
        content.paedagogik.sections.push({ title: "", text: "", image: "" });
        renderPanels(); showPanel("paedagogik");
    });

    document.querySelectorAll("[data-remove-team]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.team.members.splice(Number(b.dataset.removeTeam), 1); renderPanels(); showPanel("team"); }));
    document.querySelectorAll("[data-remove-gruppe]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.gruppen.items.splice(Number(b.dataset.removeGruppe), 1); renderPanels(); showPanel("gruppen"); }));
    document.querySelectorAll("[data-remove-news]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.news.items.splice(Number(b.dataset.removeNews), 1); renderPanels(); showPanel("news"); }));
    document.querySelectorAll("[data-remove-event]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.kalender.events.splice(Number(b.dataset.removeEvent), 1); renderPanels(); showPanel("kalender"); }));
    document.querySelectorAll("[data-remove-ablauf]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.paedagogik.tagesablauf.splice(Number(b.dataset.removeAblauf), 1); renderPanels(); showPanel("paedagogik"); }));
    document.querySelectorAll("[data-remove-paed-section]").forEach((b) => b.addEventListener("click", () => { collectFormData(); content.paedagogik.sections.splice(Number(b.dataset.removePaedSection), 1); renderPanels(); showPanel("paedagogik"); }));
}

function showStatus(msg) {
    const s = document.getElementById("statusMsg");
    s.textContent = msg;
    s.classList.add("visible");
    setTimeout(() => s.classList.remove("visible"), 3500);
}

document.getElementById("saveBtn").addEventListener("click", () => { collectFormData(); saveContent(content); showStatus("Gespeichert – Website in neuem Tab prüfen."); });
document.getElementById("exportBtn").addEventListener("click", () => { collectFormData(); saveContent(content); exportContentJs(content); showStatus("content.js exportiert – nach assets/content.js kopieren."); });
document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Vorschau-Daten zurücksetzen?")) return;
    clearContentOverride();
    content = structuredClone(window.KG_CONTENT);
    renderPanels();
    showStatus("Zurückgesetzt.");
});

renderNav();
renderPanels();
