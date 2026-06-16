const KG_THEME_FONT_ID = "kg-theme-font";

function getPresetById(id) {
    return DESIGN_PRESETS.find((p) => p.id === id) || DESIGN_PRESETS[0];
}

function resolveThemeDecoration(theme, preset) {
    if (theme.decoration) return theme.decoration;
    if (theme.showClouds === false) return "none";
    if (theme.showClouds === true) return "clouds";
    return preset.defaultDecoration || (preset.showClouds ? "clouds" : "none");
}

function resolveThemeAnimation(theme, preset) {
    return theme.pageAnimation || preset.defaultAnimation || "fade-up";
}

function ensureSiteTheme(site) {
    if (!site?.global) return;
    if (!site.global.theme) {
        site.global.theme = {
            presetId: "holz-pastell",
            custom: {},
            fontFamily: "",
            borderRadius: "",
            showClouds: null,
            decoration: "",
            pageAnimation: ""
        };
    }
    if (!site.global.theme.custom) site.global.theme.custom = {};
}

function getResolvedTheme(site) {
    ensureSiteTheme(site);
    const t = site.global.theme;
    const preset = getPresetById(t.presetId);
    const vars = { ...preset.vars, ...t.custom };
    const borderRadius = t.borderRadius || preset.borderRadius || "normal";
    const radiusVars = BORDER_RADIUS_MAP[borderRadius] || BORDER_RADIUS_MAP.normal;
    Object.entries(radiusVars).forEach(([k, v]) => { vars[k] = v; });
    const decoration = resolveThemeDecoration(t, preset);
    const pageAnimation = resolveThemeAnimation(t, preset);
    return {
        presetId: preset.id,
        preset,
        fontFamily: t.fontFamily || preset.fontFamily,
        fontUrl: preset.fontUrl,
        showClouds: decoration === "clouds",
        decoration,
        pageAnimation,
        borderRadius,
        vars
    };
}

function loadThemeFont(fontUrl, fontFamily) {
    if (!fontUrl) return;
    let link = document.getElementById(KG_THEME_FONT_ID);
    if (!link) {
        link = document.createElement("link");
        link.id = KG_THEME_FONT_ID;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }
    link.href = fontUrl;
    if (fontFamily) {
        document.documentElement.style.setProperty("--font-family", `"${fontFamily}", sans-serif`);
    }
}

function applyThemeToElement(el, resolved) {
    if (!el || !resolved) return;
    Object.entries(resolved.vars).forEach(([key, value]) => {
        el.style.setProperty(`--${key}`, value);
    });
    el.style.setProperty("--font-family", `"${resolved.fontFamily}", sans-serif`);
    el.style.fontFamily = `var(--font-family)`;
}

function ensureDecorationContainer() {
    let container = document.getElementById("kg-theme-decorations");
    if (!container) {
        container = document.createElement("div");
        container.id = "kg-theme-decorations";
        container.setAttribute("aria-hidden", "true");
        document.body.prepend(container);
    }
    return container;
}

function applyThemeDecorations(resolved, target = document) {
    const isDoc = target === document || target === document.body;
    const container = isDoc
        ? ensureDecorationContainer()
        : target.querySelector("#kg-theme-decorations, .design-sample-deco");

    if (!container) return;

    const type = resolved.decoration || "none";
    container.className = isDoc
        ? `kg-deco-wrap kg-deco-${type}`
        : `design-sample-deco kg-deco-${type}`;

    if (typeof buildDecorationMarkup === "function") {
        container.innerHTML = type === "none" ? "" : buildDecorationMarkup(type);
    }

    if (isDoc) {
        document.body.classList.add("kg-theme-ready");
        document.querySelectorAll(".cloud").forEach((cloud) => {
            cloud.style.display = "none";
        });
        document.body.dataset.pageAnim = resolved.pageAnimation || "fade-up";
    }
}

function applySiteTheme(site, target = document.documentElement) {
    const resolved = getResolvedTheme(site);
    applyThemeToElement(target, resolved);
    if (target === document.documentElement) {
        loadThemeFont(resolved.fontUrl, resolved.fontFamily);
        document.body.style.fontFamily = `var(--font-family)`;
        applyThemeDecorations(resolved);
    }
    return resolved;
}

function applyThemeToPreview(site) {
    const inner = document.getElementById("livePreviewInner");
    const sample = document.getElementById("designSamplePreview");
    const resolved = getResolvedTheme(site);
    if (inner) {
        applyThemeToElement(inner, resolved);
        inner.style.fontFamily = `var(--font-family)`;
        inner.dataset.pageAnim = resolved.pageAnimation;
    }
    if (sample) {
        applyThemeToElement(sample, resolved);
        sample.style.fontFamily = `var(--font-family)`;
        let deco = sample.querySelector(".design-sample-deco");
        if (!deco) {
            deco = document.createElement("div");
            deco.className = "design-sample-deco";
            sample.prepend(deco);
        }
        applyThemeDecorations(resolved, sample);
    }
    return resolved;
}
