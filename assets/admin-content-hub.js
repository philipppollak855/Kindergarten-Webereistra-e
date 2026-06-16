let hubSubTab = "news";
let hubSelectedNews = 0;
let hubSelectedEvent = 0;
let hubCalYear = new Date().getFullYear();
let hubCalMonth = new Date().getMonth();
let hubCalSelectedDate = "";

function hubField(label, id, value = "", type = "text") {
    if (type === "text" && /bild|titelbild/i.test(label) && typeof renderMediaFieldInput === "function") {
        return `<div class="props-field"><label for="${id}">${label}</label>${renderMediaFieldInput(id, value, label)}</div>`;
    }
    const input = type === "textarea"
        ? `<textarea id="${id}">${escapeHtml(value ?? "")}</textarea>`
        : type === "checkbox"
        ? `<label><input type="checkbox" id="${id}" ${value ? "checked" : ""}> ${label}</label>`
        : type === "datetime-local"
        ? `<input type="datetime-local" id="${id}" value="${escapeAttr(formatPublishAtInput({ publishAt: value }) || value || "")}">`
        : `<input type="${type}" id="${id}" value="${escapeAttr(value ?? "")}">`;
    if (type === "checkbox") return `<div class="props-field">${input}</div>`;
    return `<div class="props-field"><label for="${id}">${label}</label>${input}</div>`;
}

function hubBadge(item) {
    const status = publishStatus(item);
    const cls = status === "scheduled" ? "scheduled" : "live";
    let text = publishStatusLabel(item);
    if (item.showOnHomepage && status === "live") text += " · Startseite";
    return `<span class="content-hub-badge ${cls}">${escapeHtml(text)}</span>`;
}

function renderContentHubPanel() {
    const panel = document.getElementById("contentHubPanel");
    if (!panel) return;
    const site = window.KG_ADMIN?.getSite() || loadSite();
    const news = site.global.news?.items || [];
    const events = site.global.kalender?.events || [];

    panel.innerHTML = `
        <div class="content-hub-toolbar">
            <h2>📰 News & Termine – Schnellpflege</h2>
            <div class="content-hub-subtabs">
                <button type="button" class="${hubSubTab === "news" ? "active" : ""}" data-hub-tab="news">News (${news.length})</button>
                <button type="button" class="${hubSubTab === "events" ? "active" : ""}" data-hub-tab="events">Termine (${events.length})</button>
            </div>
            <button type="button" class="btn primary" id="hubSaveAllBtn">Alles speichern</button>
        </div>
        <div class="content-hub-body" id="contentHubBody"></div>`;

    document.getElementById("hubSaveAllBtn").addEventListener("click", hubSaveAll);
    panel.querySelectorAll("[data-hub-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
            hubSubTab = btn.dataset.hubTab;
            renderContentHubPanel();
        });
    });

    const body = document.getElementById("contentHubBody");
    if (hubSubTab === "news") body.innerHTML = renderNewsHub(site);
    else body.innerHTML = renderEventsHub(site);

    bindNewsHub(site);
    bindEventsHub(site);
    bindMediaFieldInputs(body);
}

function renderNewsHub(site) {
    const items = site.global.news?.items || [];
    if (!items.length) hubSelectedNews = 0;
    else if (hubSelectedNews >= items.length) hubSelectedNews = items.length - 1;

    const cards = items.length ? items.map((n, i) => `
        <button type="button" class="content-hub-card ${i === hubSelectedNews ? "active" : ""}" data-hub-news="${i}">
            ${n.image ? `<img src="${escapeAttr(n.image)}" alt="">` : `<div class="content-hub-card-thumb">📰</div>`}
            <div>
                <h4>${escapeHtml(n.title || "Ohne Titel")}</h4>
                <small>${escapeHtml(n.date || "Kein Datum")}</small>
            </div>
            ${hubBadge(n)}
        </button>`).join("") : `<div class="content-hub-empty">Noch keine News. Erste Meldung anlegen.</div>`;

    return `
        <div class="content-hub-list">
            <button type="button" class="btn-add" id="hubAddNews" style="margin-bottom:12px">+ Neue News</button>
            <div class="content-hub-cards">${cards}</div>
        </div>
        <div class="content-hub-editor" id="hubNewsEditor">${items.length ? renderNewsEditor(items[hubSelectedNews], hubSelectedNews) : "<p class='field-hint'>News auswählen oder neu anlegen.</p>"}</div>`;
}

