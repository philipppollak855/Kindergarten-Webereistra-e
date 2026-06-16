let mediaCurrentFolder = MEDIA_ROOT_ID;
let mediaViewMode = "grid";
let mediaSearch = "";
let mediaSelectedId = null;
let mediaPickerCallback = null;

function renderMediaFieldInput(id, value = "", label = "Bild") {
    const preview = value
        ? `<img class="media-field-thumb" src="${escapeAttr(value)}" alt="">`
        : `<span class="media-field-placeholder">🖼</span>`;
    return `<div class="media-field media-drop-target" data-media-target="${id}">
        <div class="media-field-preview">${preview}</div>
        <div class="media-field-inputs">
            <input type="text" id="${id}" value="${escapeAttr(value ?? "")}" placeholder="Pfad oder aus Galerie wählen">
            <div class="media-field-actions">
                <button type="button" class="btn soft media-pick-btn" data-media-pick="${id}">Galerie</button>
                <button type="button" class="btn soft media-clear-btn" data-media-clear="${id}" title="Leeren">✕</button>
            </div>
        </div>
    </div>`;
}

function updateMediaFieldPreview(inputId) {
    const wrap = document.querySelector(`[data-media-target="${inputId}"]`);
    const input = document.getElementById(inputId);
    if (!wrap || !input) return;
    const preview = wrap.querySelector(".media-field-preview");
    if (!preview) return;
    const val = input.value.trim();
    preview.innerHTML = val
        ? `<img class="media-field-thumb" src="${escapeAttr(val)}" alt="">`
        : `<span class="media-field-placeholder">🖼</span>`;
}

function bindMediaFieldInputs(root = document) {
    root.querySelectorAll("[data-media-pick]").forEach((btn) => {
        btn.addEventListener("click", () => {
            openMediaPicker((payload) => {
                const input = document.getElementById(btn.dataset.mediaPick);
                if (!input) return;
                input.value = payload.src || "";
                input.dispatchEvent(new Event("input", { bubbles: true }));
                updateMediaFieldPreview(btn.dataset.mediaPick);
            });
        });
    });

    root.querySelectorAll("[data-media-clear]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.mediaClear);
            if (!input) return;
            input.value = "";
            updateMediaFieldPreview(btn.dataset.mediaClear);
        });
    });

    root.querySelectorAll(".media-drop-target").forEach((zone) => {
        const inputId = zone.dataset.mediaTarget;
        zone.addEventListener("dragover", (e) => {
            if (e.dataTransfer.types.includes("application/kg-media")) {
                e.preventDefault();
                zone.classList.add("drag-over");
            }
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("drag-over");
            const raw = e.dataTransfer.getData("application/kg-media");
            const payload = parseMediaDragPayload(raw);
            if (!payload?.src) return;
            const input = document.getElementById(inputId);
            if (!input) return;
            input.value = payload.src;
            updateMediaFieldPreview(inputId);
        });
    });

    root.querySelectorAll(".media-field input[type='text']").forEach((input) => {
        input.addEventListener("input", () => updateMediaFieldPreview(input.id));
    });
}

