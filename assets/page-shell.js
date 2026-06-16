function renderSiteNav(site, activePageId) {
    const pages = (site.pages || []).filter((p) => p.inNav);
    return pages.map((page) => {
        const href = page.path || `seite.html?p=${page.id}`;
        const active = page.id === activePageId ? "active" : "";
        return `<li><a class="${active}" href="${escapeHtml(href)}">${escapeHtml(page.navLabel || page.title)}</a></li>`;
    }).join("");
}

function renderLayout(site, activePageId) {
    ensureLayoutConfig(site);
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const g = site.global;

    if (header) {
        header.className = `topbar ${g.header?.sticky !== false ? "topbar-sticky" : "topbar-static"}`;
        header.innerHTML = renderSiteHeaderHtml(site, activePageId);
    }

    if (footer) {
        footer.innerHTML = renderSiteFooterHtml(site);
    }

    applyHeaderBodyClass(site);

    document.title = `${getPageById(site, activePageId)?.title || g.siteName} | ${g.siteName}`;
}

function bootPage() {
    const site = loadSite();
    if (!site) return;

    ensureLayoutConfig(site);

    if (typeof applySiteTheme === "function") applySiteTheme(site);

    const pageId = document.body.dataset.pageId
        || document.body.dataset.activeNav
        || new URLSearchParams(window.location.search).get("p")
        || "home";

    const root = document.getElementById("page-root");
    if (root) {
        renderLayout(site, pageId);
        root.innerHTML = renderPage(site, pageId);
        initPageCarousels(root);
        initKalenderModules(root, site);
        initSpeiseplanModules(root, site);
        initPageTabs(root);

        if (typeof initReveal === "function") initReveal(root);
        else if ("IntersectionObserver" in window) {
            root.querySelectorAll(".reveal, .visible").forEach((el) => {
                if (!el.classList.contains("visible")) {
                    el.classList.add("reveal");
                    new IntersectionObserver((entries, obs) => {
                        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
                    }, { threshold: 0.1 }).observe(el);
                }
            });
        }
        return;
    }

    if (document.getElementById("site-header")) {
        renderLayout(site, pageId);
    }
}

if (document.getElementById("page-root") || document.getElementById("site-header")) {
    bootPage();
}