function renderNewsEditor(n, i) {
    return `
        <h3>News bearbeiten</h3>
        ${hubField("Titel", `hn-title-${i}`, n.title)}
        ${hubField("ID (URL)", `hn-id-${i}`, n.id)}
        ${hubField("Anzeige-Datum", `hn-date-${i}`, n.date)}
        ${hubField("Titelbild", `hn-image-${i}`, n.image)}
        ${hubField("Kurztext", `hn-teaser-${i}`, n.teaser, "textarea")}
        ${hubField("Text", `hn-body-${i}`, n.body || "", "textarea")}
        ${hubField("Veröffentlichung (Datum & Uhrzeit)", `hn-publishAt-${i}`, n.publishAt, "datetime-local")}
        ${hubField("Auf Startseite anzeigen", `hn-home-${i}`, n.showOnHomepage, "checkbox")}
        <p class="field-hint">Leer lassen = sofort sichtbar. Mit Datum/Uhrzeit erscheint die News automatisch ab dann – auch auf der Startseite (wenn aktiviert).</p>
        <div class="content-hub-actions">
            <button type="button" class="btn primary" id="hubSaveNews">Speichern</button>
            <button type="button" class="btn soft" id="hubPreviewNews">Vorschau</button>
            <button type="button" class="btn-danger" id="hubDeleteNews">Löschen</button>
        </div>`;
}

function bindNewsHub(site) {
    document.getElementById("hubAddNews")?.addEventListener("click", () => {
        site.global.news.items.unshift({
            id: uid("news"),
            date: new Date().toLocaleDateString("de-AT"),
            title: "",
            teaser: "",
            image: "",
            body: "",
            images: [],
            videos: [],
            publishAt: "",
            showOnHomepage: false
        });
        hubSelectedNews = 0;
        window.KG_ADMIN?.setSite(site);
        renderContentHubPanel();
    });

    document.querySelectorAll("[data-hub-news]").forEach((btn) => {
        btn.addEventListener("click", () => {
            hubCollectNews(site);
            hubSelectedNews = Number(btn.dataset.hubNews);
            renderContentHubPanel();
        });
    });

    document.getElementById("hubSaveNews")?.addEventListener("click", () => {
        hubCollectNews(site);
        window.KG_ADMIN?.save();
        showStatus("News gespeichert.");
        renderContentHubPanel();
    });

    document.getElementById("hubDeleteNews")?.addEventListener("click", () => {
        if (!confirm("News wirklich löschen?")) return;
        site.global.news.items.splice(hubSelectedNews, 1);
        hubSelectedNews = Math.max(0, hubSelectedNews - 1);
        window.KG_ADMIN?.setSite(site);
        window.KG_ADMIN?.save();
        renderContentHubPanel();
    });

    document.getElementById("hubPreviewNews")?.addEventListener("click", () => {
        hubCollectNews(site);
        const n = site.global.news.items[hubSelectedNews];
        if (n?.id) window.open(`news-artikel.html?id=${encodeURIComponent(n.id)}`, "_blank");
    });
}

function hubCollectNews(site) {
    const i = hubSelectedNews;
    const n = site.global.news?.items[i];
    if (!n) return;
    n.title = document.getElementById(`hn-title-${i}`)?.value || "";
    n.id = document.getElementById(`hn-id-${i}`)?.value || n.id;
    n.date = document.getElementById(`hn-date-${i}`)?.value || "";
    n.image = document.getElementById(`hn-image-${i}`)?.value || "";
    n.teaser = document.getElementById(`hn-teaser-${i}`)?.value || "";
    n.body = document.getElementById(`hn-body-${i}`)?.value || "";
    const pub = document.getElementById(`hn-publishAt-${i}`)?.value;
    n.publishAt = pub ? new Date(pub).toISOString() : "";
    n.showOnHomepage = document.getElementById(`hn-home-${i}`)?.checked || false;
}

