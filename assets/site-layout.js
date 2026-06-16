const DEFAULT_FOOTER_LINKS = [
    { id: "impressum", label: "Impressum", href: "impressum.html", enabled: true },
    { id: "datenschutz", label: "Datenschutz", href: "datenschutz.html", enabled: true },
    { id: "kontakt", label: "Kontakt", href: "kontakt.html", enabled: true }
];

function ensureLayoutConfig(site) {
    if (!site?.global) return;
    const g = site.global;

    if (typeof g.footer === "string") {
        g.footer = {
            copyright: g.footer,
            tagline: "",
            links: structuredClone(DEFAULT_FOOTER_LINKS),
            showAdminLink: true,
            adminLinkLabel: "Inhalte pflegen"
        };
    }

    if (!g.footer || typeof g.footer !== "object") {
        g.footer = {
            copyright: "© 2026 Kindergarten",
            tagline: "",
            links: structuredClone(DEFAULT_FOOTER_LINKS),
            showAdminLink: true,
            adminLinkLabel: "Inhalte pflegen"
        };
    }

    if (!Array.isArray(g.footer.links)) g.footer.links = structuredClone(DEFAULT_FOOTER_LINKS);
    if (g.footer.showAdminLink === undefined) g.footer.showAdminLink = true;
    if (!g.footer.adminLinkLabel) g.footer.adminLinkLabel = "Inhalte pflegen";

    if (!g.header || typeof g.header !== "object") {
        g.header = {
            brandLink: "index.html",
            logo: "",
            logoAlt: "",
            showNavigation: true,
            sticky: true,
            ctaLabel: "",
            ctaLink: "",
            ctaStyle: "soft"
        };
    }

    if (g.header.showNavigation === undefined) g.header.showNavigation = true;
    if (g.header.sticky === undefined) g.header.sticky = true;
    if (!g.header.brandLink) g.header.brandLink = "index.html";
    if (!g.header.ctaStyle) g.header.ctaStyle = "soft";
}

function renderFooterLinksHtml(footer) {
    const links = (footer.links || []).filter((l) => l.enabled !== false && l.label && l.href);
    if (!links.length) return "";
    return `<nav class="footer-links" aria-label="Rechtliches und Service">
        ${links.map((l) => `<a href="${escapeAttr(l.href)}">${escapeHtml(l.label)}</a>`).join("")}
    </nav>`;
}

function renderSiteHeaderHtml(site, activePageId) {
    const g = site.global;
    const h = g.header || {};
    const brandInner = h.logo
        ? `<img class="brand-logo" src="${escapeAttr(h.logo)}" alt="${escapeAttr(h.logoAlt || g.brandHighlight || g.siteName)}">`
        : `<span>${escapeHtml(g.brandPrefix)}</span> <span class="brand-highlight">${escapeHtml(g.brandHighlight)}</span>`;

    const navHtml = h.showNavigation !== false
        ? `<nav aria-label="Hauptnavigation"><ul>${renderSiteNav(site, activePageId)}</ul></nav>`
        : "";

    const ctaHtml = h.ctaLabel && h.ctaLink
        ? `<a class="btn ${h.ctaStyle === "primary" ? "primary" : "soft"} header-cta" href="${escapeAttr(h.ctaLink)}">${escapeHtml(h.ctaLabel)}</a>`
        : "";

    const stickyClass = h.sticky !== false ? "topbar-sticky" : "topbar-static";

    return `<div class="container topbar-inner">
        <a class="brand" href="${escapeAttr(h.brandLink || "index.html")}">${brandInner}</a>
        ${navHtml}
        ${ctaHtml}
    </div>`;
}

function renderSiteFooterHtml(site) {
    const footer = site.global.footer || {};
    const tagline = footer.tagline
        ? `<p class="footer-tagline">${escapeHtml(footer.tagline)}</p>`
        : "";
    const admin = footer.showAdminLink
        ? `<p class="footer-admin"><a href="admin.html">${escapeHtml(footer.adminLinkLabel || "Inhalte pflegen")}</a></p>`
        : "";

    return `<div class="container footer-inner">
        ${renderFooterLinksHtml(footer)}
        <p class="footer-copyright">${escapeHtml(footer.copyright || "")}</p>
        ${tagline}
        ${admin}
    </div>`;
}

function applyHeaderBodyClass(site) {
    const sticky = site.global?.header?.sticky !== false;
    document.body.classList.toggle("header-sticky", sticky);
    document.body.classList.toggle("header-static", !sticky);
}
