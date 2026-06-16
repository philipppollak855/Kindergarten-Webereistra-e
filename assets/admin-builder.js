let site = loadSite();
ensureMediaLibrary(site);
ensureSiteTheme(site);
if (typeof ensureLayoutConfig === "function") ensureLayoutConfig(site);
let designCategoryFilter = "alle";
let currentPageId = site.pages[0]?.id || "home";
let selectedPath = null;
let dragPath = null;
let canvasView = "structure";

function pathKey(path) {
    return path.join("-");
}

function parsePath(key) {
    return key ? key.split("-").map(Number) : [];
}

function getPage() {
    return getPageById(site, currentPageId);
}

function getListByPath(path) {
    const page = getPage();
    if (!page) return null;
    if (!path.length) return page.modules;
    let list = page.modules;
    for (let i = 0; i < path.length - 1; i++) {
        const mod = list[path[i]];
        if (!mod?.children) return null;
        list = mod.children;
    }
    return list;
}

function getModuleByPath(path) {
    const list = getListByPath(path);
    if (!list) return null;
    return list[path[path.length - 1]];
}

function removeAtPath(path) {
    const list = getListByPath(path);
    if (!list) return;
    list.splice(path[path.length - 1], 1);
}

function insertAtPath(path, index, mod) {
    const list = getListByPath(path);
    if (!list) return;
    list.splice(index, 0, mod);
}

function showStatus(msg) {
    const el = document.getElementById("statusMsg");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 3000);
}

function imagesToLines(images) {
    return (images || []).map((img) => img.alt ? `${img.src}|${img.alt}` : img.src).join("\n");
}

function linesToImages(text) {
    return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
        const [src, alt] = line.split("|");
        return { src: src.trim(), alt: (alt || "").trim() };
    });
}

function videosToLines(videos) {
    return (videos || []).map((v) => `${v.title}|${v.url}`).join("\n");
}

function linesToVideos(text) {
    return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
        const [title, url] = line.split("|");
        return { title: (title || "Video").trim(), url: (url || title).trim() };
    });
}

function getGruppeOptions() {
    const items = site.global?.gruppen?.items || [];
    return [{ value: "", label: "— Keine Gruppe —" }, ...items.map((g) => ({ value: g.name, label: g.name }))];
}

function isAncestorPath(ancestor, path) {
    if (ancestor.length > path.length) return false;
    return ancestor.every((v, i) => v === path[i]);
}

function dropSlot(parentPath, index) {
    return `<div class="drop-slot" data-drop-path="${pathKey(parentPath)}" data-drop-index="${index}"></div>`;
}

function itemDropSlot(modulePath, index) {
    return `<div class="item-drop-slot" data-item-path="${pathKey(modulePath)}" data-item-index="${index}"></div>`;
}

function refreshAfterChange() {
    renderCanvas();
    renderProperties();
    renderPreview();
}

function renderPreview() {
    const root = document.getElementById("livePreviewInner");
    const pane = document.getElementById("livePreview");
    if (!root || canvasView !== "preview") return;
    root.innerHTML = renderPage(site, currentPageId);
    initPageCarousels(root);
    initKalenderModules(root, site);
    if (typeof initSpeiseplanModules === "function") initSpeiseplanModules(root, site);
    initPageTabs(root);
    bindPreviewNavigationGuard(root);
    bindPreviewModuleSelection(root);

    if (selectedPath) {
        const mod = getModuleByPath(selectedPath);
        if (mod) {
            const el = root.querySelector(`[data-module-id="${mod.id}"]`);
            el?.classList.add("preview-selected", "preview-module-active");
            bindPreviewModuleChrome(el, mod, selectedPath);
        }
    }

    if (pane) pane.scrollTop = 0;
    if (typeof applyThemeToPreview === "function") applyThemeToPreview(site);
}

const PREVIEW_EDITABLE = {
    hero: [
        { selector: ".badge", prop: "badge" },
        { selector: "h1", prop: "h1", multiline: true },
        { selector: ".lead", prop: "intro", multiline: true },
        { selector: ".btn.primary", prop: "ctaPrimary" },
        { selector: ".btn.soft", prop: "ctaSecondary" },
        { selector: ".frame img", prop: "image", image: true }
    ],
    heroKompakt: [
        { selector: "h1", prop: "title", multiline: true },
        { selector: ".lead", prop: "subtitle" },
        { selector: ".btn.primary", prop: "buttonLabel" },
        { selector: ".mod-hero-compact", prop: "image", image: true, bgImage: true }
    ],
    text: [
        { selector: "h2", prop: "title" },
        { selector: ".lead", prop: "lead", multiline: true },
        { selector: "section > div:last-child", prop: "body", multiline: true }
    ],
    split: [
        { selector: "h2", prop: "title" },
        { selector: ".split > div > p", prop: "text", multiline: true },
        { selector: ".split > img", prop: "image", image: true }
    ],
    banner: [
        { selector: ".mod-banner-inner > p", prop: "text", multiline: true },
        { selector: ".mod-banner-inner .btn", prop: "linkLabel" }
    ],
    cta: [
        { selector: "h2", prop: "title" },
        { selector: ".cta-box > p", prop: "text", multiline: true },
        { selector: ".cta-box .btn", prop: "buttonLabel" }
    ],
    zitat: [
        { selector: ".mod-quote-text", prop: "text", multiline: true },
        { selector: "footer strong", prop: "author" },
        { selector: "footer span", prop: "role" },
        { selector: ".mod-quote-avatar", prop: "image", image: true }
    ],
    hinweis: [
        { selector: "h3", prop: "title" },
        { selector: ".mod-notice p", prop: "text", multiline: true }
    ],
    image: [
        { selector: "figure img", prop: "src", image: true },
        { selector: "figcaption", prop: "caption" }
    ],
    cards: [{ selector: ".section-header h2, h2", prop: "title" }],
    slideshow: [{ selector: ".section-header h2, h2", prop: "title" }],
    gallery: [{ selector: ".section-header h2, h2", prop: "title" }],
    team: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    gruppen: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    news: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    aktuell: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    kalender: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    kontakt: [
        { selector: ".section-header h2", prop: "title" },
        { selector: ".section-header .lead", prop: "intro", multiline: true }
    ],
    zahlen: [{ selector: ".section-header h2", prop: "title" }],
    icons: [{ selector: ".section-header h2", prop: "title" }],
    section: [{ selector: ".section-header-inline, h2", prop: "title" }]
};

function bindPreviewNavigationGuard(root) {
    root.querySelectorAll("a[href]").forEach((a) => {
        a.addEventListener("click", (e) => e.preventDefault());
    });
}

function bindPreviewModuleSelection(root) {
    root.querySelectorAll("[data-module-id]").forEach((el) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
            if (e.target.closest(".preview-module-chrome, .preview-inline-edit, .preview-editable-image")) return;
            e.preventDefault();
            e.stopPropagation();
            const page = getPage();
            const found = findModulePath(page?.modules || [], el.dataset.moduleId);
            if (found) selectModuleInPreview(found);
        });
    });
}

function selectModuleInPreview(path) {
    selectedPath = path;
    renderCanvas();
    renderProperties();
    renderPreview();
}