function renderEventsHub(site) {
    const events = site.global.kalender?.events || [];
    if (!events.length) hubSelectedEvent = 0;
    else if (hubSelectedEvent >= events.length) hubSelectedEvent = events.length - 1;

    const monthEvents = events.filter((e) => {
        if (!e.date) return false;
        const p = e.date.split("-");
        return Number(p[0]) === hubCalYear && Number(p[1]) === hubCalMonth + 1;
    });

    const cards = monthEvents.length ? monthEvents.map((e) => {
        const idx = events.indexOf(e);
        return `
        <button type="button" class="content-hub-card ${idx === hubSelectedEvent ? "active" : ""}" data-hub-event="${idx}">
            ${e.image ? `<img src="${escapeAttr(e.image)}" alt="">` : `<div class="content-hub-card-thumb">📅</div>`}
            <div>
                <h4>${escapeHtml(e.title || "Ohne Titel")}</h4>
                <small>${escapeHtml(e.date || "")}${e.time ? ` · ${escapeHtml(e.time)}` : ""}</small>
            </div>
            ${hubBadge(e)}
        </button>`;
    }).join("") : `<div class="content-hub-empty">Keine Termine in diesem Monat.</div>`;

    const calHtml = typeof buildMonthGridInner === "function"
        ? buildMonthGridInner(events, hubCalYear, hubCalMonth, { compact: true, selectedDate: hubCalSelectedDate })
        : "";

    return `
        <div class="content-hub-list">
            <div class="hub-cal-wrap hub-cal-grid" id="hubCalRoot" data-hub-year="${hubCalYear}" data-hub-month="${hubCalMonth}">
                <div class="hub-cal-nav">
                    <button type="button" data-hub-cal="prev" aria-label="Vorheriger Monat">‹</button>
                    <strong>${new Date(hubCalYear, hubCalMonth, 1).toLocaleDateString("de-AT", { month: "long", year: "numeric" })}</strong>
                    <button type="button" data-hub-cal="next" aria-label="Nächster Monat">›</button>
                </div>
                ${calHtml}
            </div>
            <button type="button" class="btn-add" id="hubAddEvent" style="margin-bottom:12px">+ Neuer Termin</button>
            <div class="content-hub-cards">${cards}</div>
        </div>
        <div class="content-hub-editor" id="hubEventEditor">${events.length ? renderEventEditor(events[hubSelectedEvent], hubSelectedEvent) : "<p class='field-hint'>Termin auswählen oder neu anlegen.</p>"}</div>`;
}

function renderEventEditor(e, i) {
    return `
        <h3>Termin bearbeiten</h3>
        ${hubField("Titel", `he-title-${i}`, e.title)}
        ${hubField("ID", `he-id-${i}`, e.id)}
        ${hubField("Datum", `he-date-${i}`, e.date, "date")}
        ${hubField("Uhrzeit", `he-time-${i}`, e.time || "")}
        ${hubField("Kategorie", `he-category-${i}`, e.category || "")}
        ${hubField("Kurzbeschreibung", `he-desc-${i}`, e.description || "", "textarea")}
        ${hubField("Titelbild", `he-image-${i}`, e.image || "")}
        ${hubField("Text (Detailseite)", `he-body-${i}`, e.body || "", "textarea")}
        ${hubField("Startseiten-Veröffentlichung", `he-publishAt-${i}`, e.publishAt, "datetime-local")}
        ${hubField("Auf Startseite anzeigen", `he-home-${i}`, e.showOnHomepage, "checkbox")}
        <p class="field-hint">Der Termin erscheint auf der Startseite automatisch ab dem gewählten Zeitpunkt. Ohne Zeitpunkt = sofort sichtbar (wenn Startseite aktiviert).</p>
        <div class="content-hub-actions">
            <button type="button" class="btn primary" id="hubSaveEvent">Speichern</button>
            <button type="button" class="btn soft" id="hubPreviewEvent">Vorschau</button>
            <button type="button" class="btn-danger" id="hubDeleteEvent">Löschen</button>
        </div>`;
}