function renderMediaGalleryPanel() {
    const panel = document.getElementById("mediaGalleryPanel");
    if (!panel) return;
    const site = window.KG_ADMIN?.getSite() || loadSite();
    ensureMediaLibrary(site);

    const breadcrumb = getFolderBreadcrumb(site, mediaCurrentFolder);
    const items = getFolderItems(site, mediaCurrentFolder, mediaSearch);
    const selected = items.find((i) => i.id === mediaSelectedId);

    panel.innerHTML = `
        <div class="media-gallery">
            <aside class="media-sidebar">
                <div class="media-sidebar-head">
                    <h2>🗂️ Ordner</h2>
                    <button type="button" class="btn soft" id="mediaNewFolderBtn" title="Neuer Ordner">+</button>
                </div>
                <div class="media-folder-tree" id="mediaFolderTree">${renderFolderTree(site, mediaCurrentFolder)}</div>
            </aside>
            <main class="media-main">
                <div class="media-toolbar">
                    <div class="media-breadcrumb">
                        ${breadcrumb.map((f, i) => `
                            <button type="button" class="media-crumb ${f.id === mediaCurrentFolder ? "active" : ""}" data-media-folder="${f.id}">${escapeHtml(f.name)}</button>
                            ${i < breadcrumb.length - 1 ? "<span>/</span>" : ""}`).join("")}
                    </div>
                    <div class="media-toolbar-actions">
                        <input type="search" id="mediaSearchInput" class="media-search" placeholder="Suchen…" value="${escapeAttr(mediaSearch)}">
                        <div class="media-view-toggle">
                            <button type="button" class="${mediaViewMode === "grid" ? "active" : ""}" data-media-view="grid" title="Kacheln">▦</button>
                            <button type="button" class="${mediaViewMode === "large" ? "active" : ""}" data-media-view="large" title="Große Kacheln">▣</button>
                            <button type="button" class="${mediaViewMode === "list" ? "active" : ""}" data-media-view="list" title="Liste">☰</button>
                        </div>
                        <label class="btn primary media-upload-btn">
                            Hochladen
                            <input type="file" id="mediaFileInput" accept="image/*" multiple hidden>
                        </label>
                        ${mediaCurrentFolder !== MEDIA_ROOT_ID ? `
                            <button type="button" class="btn soft" id="mediaRenameFolderBtn" title="Ordner umbenennen">✎</button>
                            <button type="button" class="btn soft" id="mediaDeleteFolderBtn" title="Leeren Ordner löschen">🗑</button>
                        ` : ""}
                    </div>
                </div>
                <div class="media-dropzone" id="mediaDropzone">
                    <div class="media-dropzone-hint">Bilder hierher ziehen zum Hochladen</div>
                    <div class="media-items media-view-${mediaViewMode}" id="mediaItemsGrid">
                        ${items.length ? items.map((item) => renderMediaItemCard(item, selected?.id === item.id)).join("") : `<div class="media-empty">Keine Medien in diesem Ordner. Dateien hineinziehen oder „Hochladen“.</div>`}
                    </div>
                </div>
            </main>
            <aside class="media-detail" id="mediaDetailPanel">
                ${selected ? renderMediaDetail(site, selected) : `<div class="media-detail-empty"><p>Medium auswählen zum Bearbeiten</p></div>`}
            </aside>
        </div>`;

    bindMediaGalleryEvents(site);
}

function renderMediaItemCard(item, active) {
  if (mediaViewMode === "list") {
    return `<div class="media-item media-item-list ${active ? "active" : ""}" data-media-item="${item.id}" draggable="true">
        <img src="${escapeAttr(item.src)}" alt="">
        <div class="media-item-info">
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(item.mime || "")}</small>
        </div>
        <button type="button" class="media-item-use" data-media-use="${item.id}" title="URL kopieren">📋</button>
    </div>`;
  }
  return `<article class="media-item media-item-tile ${active ? "active" : ""}" data-media-item="${item.id}" draggable="true">
        <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt)}">
        <div class="media-item-meta">
            <span title="${escapeAttr(item.name)}">${escapeHtml(item.name)}</span>
        </div>
    </article>`;
}

function renderMediaDetail(site, item) {
    const folders = site.global.media.folders.filter((f) => f.id !== item.folderId);
    return `
        <h3>Details</h3>
        <div class="media-detail-preview"><img src="${escapeAttr(item.src)}" alt=""></div>
        <div class="props-field"><label>Name</label><input type="text" id="mediaDetailName" value="${escapeAttr(item.name)}"></div>
        <div class="props-field"><label>Alt-Text</label><input type="text" id="mediaDetailAlt" value="${escapeAttr(item.alt || "")}"></div>
        <div class="props-field"><label>Ordner</label>
            <select id="mediaDetailFolder">
                ${folders.map((f) => `<option value="${f.id}" ${f.id === item.folderId ? "selected" : ""}>${escapeHtml(f.name)}</option>`).join("")}
            </select>
        </div>
        <div class="props-field"><label>Pfad / URL</label>
            <textarea id="mediaDetailSrc" rows="3" readonly>${escapeHtml(item.src.startsWith("data:") ? "(Hochgeladenes Bild – im Browser gespeichert)" : item.src)}</textarea>
        </div>
        <div class="media-detail-actions">
            <button type="button" class="btn primary" id="mediaDetailSave">Speichern</button>
            <button type="button" class="btn soft" id="mediaDetailCopy">Pfad kopieren</button>
            <button type="button" class="btn-danger" id="mediaDetailDelete">Löschen</button>
        </div>
        <p class="field-hint">Ziehen Sie Medien aus der Galerie in Modul-Einstellungen oder News-Editor.</p>`;
}