function bindPreviewModuleChrome(wrap, mod, path) {
    if (!wrap) return;
    const def = MODULE_TYPES[mod.type] || { label: mod.type, icon: "?" };

    const chrome = document.createElement("div");
    chrome.className = "preview-module-chrome";
    chrome.innerHTML = `
        <span class="preview-module-label">${def.icon} ${escapeHtml(def.label)}</span>
        <button type="button" data-preview-up title="Nach oben">↑</button>
        <button type="button" data-preview-down title="Nach unten">↓</button>
        <button type="button" data-preview-delete title="Löschen">✕</button>`;
    wrap.prepend(chrome);

    chrome.querySelector("[data-preview-up]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        moveModule(path, -1);
    });
    chrome.querySelector("[data-preview-down]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        moveModule(path, 1);
    });
    chrome.querySelector("[data-preview-delete]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("Modul löschen?")) return;
        removeAtPath(path);
        selectedPath = null;
        refreshAfterChange();
    });

    bindPreviewInlineEdit(wrap, mod);
}

function bindPreviewInlineEdit(wrap, mod) {
    const fields = PREVIEW_EDITABLE[mod.type] || [];
    fields.forEach((field) => {
        if (field.image) {
            bindPreviewImageField(wrap, mod, field);
            return;
        }
        const el = wrap.querySelector(field.selector);
        if (!el) return;
        el.classList.add("preview-inline-edit");
        el.setAttribute("contenteditable", "true");
        el.setAttribute("spellcheck", "true");
        el.dataset.editProp = field.prop;
        el.title = "Direkt bearbeiten";
        el.addEventListener("click", (e) => e.stopPropagation());
        el.addEventListener("input", () => {
            mod.props[field.prop] = readPreviewEditableText(el, field);
            syncPropertyField(field.prop, mod.props[field.prop]);
        });
        el.addEventListener("keydown", (e) => {
            if (!field.multiline && e.key === "Enter") {
                e.preventDefault();
                el.blur();
            }
        });
    });
}

function readPreviewEditableText(el, field) {
    let text = field.multiline ? el.innerText : el.innerText.trim();
    if (field.prop === "text" && modHasQuoteWrapper(el)) {
        text = text.replace(/^[„"']+|[„"']+$/g, "").trim();
    }
    return text;
}

function modHasQuoteWrapper(el) {
    return el.classList.contains("mod-quote-text");
}

function bindPreviewImageField(wrap, mod, field) {
    if (field.bgImage) {
        const el = wrap.querySelector(field.selector);
        if (!el) return;
        el.classList.add("preview-editable-image-bg");
        el.title = "Klicken: Bild aus Galerie";
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            pickPreviewImage(mod, field.prop);
        });
        bindImageDrop(el, mod, field.prop, true);
        return;
    }
    const img = wrap.querySelector(field.selector);
    if (!img) return;
    img.classList.add("preview-editable-image");
    img.title = "Klicken: Galerie · Bild hierher ziehen";
    img.addEventListener("click", (e) => {
        e.stopPropagation();
        pickPreviewImage(mod, field.prop);
    });
    bindImageDrop(img, mod, field.prop);
}

function bindImageDrop(el, mod, prop, isBg) {
    el.addEventListener("dragover", (e) => {
        if (e.dataTransfer.types.includes("application/kg-media")) {
            e.preventDefault();
            el.classList.add("drag-over");
        }
    });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.remove("drag-over");
        const payload = typeof parseMediaDragPayload === "function"
            ? parseMediaDragPayload(e.dataTransfer.getData("application/kg-media"))
            : null;
        if (!payload?.src) return;
        mod.props[prop] = payload.src;
        syncPropertyField(prop, payload.src);
        renderPreview();
    });
}

function pickPreviewImage(mod, prop) {
    if (typeof openMediaPicker !== "function") return;
    openMediaPicker((payload) => {
        mod.props[prop] = payload.src;
        syncPropertyField(prop, payload.src);
        renderPreview();
    });
}

function syncPropertyField(prop, value) {
    const el = document.getElementById(`prop-${prop}`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = !!value;
    else el.value = value ?? "";
    if (typeof updateMediaFieldPreview === "function") updateMediaFieldPreview(el.id);
}

function bindLivePropertySync(mod, def) {
    if (canvasView !== "preview") return;
    const bind = (field, id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const handler = () => {
            mod.props[field.key] = readField(field, id);
            renderPreview();
        };
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);
    };
    (def.fields || []).forEach((field) => bind(field, `prop-${field.key}`));
    (LAYOUT_FIELDS || []).forEach((field) => bind(field, `prop-${field.key}`));
}

function findModulePath(modules, modId, parentPath = []) {
    for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const path = [...parentPath, i];
        if (mod.id === modId) return path;
        if (mod.children?.length) {
            const child = findModulePath(mod.children, modId, path);
            if (child) return child;
        }
    }
    return null;
}

function setCanvasView(view) {
    canvasView = view;
    const isPreview = view === "preview";
    document.body.classList.toggle("builder-preview-active", isPreview);
    document.getElementById("moduleCanvas").style.display = isPreview ? "none" : "block";
    document.getElementById("modulePalette").style.display = isPreview ? "none" : "flex";
    document.getElementById("livePreview").style.display = isPreview ? "block" : "none";
    document.querySelectorAll(".view-toggle button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === view);
    });
    if (isPreview) {
        renderPreview();
        document.getElementById("livePreview").scrollTop = 0;
    }
}

function renderPages() {
    const root = document.getElementById("pagesList");
    root.innerHTML = site.pages.map((page) => {
        const isLegal = page.id === "impressum" || page.id === "datenschutz";
        const badge = isLegal ? `<span class="page-legal-badge" title="Rechtstext – im Builder pflegbar">⚖️</span>` : "";
        return `
        <div class="page-item ${page.id === currentPageId ? "active" : ""} ${isLegal ? "page-item-legal" : ""}" data-page-id="${page.id}">
            <div><strong>${badge}${escapeHtml(page.navLabel || page.title)}</strong><br><small>${escapeHtml(page.path || "")}</small></div>
        </div>`;
    }).join("");

    root.querySelectorAll(".page-item").forEach((el) => {
        el.addEventListener("click", () => {
            currentPageId = el.dataset.pageId;
            selectedPath = null;
            renderAll();
        });
    });
}

function renderPalette() {
    const root = document.getElementById("modulePalette");
    const groups = [
        { label: "Basis", types: ["hero", "heroKompakt", "text", "banner", "trennlinie", "spacer"] },
        { label: "Inhalt", types: ["cards", "icons", "split", "gallery", "slideshow", "image", "video", "zitat", "testimonials", "zahlen", "timeline", "checkliste", "hinweis", "tabs", "preisliste"] },
        { label: "Daten", types: ["team", "gruppen", "news", "aktuell", "kalender", "speiseplan", "kontakt", "karte", "oeffnungszeiten", "downloads", "partner"] },
        { label: "Aktion", types: ["cta", "buttons", "ablauf", "accordion"] },
        { label: "Layout", types: ["section", "columns"] }
    ];

    root.innerHTML = groups.map((group) => `
        <div class="palette-group">
            <span class="palette-group-label">${group.label}</span>
            ${group.types.filter((t) => MODULE_TYPES[t]).map((type) => {
                const def = MODULE_TYPES[type];
                return `<div class="palette-chip" draggable="true" data-new-type="${type}" title="Klicken: Vorschau · Ziehen: Einfügen">${def.icon} ${def.label}</div>`;
            }).join("")}
        </div>
    `).join("");

    root.querySelectorAll(".palette-chip").forEach((chip) => {
        let dragged = false;

        chip.addEventListener("dragstart", (e) => {
            dragged = true;
            e.dataTransfer.setData("text/new-type", chip.dataset.newType);
            e.dataTransfer.effectAllowed = "copy";
        });

        chip.addEventListener("dragend", () => {
            setTimeout(() => { dragged = false; }, 150);
        });

        chip.addEventListener("click", (e) => {
            if (dragged) return;
            e.preventDefault();
            openModuleInfoModal(chip.dataset.newType);
        });
    });
}

