function getByPath(object, path) {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), object);
}

function getActiveContent() {
    const stored = localStorage.getItem("kg_content_override");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            localStorage.removeItem("kg_content_override");
        }
    }
    return window.KG_CONTENT;
}

function bindText(content) {
    document.querySelectorAll("[data-text]").forEach((element) => {
        const value = getByPath(content, element.dataset.text);
        if (typeof value === "string") {
            element.textContent = value;
        }
    });
}

function bindHtml(content) {
    document.querySelectorAll("[data-html]").forEach((element) => {
        const value = getByPath(content, element.dataset.html);
        if (typeof value === "string") {
            element.innerHTML = value;
        }
    });
}

function bindHref(content) {
    document.querySelectorAll("[data-href]").forEach((element) => {
        const value = getByPath(content, element.dataset.href);
        if (typeof value === "string") {
            element.setAttribute("href", value);
        }
    });
}

function bindSrc(content) {
    document.querySelectorAll("[data-src]").forEach((element) => {
        const value = getByPath(content, element.dataset.src);
        if (typeof value === "string") {
            element.setAttribute("src", value);
        }
    });
}

function bindAlt(content) {
    document.querySelectorAll("[data-alt]").forEach((element) => {
        const value = getByPath(content, element.dataset.alt);
        if (typeof value === "string") {
            element.setAttribute("alt", value);
        }
    });
}

function bindMeta(content) {
    document.querySelectorAll("meta[data-content]").forEach((element) => {
        const value = getByPath(content, element.dataset.content);
        if (typeof value === "string") {
            element.setAttribute("content", value);
        }
    });
}

