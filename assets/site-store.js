const KG_SITE_STORAGE_KEY = "kg_site_override";

function loadSite() {
    const stored = localStorage.getItem(KG_SITE_STORAGE_KEY);
    let site;
    if (stored) {
        try {
            site = JSON.parse(stored);
        } catch {
            localStorage.removeItem(KG_SITE_STORAGE_KEY);
        }
    }
    if (!site) site = structuredClone(window.KG_SITE || null);
    if (site?.global && !site.global.theme) {
        site.global.theme = { presetId: "holz-pastell", custom: {}, fontFamily: "", borderRadius: "", showClouds: null, decoration: "", pageAnimation: "", animationIntensity: 50 };
    }
    if (typeof ensureLayoutConfig === "function") ensureLayoutConfig(site);
    return site;
}

function saveSite(site) {
    localStorage.setItem(KG_SITE_STORAGE_KEY, JSON.stringify(site));
}

function clearSiteOverride() {
    localStorage.removeItem(KG_SITE_STORAGE_KEY);
}

function exportSiteJs(site) {
    const body = `window.KG_SITE = ${JSON.stringify(site, null, 4)};\n`;
    const blob = new Blob([body], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site-data.js";
    link.click();
    URL.revokeObjectURL(url);
}

function uid(prefix = "m") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function escapeHtml(text) {
    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function escapeAttr(text) {
    return escapeHtml(text);
}

function getPageById(site, pageId) {
    return site.pages.find((page) => page.id === pageId);
}

function getModuleAtPath(modules, path) {
    let list = modules;
    let mod = null;
    for (const index of path) {
        mod = list[index];
        if (!mod) return null;
        list = mod.children || [];
    }
    return mod;
}

function getModuleListAtPath(page, path) {
    if (!path.length) return page.modules;
    const parent = getModuleAtPath(page.modules, path.slice(0, -1));
    return parent?.children || null;
}