function openModuleInfoModal(type) {
    const modal = document.getElementById("moduleInfoModal");
    if (!modal || !MODULE_TYPES[type]) return;

    const meta = getModuleMeta(type);
    document.getElementById("moduleInfoIcon").textContent = meta.icon;
    document.getElementById("moduleInfoTitle").textContent = meta.label;
    document.getElementById("moduleInfoDesc").textContent = meta.description;
    document.getElementById("moduleInfoUsage").textContent = meta.usage;

    const tags = [];
    if (meta.canHaveChildren) tags.push("📦 Untermodule möglich");
    if (meta.hasSubItems) tags.push("📋 Unterelemente pflegbar");
    tags.push("↔️ Größe & Layout einstellbar");
    document.getElementById("moduleInfoTags").innerHTML = tags.map((t) => `<li>${t}</li>`).join("");

    const previewRoot = document.getElementById("moduleInfoPreview");
    const previewMod = createPreviewModule(type);
    previewRoot.innerHTML = previewMod ? renderModule(previewMod, site) : "";
    if (typeof applyThemeToElement === "function") {
        applyThemeToElement(previewRoot, getResolvedTheme(site));
    }
    initPageCarousels(previewRoot);
    initPageTabs(previewRoot);

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModuleInfoModal() {
    const modal = document.getElementById("moduleInfoModal");
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function bindModuleInfoModal() {
    document.addEventListener("click", (e) => {
        const modal = document.getElementById("moduleInfoModal");
        if (!modal || modal.hidden) return;
        if (e.target.closest("[data-close-modal]")) {
            e.preventDefault();
            closeModuleInfoModal();
        }
    });
    document.addEventListener("keydown", (e) => {
        const modal = document.getElementById("moduleInfoModal");
        if (!modal || modal.hidden) return;
        if (e.key === "Escape") closeModuleInfoModal();
    });
}

function renderCanvasModules(modules, parentPath = []) {
    const key = pathKey(parentPath);
    if (!modules?.length) {
        return `${dropSlot(parentPath, 0)}<div class="canvas-empty drop-zone" data-drop-path="${key}" data-drop-index="0">Module hierher ziehen</div>`;
    }

    let html = dropSlot(parentPath, 0);
    html += modules.map((mod, index) => {
        const path = [...parentPath, index];
        const pathStr = pathKey(path);
        const def = MODULE_TYPES[mod.type] || { label: mod.type, icon: "?" };
        const selected = selectedPath && pathKey(selectedPath) === pathStr ? "selected" : "";
        const childrenHtml = def.canHaveChildren
            ? `<div class="canvas-children">
                ${renderCanvasModules(mod.children || [], path)}
               </div>`
            : "";

        return `
            <div class="canvas-module ${selected}" data-path="${pathStr}">
                <div class="canvas-module-head" draggable="true" data-drag-path="${pathStr}">
                    <span>${def.icon} ${escapeHtml(def.label)}</span>
                    <div class="canvas-module-actions">
                        <button type="button" title="Nach oben" data-move-up="${pathStr}">↑</button>
                        <button type="button" title="Nach unten" data-move-down="${pathStr}">↓</button>
                        <button type="button" data-select="${pathStr}">✎</button>
                        <button type="button" data-delete="${pathStr}">✕</button>
                    </div>
                </div>
                ${childrenHtml}
            </div>
            ${dropSlot(parentPath, index + 1)}`;
    }).join("");
    return html;
}

function renderCanvas() {
    const page = getPage();
    document.getElementById("canvasTitle").textContent = `Seite: ${page?.title || ""}`;
    const canvas = document.getElementById("moduleCanvas");
    canvas.innerHTML = `<div class="canvas-list">${renderCanvasModules(page?.modules || [])}</div>`;

    canvas.querySelectorAll("[data-move-up]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            moveModule(parsePath(btn.dataset.moveUp), -1);
        });
    });

    canvas.querySelectorAll("[data-move-down]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            moveModule(parsePath(btn.dataset.moveDown), 1);
        });
    });

    canvas.querySelectorAll("[data-select]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedPath = parsePath(btn.dataset.select);
            renderCanvas();
            renderProperties();
            if (canvasView === "preview") renderPreview();
        });
    });

    canvas.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!confirm("Modul löschen?")) return;
            removeAtPath(parsePath(btn.dataset.delete));
            selectedPath = null;
            renderCanvas();
            renderProperties();
        });
    });

    canvas.querySelectorAll("[data-drag-path]").forEach((head) => {
        head.addEventListener("dragstart", (e) => {
            dragPath = parsePath(head.dataset.dragPath);
            e.dataTransfer.setData("text/drag-path", head.dataset.dragPath);
            e.dataTransfer.effectAllowed = "move";
        });
    });

    canvas.querySelectorAll(".drop-slot, .canvas-empty").forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
            if (e.dataTransfer.types.includes("text/item-drag")) return;
            e.preventDefault();
            zone.classList.add("drag-over");
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.classList.remove("drag-over");
            handleDrop(e, zone.dataset.dropPath, Number(zone.dataset.dropIndex));
        });
    });
}

function moveModule(path, direction) {
    const list = getListByPath(path);
    if (!list) return;
    const index = path[path.length - 1];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;
    const [mod] = list.splice(index, 1);
    list.splice(newIndex, 0, mod);
    selectedPath = [...path.slice(0, -1), newIndex];
    refreshAfterChange();
}

function handleDrop(e, targetPathKey, dropIndex = 0) {
    if (e.dataTransfer.getData("text/item-drag")) return;
    const newType = e.dataTransfer.getData("text/new-type");
    const dragPathKey = e.dataTransfer.getData("text/drag-path");
    const targetPath = parsePath(targetPathKey);

    if (newType) {
        const mod = createModule(newType);
        if (!mod) return;
        const list = getListByPath(targetPath);
        if (!list) return;
        list.splice(dropIndex, 0, mod);
        selectedPath = [...targetPath, dropIndex];
        refreshAfterChange();
        return;
    }

    if (dragPathKey) {
        const from = parsePath(dragPathKey);
        const fromParent = from.slice(0, -1);
        const fromIndex = from[from.length - 1];
        const targetParentKey = pathKey(targetPath);
        const fromParentKey = pathKey(fromParent);

        if (fromParentKey === targetParentKey && fromIndex === dropIndex) return;
        if (isAncestorPath(from, [...targetPath, dropIndex])) return;

        const mod = getModuleByPath(from);
        if (!mod) return;
        removeAtPath(from);

        let insertIndex = dropIndex;
        if (fromParentKey === targetParentKey && fromIndex < dropIndex) insertIndex--;

        const list = getListByPath(targetPath);
        if (!list) return;
        list.splice(insertIndex, 0, mod);
        selectedPath = [...targetPath, insertIndex];
        refreshAfterChange();
    }
}

