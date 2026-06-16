function getSiteData() {
    if (typeof loadSite === "function") {
        const site = loadSite();
        if (site?.global) {
            return {
                news: site.global.news,
                siteName: site.global.siteName
            };
        }
    }
    const stored = localStorage.getItem("kg_content_override");
    if (stored) {
        try {
            const content = JSON.parse(stored);
            return { news: content.news, siteName: content.site?.name };
        } catch { localStorage.removeItem("kg_content_override"); }
    }
    return { news: window.KG_CONTENT?.news, siteName: window.KG_CONTENT?.site?.name };
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function getNewsById(data, id) {
    return (data.news?.items || []).find((item) => item.id === id);
}

function renderBodyParagraphs(body) {
    if (!body) return "";
    return body.split(/\n\n+/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join("");
}

function renderVideos(videos) {
    if (!videos?.length) return "";
    return `<div class="article-videos">${videos.map((video) => `
        <div class="video-embed">
            ${video.title ? `<h3>${escapeHtml(video.title)}</h3>` : ""}
            <iframe src="${escapeHtml(video.url)}" title="${escapeHtml(video.title || "Video")}" allowfullscreen loading="lazy"></iframe>
        </div>
    `).join("")}</div>`;
}

function renderNewsArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const data = getSiteData();
    const article = getNewsById(data, id);
    const root = document.getElementById("newsArticle");

    if (!root || !article || (typeof isPublished === "function" && !isPublished(article))) {
        if (root) root.innerHTML = `<p>Beitrag nicht gefunden. <a href="news.html">Zurück zu den News</a></p>`;
        return;
    }

    document.title = `${article.title} | ${data.siteName || "Kindergarten"}`;

    const carouselImages = article.images?.length
        ? article.images
        : article.image ? [{ src: article.image, alt: article.title }] : [];

    const carouselHtml = typeof buildCarouselHtml === "function"
        ? buildCarouselHtml(carouselImages, { autoPlay: true, interval: 4500 })
        : "";

    root.innerHTML = `
        <a class="back-link" href="news.html">← Zurück zu den News</a>
        <article class="article-detail visible">
            <time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time>
            <h1>${escapeHtml(article.title)}</h1>
            ${carouselHtml}
            <div class="article-body">${renderBodyParagraphs(article.body || article.teaser)}</div>
            ${renderVideos(article.videos)}
        </article>
    `;

    const carousel = root.querySelector(".carousel");
    if (carousel && typeof initCarousel === "function") {
        initCarousel(carousel, { autoPlay: true, interval: 4500 });
    }
}

renderNewsArticle();