function bindMediaGalleryEvents(site) {
    document.getElementById("mediaNewFolderBtn")?.addEventListener("click", () => {
        const name = prompt("Ordnername:", "Neuer Ordner");
        if (!name) return;
        createMediaFolder(site, name, mediaCurrentFolder);
        window.KG_ADMIN?.save();
        renderMediaGalleryPanel();
    });

    document.getElementById("mediaRenameFolderBtn")?.addEventListener("click", () => {
        const folder = getMediaFolder(site, mediaCurrentFolder);
        if (!folder || folder.id === MEDIA_ROOT_ID) return;
        const name = prompt("Ordner umbenennen:", folder.name);
        if (!name) return;
        renameMediaFolder(site, folder.id, name);
        window.KG_ADMIN?.save();
        renderMediaGalleryPanel();
    });

    document.getElementById("mediaDeleteFolderBtn")?.addEventListener("click", () => {
        if (mediaCurrentFolder === MEDIA_ROOT_ID) return;
        if (!confirm("Leeren Ordner wirklich löschen?")) return;
        if (deleteMediaFolder(site, mediaCurrentFolder)) {
            mediaCurrentFolder = MEDIA_ROOT_ID;
            window.KG_ADMIN?.save();
            renderMediaGalleryPanel();
            showStatus("Ordner gelöscht.");
        } else {
            showStatus("Ordner ist nicht leer – zuerst Inhalte verschieben.");
        }
    });

    document.getElementById("mediaSearchInput")?.addEventListener("input", (e) => {
        mediaSearch = e.target.value;
        renderMediaGalleryPanel();
    });

    document.querySelectorAll("[data-media-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
            mediaViewMode = btn.dataset.mediaView;
            renderMediaGalleryPanel();
        });
    });

    document.querySelectorAll("[data-media-folder]").forEach((btn) => {
        btn.addEventListener("click", () => {
            mediaCurrentFolder = btn.dataset.mediaFolder;
            mediaSelectedId = null;
            renderMediaGalleryPanel();
        });
        btn.addEventListener("dragover", (e) => {
            e.preventDefault();
            btn.classList.add("drag-over");
        });
        btn.addEventListener("dragleave", () => btn.classList.remove("drag-over"));
        btn.addEventListener("drop", (e) => {
            e.preventDefault();
            btn.classList.remove("drag-over");
            handleGalleryDrop(site, e, btn.dataset.mediaFolder);
        });
    });

    document.querySelectorAll("[data-media-item]").forEach((el) => {
        el.addEventListener("click", (e) => {
            if (e.target.closest("[data-media-use]")) return;
            mediaSelectedId = el.dataset.mediaItem;
            renderMediaGalleryPanel();
        });
        el.addEventListener("dragstart", (e) => {
            const item = site.global.media.items.find((i) => i.id === el.dataset.mediaItem);
            if (!item) return;
            e.dataTransfer.setData("application/kg-media", mediaDragPayload(item));
            e.dataTransfer.effectAllowed = "copy";
        });
    });

    document.querySelectorAll("[data-folder-drag]").forEach((btn) => {
        btn.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            e.dataTransfer.setData("application/kg-folder", btn.dataset.folderDrag);
            e.dataTransfer.effectAllowed = "move";
        });
    });

    const fileInput = document.getElementById("mediaFileInput");
    fileInput?.addEventListener("change", async () => {
        const files = [...(fileInput.files || [])];
        if (!files.length) return;
        const added = await addMediaFromFiles(site, files, mediaCurrentFolder);
        window.KG_ADMIN?.save();
        fileInput.value = "";
        renderMediaGalleryPanel();
        showStatus(`${added.length} Bild(er) hochgeladen.`);
    });

    const dropzone = document.getElementById("mediaDropzone");
    dropzone?.addEventListener("dragover", (e) => {
        if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            dropzone.classList.add("drag-active");
        }
    });
    dropzone?.addEventListener("dragleave", (e) => {
        if (!dropzone.contains(e.relatedTarget)) dropzone.classList.remove("drag-active");
    });
    dropzone?.addEventListener("drop", async (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-active");
        if (e.dataTransfer.files?.length) {
            const added = await addMediaFromFiles(site, [...e.dataTransfer.files], mediaCurrentFolder);
            window.KG_ADMIN?.save();
            renderMediaGalleryPanel();
            showStatus(`${added.length} Bild(er) hochgeladen.`);
            return;
        }
        handleGalleryDrop(site, e, mediaCurrentFolder);
    });

    document.getElementById("mediaDetailSave")?.addEventListener("click", () => {
        if (!mediaSelectedId) return;
        renameMediaItem(site, mediaSelectedId, document.getElementById("mediaDetailName")?.value || "");
        updateMediaItemAlt(site, mediaSelectedId, document.getElementById("mediaDetailAlt")?.value || "");
        moveMediaItem(site, mediaSelectedId, document.getElementById("mediaDetailFolder")?.value || mediaCurrentFolder);
        window.KG_ADMIN?.save();
        renderMediaGalleryPanel();
        showStatus("Medium gespeichert.");
    });

    document.getElementById("mediaDetailDelete")?.addEventListener("click", () => {
        if (!mediaSelectedId || !confirm("Medium aus der Galerie entfernen? (Bereits eingebundene Bilder auf der Website bleiben unverändert.)")) return;
        deleteMediaItem(site, mediaSelectedId);
        mediaSelectedId = null;
        window.KG_ADMIN?.save();
        renderMediaGalleryPanel();
        showStatus("Medium entfernt.");
    });

    document.getElementById("mediaDetailCopy")?.addEventListener("click", () => {
        const item = site.global.media.items.find((i) => i.id === mediaSelectedId);
        if (!item?.src) return;
        navigator.clipboard?.writeText(item.src);
        showStatus("Pfad kopiert.");
    });

    document.querySelectorAll("[data-media-use]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = site.global.media.items.find((i) => i.id === btn.dataset.mediaUse);
            if (item?.src) navigator.clipboard?.writeText(item.src);
            showStatus("Pfad kopiert.");
        });
    });
}