function moveSubItem(modulePath, fromIndex, toIndex) {
    const mod = getModuleByPath(modulePath);
    const def = MODULE_TYPES[mod?.type];
    if (!mod || !def?.itemsKey) return;
    const items = mod.props[def.itemsKey];
    if (!items || fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= items.length || toIndex > items.length) return;
    const [item] = items.splice(fromIndex, 1);
    const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
    items.splice(insertAt, 0, item);
    renderProperties();
    renderPreview();
}

function bindItemDragDrop(modulePath) {
    const pathKeyStr = pathKey(modulePath);

    document.querySelectorAll(`[data-item-drag="${pathKeyStr}"]`).forEach((el) => {
        el.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            e.dataTransfer.setData("text/item-drag", `${pathKeyStr}:${el.dataset.itemDragIndex}`);
            e.dataTransfer.effectAllowed = "move";
        });
    });

    document.querySelectorAll(".item-drop-slot").forEach((slot) => {
        if (slot.dataset.itemPath !== pathKeyStr) return;
        slot.addEventListener("dragover", (e) => {
            if (!e.dataTransfer.types.includes("text/item-drag")) return;
            e.preventDefault();
            slot.classList.add("drag-over");
        });
        slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
        slot.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            slot.classList.remove("drag-over");
            const raw = e.dataTransfer.getData("text/item-drag");
            if (!raw) return;
            const colon = raw.lastIndexOf(":");
            const pKey = raw.slice(0, colon);
            const fromStr = raw.slice(colon + 1);
            if (pKey !== pathKeyStr) return;
            moveSubItem(modulePath, Number(fromStr), Number(slot.dataset.itemIndex));
        });
    });
}

function renderDraggableItems(mod, def, modulePath) {
    const items = mod.props[def.itemsKey] || [];
    const pathKeyStr = pathKey(modulePath);
    let html = `<div class="props-items"><h4>Unterelemente <small>(ziehen zum Umordnen)</small></h4>`;
    html += itemDropSlot(modulePath, 0);
    items.forEach((item, i) => {
        const label = item.title || item.src || item.time || item.name || `Element ${i + 1}`;
        html += `<div class="props-item draggable-item">
            <div class="props-item-head">
                <span class="drag-handle" draggable="true" data-item-drag="${pathKeyStr}" data-item-drag-index="${i}" title="Ziehen">⋮⋮ ${escapeHtml(String(label).slice(0, 40))}</span>
                <button type="button" data-remove-item="${i}">✕</button>
            </div>`;
        def.itemFields.forEach((field) => {
            const id = `item-${i}-${field.key}`;
            html += `<div class="props-field"><label>${field.label}</label>${fieldInput(field, item[field.key], id)}</div>`;
        });
        html += `</div>${itemDropSlot(modulePath, i + 1)}`;
    });
    html += `<button type="button" class="btn-add" id="addItemBtn">+ Unterelement</button></div>`;
    return html;
}

function fieldInput(field, value, id) {
    if (isImageField(field)) return renderMediaFieldInput(id, value, field.label);
    if (field.type === "textarea") return `<textarea id="${id}">${escapeHtml(value ?? "")}</textarea>`;
    if (field.type === "checkbox") return `<label><input type="checkbox" id="${id}" ${value ? "checked" : ""}> Ja</label>`;
    if (field.type === "select") {
        const opts = (field.options || []).map((o) => `<option value="${o}" ${String(o) === String(value ?? "") ? "selected" : ""}>${o}</option>`).join("");
        return `<select id="${id}">${opts}</select>`;
    }
    if (field.type === "number") return `<input type="number" id="${id}" value="${value ?? ""}">`;
    return `<input type="text" id="${id}" value="${escapeAttr(value ?? "")}">`;
}

function readField(field, id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if (field.type === "checkbox") return el.checked;
    if (field.type === "number") return Number(el.value);
    return el.value;
}

function renderPageProperties() {
    const page = getPage();
    if (!page) return "<p>Keine Seite ausgewählt.</p>";
    return `
        <h3>📄 Seiteneinstellungen</h3>
        ${field("Seitentitel", "page-title", page.title)}
        ${field("Navigationstext", "page-navLabel", page.navLabel || page.title)}
        ${field("URL / Pfad", "page-path", page.path || `seite.html?p=${page.id}`)}
        <div class="props-field"><label><input type="checkbox" id="page-inNav" ${page.inNav !== false ? "checked" : ""}> In Navigation anzeigen</label></div>
        <p class="field-hint">Neue Zusatzseiten: Pfad z. B. <code>seite.html?p=meine-seite</code>. Feste Seiten (Start, Kontakt …) behalten ihre .html-Datei.</p>
        <button type="button" class="btn primary" id="applyPageBtn" style="margin-top:12px;width:100%">Seite speichern</button>`;
}

function bindPageProperties() {
    document.getElementById("applyPageBtn")?.addEventListener("click", () => {
        const page = getPage();
        if (!page) return;
        page.title = document.getElementById("page-title").value;
        page.navLabel = document.getElementById("page-navLabel").value;
        page.path = document.getElementById("page-path").value;
        page.inNav = document.getElementById("page-inNav").checked;
        saveSite(site);
        showStatus("Seiteneinstellungen gespeichert.");
        renderPages();
    });
}

function renderProperties() {
    const root = document.getElementById("propertiesPanel");
    if (!selectedPath) {
        root.innerHTML = renderPageProperties();
        bindPageProperties();
        return;
    }

    const mod = getModuleByPath(selectedPath);
    const def = MODULE_TYPES[mod?.type];
    if (!mod || !def) {
        root.innerHTML = "<p>Modul nicht gefunden.</p>";
        return;
    }

    let html = `<button type="button" class="btn soft" id="deselectBtn" style="margin-bottom:10px;width:100%">← Seiteneinstellungen</button>`;
    if (canvasView === "preview") {
        html += `<p class="preview-props-hint">Live-Vorschau: Klicken Sie Texte direkt an oder ändern Sie Felder hier – die Vorschau aktualisiert sich sofort.</p>`;
    }
    html += `<h3>${def.icon} ${def.label}</h3>`;
    (def.fields || []).forEach((field) => {
        const id = `prop-${field.key}`;
        html += `<div class="props-field"><label>${field.label}</label>${fieldInput(field, mod.props[field.key], id)}</div>`;
    });

    html += `<div class="props-layout"><h4>Größe & Layout</h4>`;
    (LAYOUT_FIELDS || []).forEach((field) => {
        const id = `prop-${field.key}`;
        html += `<div class="props-field"><label>${field.label}</label>${fieldInput(field, mod.props[field.key] ?? LAYOUT_DEFAULTS[field.key], id)}</div>`;
    });
    html += `</div>`;

    if (def.itemsKey && def.itemFields) {
        html += renderDraggableItems(mod, def, selectedPath);
    }

    html += `<button type="button" class="btn primary" id="applyPropsBtn" style="margin-top:12px;width:100%">${canvasView === "preview" ? "Unterelemente speichern" : "Änderungen übernehmen"}</button>`;
    root.innerHTML = html;

    document.getElementById("deselectBtn")?.addEventListener("click", () => {
        selectedPath = null;
        renderCanvas();
        renderProperties();
        if (canvasView === "preview") renderPreview();
    });

    document.getElementById("applyPropsBtn")?.addEventListener("click", () => {
        (def.fields || []).forEach((field) => {
            mod.props[field.key] = readField(field, `prop-${field.key}`);
        });
        (LAYOUT_FIELDS || []).forEach((field) => {
            mod.props[field.key] = readField(field, `prop-${field.key}`);
        });
        if (def.itemsKey && def.itemFields) {
            mod.props[def.itemsKey] = (mod.props[def.itemsKey] || []).map((item, i) => {
                const next = { ...item };
                def.itemFields.forEach((field) => {
                    next[field.key] = readField(field, `item-${i}-${field.key}`);
                });
                return next;
            });
        }
        showStatus("Modul aktualisiert.");
        refreshAfterChange();
    });

    document.getElementById("addItemBtn")?.addEventListener("click", () => {
        const itemDef = {};
        def.itemFields.forEach((f) => { itemDef[f.key] = ""; });
        mod.props[def.itemsKey].push(itemDef);
        renderProperties();
    });

    root.querySelectorAll("[data-remove-item]").forEach((btn) => {
        btn.addEventListener("click", () => {
            mod.props[def.itemsKey].splice(Number(btn.dataset.removeItem), 1);
            renderProperties();
            renderPreview();
        });
    });

    if (def.itemsKey) bindItemDragDrop(selectedPath);
    bindMediaFieldInputs(root);
    bindLivePropertySync(mod, def);
}