function bindEventsHub(site) {
    const root = document.getElementById("hubCalRoot");
    root?.querySelectorAll("[data-hub-cal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            hubCollectEvent(site);
            const shifted = shiftMonth(hubCalYear, hubCalMonth, btn.dataset.hubCal === "prev" ? -1 : 1);
            hubCalYear = shifted.year;
            hubCalMonth = shifted.month;
            hubCalSelectedDate = "";
            renderContentHubPanel();
        });
    });

    root?.querySelectorAll("[data-cal-day]").forEach((cell) => {
        cell.addEventListener("click", (e) => {
            e.preventDefault();
            hubCalSelectedDate = cell.dataset.calDay;
            const events = site.global.kalender.events;
            const idx = events.findIndex((ev) => ev.date === hubCalSelectedDate);
            if (idx >= 0) hubSelectedEvent = idx;
            renderContentHubPanel();
        });
    });

    document.getElementById("hubAddEvent")?.addEventListener("click", () => {
        const iso = hubCalSelectedDate || `${hubCalYear}-${String(hubCalMonth + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;
        site.global.kalender.events.unshift({
            id: uid("event"),
            date: iso,
            time: "",
            title: "",
            description: "",
            category: "",
            image: "",
            body: "",
            images: [],
            publishAt: "",
            showOnHomepage: false
        });
        hubSelectedEvent = 0;
        window.KG_ADMIN?.setSite(site);
        renderContentHubPanel();
    });

    document.querySelectorAll("[data-hub-event]").forEach((btn) => {
        btn.addEventListener("click", () => {
            hubCollectEvent(site);
            hubSelectedEvent = Number(btn.dataset.hubEvent);
            const ev = site.global.kalender.events[hubSelectedEvent];
            if (ev?.date) hubCalSelectedDate = ev.date;
            renderContentHubPanel();
        });
    });

    document.getElementById("hubSaveEvent")?.addEventListener("click", () => {
        hubCollectEvent(site);
        window.KG_ADMIN?.save();
        showStatus("Termin gespeichert.");
        renderContentHubPanel();
    });

    document.getElementById("hubDeleteEvent")?.addEventListener("click", () => {
        if (!confirm("Termin wirklich löschen?")) return;
        site.global.kalender.events.splice(hubSelectedEvent, 1);
        hubSelectedEvent = Math.max(0, hubSelectedEvent - 1);
        window.KG_ADMIN?.setSite(site);
        window.KG_ADMIN?.save();
        renderContentHubPanel();
    });

    document.getElementById("hubPreviewEvent")?.addEventListener("click", () => {
        hubCollectEvent(site);
        const ev = site.global.kalender.events[hubSelectedEvent];
        if (ev?.id) window.open(`kalender-artikel.html?id=${encodeURIComponent(ev.id)}`, "_blank");
    });
}

function hubCollectEvent(site) {
    const i = hubSelectedEvent;
    const e = site.global.kalender?.events[i];
    if (!e) return;
    e.title = document.getElementById(`he-title-${i}`)?.value || "";
    e.id = document.getElementById(`he-id-${i}`)?.value || e.id;
    e.date = document.getElementById(`he-date-${i}`)?.value || "";
    e.time = document.getElementById(`he-time-${i}`)?.value || "";
    e.category = document.getElementById(`he-category-${i}`)?.value || "";
    e.description = document.getElementById(`he-desc-${i}`)?.value || "";
    e.image = document.getElementById(`he-image-${i}`)?.value || "";
    e.body = document.getElementById(`he-body-${i}`)?.value || "";
    const pub = document.getElementById(`he-publishAt-${i}`)?.value;
    e.publishAt = pub ? new Date(pub).toISOString() : "";
    e.showOnHomepage = document.getElementById(`he-home-${i}`)?.checked || false;
}

function hubSaveAll() {
    const site = window.KG_ADMIN?.getSite();
    if (!site) return;
    if (hubSubTab === "news") hubCollectNews(site);
    else hubCollectEvent(site);
    window.KG_ADMIN?.save();
    showStatus("News & Termine gespeichert.");
    window.KG_ADMIN?.refresh?.();
}