function bindDocumentTitle(content) {
    const titleElement = document.querySelector("title[data-text]");
    if (!titleElement) return;
    const value = getByPath(content, titleElement.dataset.text);
    if (typeof value === "string") document.title = value;
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function getMembersForGroup(content, groupName) {
    return (content.team?.members || []).filter((member) => member.gruppe === groupName);
}

function renderGroupTeam(content, groupName) {
    const members = getMembersForGroup(content, groupName);
    if (!members.length) return "";
    const teamLabel = content.gruppen?.teamLabel || "Unser Team in dieser Gruppe";
    const membersHtml = members.map((member) => `
        <div class="gruppe-team-member">
            <img src="${escapeHtml(member.avatar || "images/avatars/placeholder.svg")}" alt="Portrait von ${escapeHtml(member.name)}">
            <div>
                <strong>${escapeHtml(member.name)}</strong>
                <span>${escapeHtml(member.position)}</span>
                ${member.intro ? `<p>${escapeHtml(member.intro)}</p>` : ""}
            </div>
        </div>
    `).join("");
    return `<div class="gruppe-team"><h4>${escapeHtml(teamLabel)}</h4><div class="gruppe-team-list">${membersHtml}</div></div>`;
}

function renderIndexCards(content) {
    const container = document.querySelector("[data-render='index-cards']");
    if (!container || !content.index?.cards) return;
    container.innerHTML = content.index.cards.map((card) => `
        <article class="card card-with-image visible">
            ${card.image ? `<img class="card-image" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title)}">` : ""}
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.text)}</p>
        </article>
    `).join("");
}

function renderSlideshow(content) {
    const container = document.querySelector("[data-render='slideshow']");
    const slideshow = content.index?.slideshow;
    if (!container || !slideshow?.images?.length) return;

    container.innerHTML = `
        <div class="section-header visible">
            <h2>${escapeHtml(slideshow.title || "Eindrücke")}</h2>
        </div>
        ${typeof buildCarouselHtml === "function" ? buildCarouselHtml(slideshow.images, {
            autoPlay: slideshow.autoPlay !== false,
            interval: slideshow.intervalMs || 4500
        }) : ""}
    `;

    const carousel = container.querySelector(".carousel");
    if (carousel && typeof initCarousel === "function") {
        initCarousel(carousel, {
            autoPlay: slideshow.autoPlay !== false,
            interval: slideshow.intervalMs || 4500
        });
    }
}

function renderPaedagogik(content) {
    const container = document.querySelector("[data-render='paedagogik']");
    const p = content.paedagogik;
    if (!container || !p) return;

    const principles = (p.principles || []).map((item) => `
        <article class="card card-with-image visible">
            ${item.image ? `<img class="card-image" src="${escapeHtml(item.image)}" alt="">` : ""}
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
        </article>
    `).join("");

    const bereiche = (p.bildungsbereiche || []).map((item) => `
        <article class="card visible"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>
    `).join("");

    const ablauf = (p.tagesablauf || []).map((item) => `
        <article class="ablauf-item visible">
            <span class="ablauf-time">${escapeHtml(item.time)}</span>
            <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
        </article>
    `).join("");

    const sections = (p.sections || []).map((item, i) => `
        <section class="split visible ${i % 2 ? "split-reverse" : ""}">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ""}
            <div><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p></div>
        </section>
    `).join("");

    container.innerHTML = `
        ${p.leitbild ? `
        <section class="split visible leitbild-block">
            ${p.leitbild.image ? `<img src="${escapeHtml(p.leitbild.image)}" alt="">` : ""}
            <div><h2>${escapeHtml(p.leitbild.title)}</h2><p>${escapeHtml(p.leitbild.text)}</p></div>
        </section>` : ""}
        <div class="section-header visible"><h2>Pädagogische Grundsätze</h2></div>
        <div class="cards">${principles}</div>
        <div class="section-header visible section"><h2>Bildungs- und Entwicklungsbereiche</h2></div>
        <div class="cards">${bereiche}</div>
        <div class="section-header visible section"><h2>Unser Tagesablauf</h2></div>
        <div class="ablauf-list">${ablauf}</div>
        <section class="section split visible">
            <img data-src="images.paedagogikFocus.src" data-alt="images.paedagogikFocus.alt" src="${escapeHtml(content.images?.paedagogikFocus?.src || "")}" alt="">
            <div>
                <h2>${escapeHtml(p.focusTitle || "")}</h2>
                <p>${escapeHtml(p.focusText || "")}</p>
            </div>
        </section>
        ${sections}
    `;
}

function renderTeam(content) {
    const container = document.querySelector("[data-render='team']");
    if (!container || !content.team?.members) return;
    container.innerHTML = content.team.members.map((member) => `
        <article class="team-card visible">
            <img class="team-avatar" src="${escapeHtml(member.avatar || "images/avatars/placeholder.svg")}" alt="Portrait von ${escapeHtml(member.name)}">
            <h3>${escapeHtml(member.name)}</h3>
            <p class="team-position">${escapeHtml(member.position)}</p>
            <p>${escapeHtml(member.intro)}</p>
        </article>
    `).join("");
}

function renderGruppen(content) {
    const container = document.querySelector("[data-render='gruppen']");
    if (!container || !content.gruppen?.items) return;
    container.innerHTML = content.gruppen.items.map((gruppe) => `
        <article class="gruppe-card visible">
            <img src="${escapeHtml(gruppe.image || "images/gruppenraum-hell.png")}" alt="${escapeHtml(gruppe.name)}">
            <div class="gruppe-body">
                <h3>${escapeHtml(gruppe.name)}</h3>
                <p class="gruppe-meta">${escapeHtml(gruppe.ageRange)} · ${escapeHtml(gruppe.capacity)}</p>
                <p>${escapeHtml(gruppe.description)}</p>
                ${renderGroupTeam(content, gruppe.name)}
            </div>
        </article>
    `).join("");
}

function renderNews(content) {
    const container = document.querySelector("[data-render='news']");
    if (!container || !content.news?.items) return;
    container.innerHTML = content.news.items.map((item) => `
        <a class="news-card-link visible" href="news-artikel.html?id=${encodeURIComponent(item.id)}">
            <article class="news-card">
                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ""}
                <div class="news-body">
                    <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.teaser)}</p>
                    <span class="read-more">Weiterlesen →</span>
                </div>
            </article>
        </a>
    `).join("");
}

function bindContent() {
    const content = getActiveContent();
    if (!content) return;

    window.KG_CONTENT = content;
    bindDocumentTitle(content);
    bindMeta(content);
    bindText(content);
    bindHtml(content);
    bindHref(content);
    bindSrc(content);
    bindAlt(content);
    renderIndexCards(content);
    renderSlideshow(content);
    renderPaedagogik(content);
    renderTeam(content);
    renderGruppen(content);
    renderNews(content);
}

bindContent();