function isImageFieldLabel(label) {
    return /bild|avatar|logo|titelbild/i.test(label);
}

function field(label, id, value = "", type = "text") {
    if (type === "text" && isImageFieldLabel(label)) {
        return `<div class="props-field"><label>${label}</label>${renderMediaFieldInput(id, value, label)}</div>`;
    }
    const input = type === "textarea"
        ? `<textarea id="${id}">${escapeHtml(value)}</textarea>`
        : type === "color"
        ? `<input type="color" id="${id}" value="${value || "#000000"}">`
        : `<input type="text" id="${id}" value="${escapeAttr(value)}">`;
    return `<div class="props-field"><label>${label}</label>${input}</div>`;
}

function renderDesignPanel() {
    ensureSiteTheme(site);
    const theme = site.global.theme;
    const resolved = getResolvedTheme(site);
    const panel = document.getElementById("designPanel");
    const filteredPresets = designCategoryFilter === "alle"
        ? DESIGN_PRESETS
        : DESIGN_PRESETS.filter((p) => (p.category || "klassisch") === designCategoryFilter);

    panel.innerHTML = `
        <div class="design-layout">
            <div class="design-main">
                <h2>Referenz-Designs</h2>
                <p class="field-hint">${DESIGN_PRESETS.length} Farbkonzepte – wählen Sie eine Vorlage und passen Sie Deko, Animation und Farben an.</p>
                <div class="design-category-tabs">
                    ${DESIGN_CATEGORIES.map((cat) => `
                        <button type="button" class="${designCategoryFilter === cat.id ? "active" : ""}" data-design-cat="${cat.id}">${escapeHtml(cat.label)}</button>
                    `).join("")}
                </div>
                <div class="design-presets">${filteredPresets.map((preset) => `
                    <button type="button" class="design-preset-card ${theme.presetId === preset.id ? "active" : ""}" data-preset-id="${preset.id}">
                        <div class="design-preset-swatches">${preset.preview.map((c) => `<span style="background:${c}"></span>`).join("")}</div>
                        <strong>${escapeHtml(preset.name)}</strong>
                        <small>${escapeHtml(preset.description)}</small>
                    </button>
                `).join("")}</div>

                <h3 style="margin-top:20px">Hintergrund-Dekoration</h3>
                <p class="field-hint">Verschiedene Deko-Elemente für den Seitenhintergrund.</p>
                <div class="design-option-grid">
                    ${DECORATION_OPTIONS.map((opt) => `
                        <button type="button" class="design-option-card ${resolved.decoration === opt.id ? "active" : ""}" data-decoration-id="${opt.id}">
                            <span class="design-option-icon">${opt.icon}</span>
                            <strong>${escapeHtml(opt.name)}</strong>
                            <small>${escapeHtml(opt.description)}</small>
                        </button>
                    `).join("")}
                </div>

                <h3 style="margin-top:20px">Scroll-Animation</h3>
                <p class="field-hint">Wie Inhalte beim Scrollen erscheinen.</p>
                <div class="design-option-grid">
                    ${ANIMATION_OPTIONS.map((opt) => `
                        <button type="button" class="design-option-card ${resolved.pageAnimation === opt.id ? "active" : ""}" data-animation-id="${opt.id}">
                            <span class="design-option-icon">${opt.icon}</span>
                            <strong>${escapeHtml(opt.name)}</strong>
                            <small>${escapeHtml(opt.description)}</small>
                        </button>
                    `).join("")}
                </div>

                <div class="design-intensity-wrap">
                    <label>
                        <span>Animationsintensität</span>
                        <strong id="themeIntensityLabel">${escapeHtml(animationIntensityLabel(resolved.animationIntensity))} (${resolved.animationIntensity}%)</strong>
                    </label>
                    <input type="range" id="theme-animationIntensity" min="0" max="100" step="5" value="${resolved.animationIntensity}">
                    <div class="design-intensity-hints">
                        <span>Dezent</span>
                        <span>Normal (50)</span>
                        <span>Kräftig</span>
                    </div>
                    <p class="field-hint" style="margin-top:8px;margin-bottom:0">Steuert Bewegungsweite, Dauer und Stärke von Scroll-Animationen und Hintergrund-Deko.</p>
                </div>

                <details class="design-custom" open>
                    <summary><h3>Feineinstellungen (Farben & Ecken)</h3></summary>
                    <div class="design-custom-grid">
                        ${THEME_COLOR_KEYS.map((key) => {
                            const val = resolved.vars[key] || "#000000";
                            return field(key, `theme-color-${key}`, val, "color");
                        }).join("")}
                    </div>
                    <div class="design-options">
                        <div class="props-field">
                            <label>Ecken-Rundung</label>
                            <select id="theme-borderRadius">
                                <option value="soft" ${resolved.borderRadius === "soft" ? "selected" : ""}>Weich</option>
                                <option value="normal" ${resolved.borderRadius === "normal" ? "selected" : ""}>Normal</option>
                                <option value="sharp" ${resolved.borderRadius === "sharp" ? "selected" : ""}>Eckig</option>
                            </select>
                        </div>
                    </div>
                </details>
                <button type="button" class="btn primary" id="saveDesignBtn">Design speichern</button>
            </div>
            <aside class="design-preview-aside">
                <h3>Live-Vorschau</h3>
                <div class="design-sample" id="designSamplePreview">
                    <div class="design-sample-bg"></div>
                    <div class="design-sample-content">
                        <span class="badge">Willkommen</span>
                        <h2>Kindergarten Webereistraße</h2>
                        <p class="lead">So sieht Ihr gewähltes Design aus.</p>
                        <div class="btn-row">
                            <span class="btn primary">Kontakt</span>
                            <span class="btn soft">Mehr erfahren</span>
                        </div>
                        <div class="design-sample-cards">
                            <div class="card"><h4>Spielen</h4><p>Freiraum zum Entdecken.</p></div>
                            <div class="card"><h4>Lernen</h4><p>Mit Herz begleiten.</p></div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>`;

    panel.querySelectorAll("[data-design-cat]").forEach((btn) => {
        btn.addEventListener("click", () => {
            designCategoryFilter = btn.dataset.designCat;
            renderDesignPanel();
        });
    });

    panel.querySelectorAll(".design-preset-card").forEach((card) => {
        card.addEventListener("click", () => {
            const preset = getPresetById(card.dataset.presetId);
            theme.presetId = preset.id;
            theme.custom = {};
            theme.decoration = preset.defaultDecoration || (preset.showClouds ? "clouds" : "none");
            theme.pageAnimation = preset.defaultAnimation || "fade-up";
            theme.showClouds = theme.decoration === "clouds" ? true : theme.decoration === "none" ? false : null;
            renderDesignPanel();
            applyThemeToPreview(site);
            if (preset?.fontUrl) loadThemeFont(preset.fontUrl, preset.fontFamily);
        });
    });

    panel.querySelectorAll("[data-decoration-id]").forEach((card) => {
        card.addEventListener("click", () => {
            theme.decoration = card.dataset.decorationId;
            theme.showClouds = theme.decoration === "clouds" ? true : null;
            applyThemeToPreview(site);
            panel.querySelectorAll("[data-decoration-id]").forEach((c) => c.classList.toggle("active", c === card));
        });
    });

    panel.querySelectorAll("[data-animation-id]").forEach((card) => {
        card.addEventListener("click", () => {
            theme.pageAnimation = card.dataset.animationId;
            applyThemeToPreview(site);
            panel.querySelectorAll("[data-animation-id]").forEach((c) => c.classList.toggle("active", c === card));
        });
    });

    const intensityInput = document.getElementById("theme-animationIntensity");
    const intensityLabel = document.getElementById("themeIntensityLabel");
    intensityInput?.addEventListener("input", () => {
        theme.animationIntensity = clampAnimationIntensity(intensityInput.value);
        if (intensityLabel) {
            intensityLabel.textContent = `${animationIntensityLabel(theme.animationIntensity)} (${theme.animationIntensity}%)`;
        }
        applyThemeToPreview(site);
    });

    panel.querySelectorAll("[id^=theme-color-]").forEach((input) => {
        input.addEventListener("input", () => {
            const key = input.id.replace("theme-color-", "");
            theme.custom[key] = input.value;
            applyThemeToPreview(site);
        });
    });

    document.getElementById("theme-borderRadius")?.addEventListener("change", (e) => {
        theme.borderRadius = e.target.value;
        applyThemeToPreview(site);
    });

    document.getElementById("saveDesignBtn")?.addEventListener("click", () => {
        THEME_COLOR_KEYS.forEach((key) => {
            const el = document.getElementById(`theme-color-${key}`);
            if (el) theme.custom[key] = el.value;
        });
        theme.borderRadius = document.getElementById("theme-borderRadius")?.value || "";
        theme.animationIntensity = clampAnimationIntensity(document.getElementById("theme-animationIntensity")?.value);
        const preset = getPresetById(theme.presetId);
        const defaults = preset.vars;
        Object.keys(theme.custom).forEach((key) => {
            if (theme.custom[key] === defaults[key]) delete theme.custom[key];
        });
        saveSite(site);
        showStatus("Design gespeichert – Vorschau aktualisiert.");
        renderPreview();
    });

    applyThemeToPreview(site);
    const preset = getPresetById(theme.presetId);
    if (preset?.fontUrl) loadThemeFont(preset.fontUrl, preset.fontFamily);
}