function handleGalleryDrop(site, e, targetFolderId) {
    const folderDrag = e.dataTransfer.getData("application/kg-folder");
    if (folderDrag && folderDrag !== targetFolderId) {
        if (moveMediaFolder(site, folderDrag, targetFolderId)) {
            window.KG_ADMIN?.save();
            renderMediaGalleryPanel();
            showStatus("Ordner verschoben.");
        }
        return;
    }
    const mediaRaw = e.dataTransfer.getData("application/kg-media");
    const payload = parseMediaDragPayload(mediaRaw);
    if (payload?.id) {
        moveMediaItem(site, payload.id, targetFolderId);
        window.KG_ADMIN?.save();
        renderMediaGalleryPanel();
        showStatus("Medium verschoben.");
    }
}

function openMediaPicker(callback) {
    mediaPickerCallback = callback;
    const modal = document.getElementById("mediaPickerModal");
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    renderMediaPickerContent();
}

function closeMediaPicker() {
    const modal = document.getElementById("mediaPickerModal");
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    mediaPickerCallback = null;
}

function renderMediaPickerContent() {
    const body = document.getElementById("mediaPickerBody");
    if (!body) return;
    const site = window.KG_ADMIN?.getSite() || loadSite();
    ensureMediaLibrary(site);
    const items = getFolderItems(site, mediaCurrentFolder, mediaSearch);

    body.innerHTML = `
        <div class="media-picker-toolbar">
            <div class="media-breadcrumb">
                ${getFolderBreadcrumb(site, mediaCurrentFolder).map((f) => `
                    <button type="button" class="media-crumb" data-picker-folder="${f.id}">${escapeHtml(f.name)}</button>`).join("<span>/</span>")}
            </div>
            <input type="search" class="media-search" id="pickerSearch" placeholder="Suchen…" value="${escapeAttr(mediaSearch)}">
        </div>
        <div class="media-picker-grid">
            ${items.map((item) => `
                <button type="button" class="media-picker-item" data-picker-select="${item.id}">
                    <img src="${escapeAttr(item.src)}" alt="">
                    <span>${escapeHtml(item.name)}</span>
                </button>`).join("") || `<p class="media-empty">Keine Medien gefunden.</p>`}
        </div>`;

    body.querySelectorAll("[data-picker-folder]").forEach((btn) => {
        btn.addEventListener("click", () => {
            mediaCurrentFolder = btn.dataset.pickerFolder;
            renderMediaPickerContent();
        });
    });
    document.getElementById("pickerSearch")?.addEventListener("input", (e) => {
        mediaSearch = e.target.value;
        renderMediaPickerContent();
    });
    body.querySelectorAll("[data-picker-select]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = site.global.media.items.find((i) => i.id === btn.dataset.pickerSelect);
            if (item && mediaPickerCallback) {
                mediaPickerCallback({ src: item.src, alt: item.alt, name: item.name, id: item.id });
            }
            closeMediaPicker();
        });
    });
}

function bindMediaPickerModal() {
    document.addEventListener("click", (e) => {
        const modal = document.getElementById("mediaPickerModal");
        if (!modal || modal.hidden) return;
        if (e.target.closest("[data-close-picker]")) closeMediaPicker();
    });
    document.addEventListener("keydown", (e) => {
        const modal = document.getElementById("mediaPickerModal");
        if (!modal || modal.hidden) return;
        if (e.key === "Escape") closeMediaPicker();
    });
}

bindMediaPickerModal();

window.KG_MEDIA_UI = {
    renderMediaGalleryPanel,
    renderMediaFieldInput,
    bindMediaFieldInputs,
    openMediaPicker,
    updateMediaFieldPreview
};
