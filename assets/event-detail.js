function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function getSiteData() {
    if (typeof loadSite === "function") {
        const site = loadSite();
        if (site?.global) {
            return {
                kalender: site.global.kalender,
                siteName: site.global.siteName
            };
        }
    }
    const stored = localStorage.getItem("kg_content_override");
    if (stored) {
        try {
            const content = JSON.parse(stored);
            return { kalender: content.kalender, siteName: content.site?.name };
        } catch { localStorage.removeItem("kg_content_override"); }
    }
    return { kalender: window.KG_CONTENT?.kalender, siteName: window.KG_CONTENT?.site?.name };
}

function getEventById(data, id) {
    return (data.kalender?.events || []).find((event) => event.id === id);
}

function renderBodyParagraphs(body) {
    if (!body) return "";
    return body.split(/\n\n+/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join("");
}

function renderEventDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const data = getSiteData();
    const event = getEventById(data, id);
    const root = document.getElementById("eventArticle");

    if (!root || !event || (typeof isPublished === "function" && !isPublished(event))) {
        if (root) root.innerHTML = `<p>Termin nicht gefunden. <a href="kalender.html">Zurück zum Kalender</a></p>`;
        return;
    }

    document.title = `${event.title} | ${data.siteName || "Kindergarten"}`;

    const dateFormatted = (() => {
        const parts = event.date.split("-");
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return date.toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    })();

    const carouselImages = event.images?.length
        ? event.images
        : event.image ? [{ src: event.image, alt: event.title }] : [];

    const carouselHtml = typeof buildCarouselHtml === "function" && carouselImages.length
        ? buildCarouselHtml(carouselImages, { autoPlay: true, interval: 5000 })
        : "";

    root.innerHTML = `
        <a class="back-link" href="kalender.html">← Zurück zum Kalender</a>
        <article class="article-detail event-detail visible">
            ${event.category ? `<span class="kalender-category">${escapeHtml(event.category)}</span>` : ""}
            <h1>${escapeHtml(event.title)}</h1>
            <p class="kalender-meta">${escapeHtml(dateFormatted)}${event.time ? ` · ${escapeHtml(event.time)} Uhr` : ""}</p>
            ${event.description ? `<p class="event-teaser">${escapeHtml(event.description)}</p>` : ""}
            ${carouselHtml}
            <div class="article-body">${renderBodyParagraphs(event.body || event.description)}</div>
        </article>
    `;

    const carousel = root.querySelector(".carousel");
    if (carousel && typeof initCarousel === "function") {
        initCarousel(carousel, { autoPlay: true, interval: 5000 });
    }
}

renderEventDetail();