function renderGlobalPanel() {
    ensureLayoutConfig(site);
    const g = site.global;
    const h = g.header || {};
    const f = g.footer || {};
    const team = g.team?.members || [];
    const gruppen = g.gruppen?.items || [];

    document.getElementById("globalPanel").innerHTML = `
        <div class="global-grid">
            <details class="global-section" open>
                <summary><h3>Website & Kontakt</h3></summary>
                ${field("Name (Seitentitel)", "g-siteName", g.siteName)}
                ${field("Adresse", "g-address", g.kontakt.address)}
                ${field("Telefon", "g-phone", g.kontakt.phoneDisplay)}
                ${field("E-Mail", "g-email", g.kontakt.email)}
            </details>

            <details class="global-section" open>
                <summary><h3>Header</h3></summary>
                ${field("Marke – Zeile 1", "gh-brandPrefix", g.brandPrefix)}
                ${field("Marke – Zeile 2 (hervorgehoben)", "gh-brandHighlight", g.brandHighlight)}
                ${field("Logo (optional, statt Text)", "gh-logo", h.logo || "")}
                ${field("Logo Alt-Text", "gh-logoAlt", h.logoAlt || "")}
                ${field("Logo-Link", "gh-brandLink", h.brandLink || "index.html")}
                <div class="props-field"><label><input type="checkbox" id="gh-showNav" ${h.showNavigation !== false ? "checked" : ""}> Navigation anzeigen</label></div>
                <div class="props-field"><label><input type="checkbox" id="gh-sticky" ${h.sticky !== false ? "checked" : ""}> Header fixiert (sticky)</label></div>
                ${field("Button-Text (optional)", "gh-ctaLabel", h.ctaLabel || "")}
                ${field("Button-Link", "gh-ctaLink", h.ctaLink || "")}
                <div class="props-field"><label>Button-Stil</label>
                    <select id="gh-ctaStyle">
                        <option value="soft" ${h.ctaStyle !== "primary" ? "selected" : ""}>Soft</option>
                        <option value="primary" ${h.ctaStyle === "primary" ? "selected" : ""}>Primary</option>
                    </select>
                </div>
            </details>

            <details class="global-section" open>
                <summary><h3>Footer</h3></summary>
                ${field("Copyright-Zeile", "gf-copyright", f.copyright || "")}
                ${field("Zusatzzeile (Träger / Einrichtung)", "gf-tagline", f.tagline || "")}
                ${field("Rechtlicher Hinweis (Footer)", "gf-legalNote", f.legalNote || "", "textarea")}
                <div class="props-field"><label><input type="checkbox" id="gf-showAdmin" ${f.showAdminLink !== false ? "checked" : ""}> Admin-Link anzeigen</label></div>
                ${field("Admin-Link Text", "gf-adminLabel", f.adminLinkLabel || "Inhalte pflegen")}
                <h4 style="margin:14px 0 8px;font-size:0.9rem">Footer-Links</h4>
                <p class="field-hint">Standard: Impressum, Datenschutz, Kontakt. Die <strong>Texte</strong> der Rechtsseiten bearbeiten Sie im Tab <strong>Seiten & Module</strong> (Seiten „Impressum“ und „Datenschutz“ – jeweils mehrere Textmodule).</p>
                <div id="globalFooterLinks">${renderGlobalFooterLinks(f.links || [])}</div>
                <button type="button" class="btn-add" id="addFooterLinkBtn">+ Footer-Link</button>
            </details>

            <details class="global-section">
                <summary><h3>Team (${team.length})</h3></summary>
                <div id="globalTeamList">${renderGlobalTeamList()}</div>
                <button type="button" class="btn-add" id="addTeamBtn">+ Person</button>
            </details>

            <details class="global-section">
                <summary><h3>Gruppen (${gruppen.length})</h3></summary>
                <div id="globalGruppenList">${renderGlobalGruppenList()}</div>
                <button type="button" class="btn-add" id="addGruppeBtn">+ Gruppe</button>
            </details>
            <p class="field-hint">News und Termine: Tab <strong>News & Termine</strong>. Rechtstexte (Impressum, Datenschutz): Tab <strong>Seiten & Module</strong> → Seite wählen → Module bearbeiten.</p>
        </div>
        <button type="button" class="btn primary" id="saveGlobalBtn" style="margin-top:16px">Alle globalen Daten speichern</button>`;

    document.getElementById("addFooterLinkBtn")?.addEventListener("click", () => {
        ensureLayoutConfig(site);
        site.global.footer.links.push({ id: uid("flink"), label: "Neuer Link", href: "", enabled: true });
        document.getElementById("globalFooterLinks").innerHTML = renderGlobalFooterLinks(site.global.footer.links);
        bindFooterLinkHandlers();
    });

    bindFooterLinkHandlers();
    bindMediaFieldInputs(document.getElementById("globalPanel"));

    document.getElementById("addTeamBtn")?.addEventListener("click", () => {
        g.team.members.push({ avatar: "images/avatars/placeholder.svg", name: "", position: "", gruppe: "", intro: "" });
        document.getElementById("globalTeamList").innerHTML = renderGlobalTeamList();
        bindGlobalRemoveHandlers();
        bindMediaFieldInputs(document.getElementById("globalTeamList"));
    });
    document.getElementById("addGruppeBtn")?.addEventListener("click", () => {
        g.gruppen.items.push({ name: "", ageRange: "", capacity: "", description: "", image: "" });
        document.getElementById("globalGruppenList").innerHTML = renderGlobalGruppenList();
        bindGlobalRemoveHandlers();
        bindMediaFieldInputs(document.getElementById("globalGruppenList"));
    });

    bindGlobalRemoveHandlers();
    document.getElementById("saveGlobalBtn").addEventListener("click", collectAndSaveGlobal);
}

function renderGlobalFooterLinks(links) {
    return links.map((link, i) => `
        <div class="global-item footer-link-item">
            <div class="global-item-head">
                <span>Link ${i + 1}</span>
                <div>
                    <label style="font-size:0.8rem;margin-right:8px"><input type="checkbox" id="gfl-enabled-${i}" ${link.enabled !== false ? "checked" : ""}> Aktiv</label>
                    <button type="button" data-remove-footer-link="${i}">✕</button>
                </div>
            </div>
            ${field("Bezeichnung", `gfl-label-${i}`, link.label)}
            ${field("URL / Pfad", `gfl-href-${i}`, link.href)}
        </div>`).join("");
}

function bindFooterLinkHandlers() {
    document.querySelectorAll("[data-remove-footer-link]").forEach((btn) => {
        btn.addEventListener("click", () => {
            collectGlobalHeaderFooter();
            site.global.footer.links.splice(Number(btn.dataset.removeFooterLink), 1);
            document.getElementById("globalFooterLinks").innerHTML = renderGlobalFooterLinks(site.global.footer.links);
            bindFooterLinkHandlers();
        });
    });
}

function collectGlobalHeaderFooter() {
    const g = site.global;
    ensureLayoutConfig(site);
    g.brandPrefix = document.getElementById("gh-brandPrefix")?.value || g.brandPrefix;
    g.brandHighlight = document.getElementById("gh-brandHighlight")?.value || g.brandHighlight;
    g.header.brandLink = document.getElementById("gh-brandLink")?.value || "index.html";
    g.header.logo = document.getElementById("gh-logo")?.value || "";
    g.header.logoAlt = document.getElementById("gh-logoAlt")?.value || "";
    g.header.showNavigation = document.getElementById("gh-showNav")?.checked ?? true;
    g.header.sticky = document.getElementById("gh-sticky")?.checked ?? true;
    g.header.ctaLabel = document.getElementById("gh-ctaLabel")?.value || "";
    g.header.ctaLink = document.getElementById("gh-ctaLink")?.value || "";
    g.header.ctaStyle = document.getElementById("gh-ctaStyle")?.value || "soft";
    g.footer.copyright = document.getElementById("gf-copyright")?.value || "";
    g.footer.tagline = document.getElementById("gf-tagline")?.value || "";
    g.footer.legalNote = document.getElementById("gf-legalNote")?.value || "";
    g.footer.showAdminLink = document.getElementById("gf-showAdmin")?.checked ?? true;
    g.footer.adminLinkLabel = document.getElementById("gf-adminLabel")?.value || "Inhalte pflegen";
    g.footer.links = (g.footer.links || []).map((_, i) => ({
        id: g.footer.links[i]?.id || uid("flink"),
        label: document.getElementById(`gfl-label-${i}`)?.value || "",
        href: document.getElementById(`gfl-href-${i}`)?.value || "",
        enabled: document.getElementById(`gfl-enabled-${i}`)?.checked ?? true
    }));
}

function globalFieldSelect(label, id, options, selected = "") {
    const opts = options.map((o) => `<option value="${escapeAttr(o.value)}" ${o.value === selected ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("");
    return `<div class="props-field"><label>${label}</label><select id="${id}">${opts}</select></div>`;
}

function renderGlobalTeamList() {
    return (site.global.team?.members || []).map((m, i) => `
        <div class="global-item">
            <div class="global-item-head"><span>Person ${i + 1}</span><button type="button" data-remove-team="${i}">✕</button></div>
            ${field("Name", `gt-name-${i}`, m.name)}
            ${field("Position", `gt-position-${i}`, m.position)}
            ${globalFieldSelect("Gruppe", `gt-gruppe-${i}`, getGruppeOptions(), m.gruppe || "")}
            ${field("Avatar", `gt-avatar-${i}`, m.avatar)}
            ${field("Vorstellung", `gt-intro-${i}`, m.intro, "textarea")}
        </div>`).join("");
}

function renderGlobalGruppenList() {
    return (site.global.gruppen?.items || []).map((gr, i) => `
        <div class="global-item">
            <div class="global-item-head"><span>Gruppe ${i + 1}</span><button type="button" data-remove-gruppe="${i}">✕</button></div>
            ${field("Name", `gg-name-${i}`, gr.name)}
            ${field("Alter", `gg-age-${i}`, gr.ageRange)}
            ${field("Kapazität", `gg-capacity-${i}`, gr.capacity)}
            ${field("Bild", `gg-image-${i}`, gr.image)}
            ${field("Beschreibung", `gg-desc-${i}`, gr.description, "textarea")}
        </div>`).join("");
}

function renderGlobalNewsList() {
    return (site.global.news?.items || []).map((n, i) => `
        <div class="global-item">
            <div class="global-item-head"><span>News ${i + 1}</span><button type="button" data-remove-news="${i}">✕</button></div>
            ${field("ID (URL)", `gn-id-${i}`, n.id)}
            ${field("Datum", `gn-date-${i}`, n.date)}
            ${field("Titel", `gn-title-${i}`, n.title)}
            ${field("Titelbild", `gn-image-${i}`, n.image)}
            ${field("Kurztext", `gn-teaser-${i}`, n.teaser, "textarea")}
            ${field("Text", `gn-body-${i}`, n.body || "", "textarea")}
            ${field("Karussell-Bilder", `gn-images-${i}`, imagesToLines(n.images), "textarea")}
            ${field("Videos", `gn-videos-${i}`, videosToLines(n.videos), "textarea")}
        </div>`).join("");
}

function renderGlobalKalenderList() {
    return (site.global.kalender?.events || []).map((e, i) => `
        <div class="global-item">
            <div class="global-item-head"><span>Termin ${i + 1}</span><button type="button" data-remove-event="${i}">✕</button></div>
            ${field("ID", `ge-id-${i}`, e.id)}
            ${field("Datum (YYYY-MM-DD)", `ge-date-${i}`, e.date)}
            ${field("Uhrzeit", `ge-time-${i}`, e.time || "")}
            ${field("Kategorie", `ge-category-${i}`, e.category || "")}
            ${field("Titel", `ge-title-${i}`, e.title)}
            ${field("Kurzbeschreibung", `ge-desc-${i}`, e.description || "", "textarea")}
            ${field("Titelbild", `ge-image-${i}`, e.image || "")}
            ${field("Text", `ge-body-${i}`, e.body || "", "textarea")}
            ${field("Weitere Bilder", `ge-images-${i}`, imagesToLines(e.images), "textarea")}
        </div>`).join("");
}

function bindGlobalRemoveHandlers() {
    document.querySelectorAll("[data-remove-team]").forEach((btn) => {
        btn.addEventListener("click", () => {
            site.global.team.members.splice(Number(btn.dataset.removeTeam), 1);
            document.getElementById("globalTeamList").innerHTML = renderGlobalTeamList();
            bindGlobalRemoveHandlers();
        });
    });
    document.querySelectorAll("[data-remove-gruppe]").forEach((btn) => {
        btn.addEventListener("click", () => {
            site.global.gruppen.items.splice(Number(btn.dataset.removeGruppe), 1);
            document.getElementById("globalGruppenList").innerHTML = renderGlobalGruppenList();
            bindGlobalRemoveHandlers();
        });
    });
    document.querySelectorAll("[data-remove-news]").forEach((btn) => {
        btn.addEventListener("click", () => {
            site.global.news.items.splice(Number(btn.dataset.removeNews), 1);
            document.getElementById("globalNewsList").innerHTML = renderGlobalNewsList();
            bindGlobalRemoveHandlers();
        });
    });
    document.querySelectorAll("[data-remove-event]").forEach((btn) => {
        btn.addEventListener("click", () => {
            site.global.kalender.events.splice(Number(btn.dataset.removeEvent), 1);
            document.getElementById("globalKalenderList").innerHTML = renderGlobalKalenderList();
            bindGlobalRemoveHandlers();
        });
    });
}

function collectAndSaveGlobal() {
    const g = site.global;
    g.siteName = document.getElementById("g-siteName").value;
    g.kontakt.address = document.getElementById("g-address").value;
    g.kontakt.phoneDisplay = document.getElementById("g-phone").value;
    g.kontakt.phoneLink = `tel:${g.kontakt.phoneDisplay.replace(/\s/g, "")}`;
    g.kontakt.email = document.getElementById("g-email").value;
    g.kontakt.emailLink = `mailto:${g.kontakt.email}`;

    collectGlobalHeaderFooter();

    g.team.members = (g.team.members || []).map((_, i) => ({
        name: document.getElementById(`gt-name-${i}`)?.value || "",
        position: document.getElementById(`gt-position-${i}`)?.value || "",
        gruppe: document.getElementById(`gt-gruppe-${i}`)?.value || "",
        avatar: document.getElementById(`gt-avatar-${i}`)?.value || "",
        intro: document.getElementById(`gt-intro-${i}`)?.value || ""
    }));

    g.gruppen.items = (g.gruppen.items || []).map((_, i) => ({
        name: document.getElementById(`gg-name-${i}`)?.value || "",
        ageRange: document.getElementById(`gg-age-${i}`)?.value || "",
        capacity: document.getElementById(`gg-capacity-${i}`)?.value || "",
        image: document.getElementById(`gg-image-${i}`)?.value || "",
        description: document.getElementById(`gg-desc-${i}`)?.value || ""
    }));

    saveSite(site);
    showStatus("Globale Daten gespeichert.");
}

function renderAll() {
    renderPages();
    renderPalette();
    renderCanvas();
    renderProperties();
    renderPreview();
}

function addPage() {
    const title = prompt("Titel der neuen Seite:", "Neue Seite");
    if (!title) return;
    const id = slugify(title) || uid("page");
    const path = `seite.html?p=${id}`;
    site.pages.push({ id, title, navLabel: title, inNav: true, path, modules: [] });
    currentPageId = id;
    selectedPath = null;
    renderAll();
}

function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9äöüß]+/gi, "-").replace(/(^-|-$)/g, "");
}

document.getElementById("addPageBtn").addEventListener("click", addPage);

document.getElementById("deletePageBtn").addEventListener("click", () => {
    if (site.pages.length <= 1) return alert("Mindestens eine Seite muss bleiben.");
    if (!confirm("Seite wirklich löschen?")) return;
    site.pages = site.pages.filter((p) => p.id !== currentPageId);
    currentPageId = site.pages[0].id;
    selectedPath = null;
    renderAll();
});

document.getElementById("saveBtn").addEventListener("click", () => {
    saveSite(site);
    showStatus("Gespeichert – Vorschau in neuem Tab öffnen.");
});

document.getElementById("exportBtn").addEventListener("click", () => {
    saveSite(site);
    exportSiteJs(site);
    showStatus("site-data.js exportiert.");
});

document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Alle Builder-Daten zurücksetzen?")) return;
    clearSiteOverride();
    site = structuredClone(window.KG_SITE);
    currentPageId = site.pages[0].id;
    renderAll();
});

function switchMainTab(tabId) {
    const isBuilder = tabId === "builder";
    const isGlobal = tabId === "global";
    const isDesign = tabId === "design";
    const isContent = tabId === "content";
    const isMedia = tabId === "media";
    document.getElementById("builderMain").style.display = isBuilder ? "grid" : "none";
    document.getElementById("globalPanel").style.display = isGlobal ? "block" : "none";
    document.getElementById("designPanel").style.display = isDesign ? "block" : "none";
    document.getElementById("contentHubPanel").style.display = isContent ? "flex" : "none";
    document.getElementById("mediaGalleryPanel").style.display = isMedia ? "block" : "none";
    if (isGlobal) {
        renderGlobalPanel();
        bindMediaFieldInputs(document.getElementById("globalPanel"));
    }
    if (isDesign) renderDesignPanel();
    if (isContent && typeof renderContentHubPanel === "function") renderContentHubPanel();
    if (isMedia && typeof renderMediaGalleryPanel === "function") renderMediaGalleryPanel();
}

document.querySelectorAll(".tabs button").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tabs button").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        switchMainTab(tab.dataset.tab);
    });
});

document.getElementById("previewBtn").addEventListener("click", () => {
    saveSite(site);
    setCanvasView("preview");
});

document.getElementById("previewExternalBtn").addEventListener("click", () => {
    saveSite(site);
    const page = getPage();
    window.open(page?.path || `seite.html?p=${currentPageId}`, "_blank");
});

document.querySelectorAll(".view-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => setCanvasView(btn.dataset.view));
});

renderAll();
bindModuleInfoModal();

window.KG_ADMIN = {
    getSite: () => site,
    setSite: (s) => { site = s; },
    save: () => saveSite(site),
    refresh: () => renderPreview()
};
