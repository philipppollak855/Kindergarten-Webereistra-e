const MEDIA_ROOT_ID = "media-root";
const IMAGE_FIELD_KEYS = new Set(["image", "src", "logo", "avatar"]);

function isImageField(field) {
    if (!field) return false;
    return field.type === "image" || IMAGE_FIELD_KEYS.has(field.key);
}

function ensureMediaLibrary(site) {
    if (!site?.global) return;
    const g = site.global;
    if (!g.media) {
        g.media = { folders: [], items: [] };
    }
    if (!g.media.folders?.length) {
        g.media.folders = [{ id: MEDIA_ROOT_ID, name: "Medien", parentId: null }];
    }
    if (!g.media.items) g.media.items = [];

    const known = new Set(g.media.items.map((i) => i.src).filter(Boolean));
    collectImagePathsFromSite(site).forEach((src) => {
        if (!src || known.has(src)) return;
        g.media.items.push({
            id: uid("media"),
            folderId: MEDIA_ROOT_ID,
            name: src.split("/").pop() || src,
            src,
            alt: "",
            mime: guessMime(src),
            createdAt: new Date().toISOString()
        });
        known.add(src);
    });
}

function collectImagePathsFromSite(site) {
    const paths = new Set();
    const add = (v) => {
        if (typeof v === "string" && v.trim()) paths.add(v.trim());
    };
    const walkModules = (mods) => {
        (mods || []).forEach((mod) => {
            const p = mod.props || {};
            add(p.image);
            add(p.src);
            (p.images || []).forEach((img) => add(img.src));
            (p.items || []).forEach((item) => {
                add(item.image);
                add(item.logo);
            });
            walkModules(mod.children);
        });
    };
    site.pages?.forEach((page) => walkModules(page.modules));
    site.global?.team?.members?.forEach((m) => add(m.avatar));
    site.global?.gruppen?.items?.forEach((g) => add(g.image));
    site.global?.news?.items?.forEach((n) => {
        add(n.image);
        (n.images || []).forEach((img) => add(img.src));
    });
    site.global?.kalender?.events?.forEach((e) => {
        add(e.image);
        (e.images || []).forEach((img) => add(img.src));
    });
    return [...paths];
}

function guessMime(src) {
    if (src.startsWith("data:")) return src.slice(5, src.indexOf(";")) || "image/*";
    const ext = (src.split(".").pop() || "").toLowerCase();
    const map = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };
    return map[ext] || "image/*";
}

function getMediaFolder(site, folderId) {
    return site.global.media.folders.find((f) => f.id === folderId);
}

function getChildFolders(site, parentId) {
    return site.global.media.folders
        .filter((f) => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

function getFolderItems(site, folderId, search = "") {
    const q = search.trim().toLowerCase();
    return site.global.media.items
        .filter((i) => i.folderId === folderId)
        .filter((i) => !q || i.name.toLowerCase().includes(q) || (i.alt || "").toLowerCase().includes(q) || (i.src || "").toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

function getFolderBreadcrumb(site, folderId) {
    const trail = [];
    let current = getMediaFolder(site, folderId);
    while (current) {
        trail.unshift(current);
        current = current.parentId ? getMediaFolder(site, current.parentId) : null;
    }
    return trail;
}

function createMediaFolder(site, name, parentId = MEDIA_ROOT_ID) {
    const folder = { id: uid("folder"), name: name.trim() || "Neuer Ordner", parentId: parentId || MEDIA_ROOT_ID };
    site.global.media.folders.push(folder);
    return folder;
}

function renameMediaFolder(site, folderId, name) {
    const folder = getMediaFolder(site, folderId);
    if (!folder || folderId === MEDIA_ROOT_ID) return false;
    folder.name = name.trim() || folder.name;
    return true;
}

function deleteMediaFolder(site, folderId) {
    if (folderId === MEDIA_ROOT_ID) return false;
    const childFolders = getChildFolders(site, folderId);
    const items = getFolderItems(site, folderId);
    if (childFolders.length || items.length) return false;
    site.global.media.folders = site.global.media.folders.filter((f) => f.id !== folderId);
    return true;
}

function moveMediaFolder(site, folderId, newParentId) {
    if (folderId === MEDIA_ROOT_ID || !newParentId) return false;
    if (folderId === newParentId) return false;
    const folder = getMediaFolder(site, folderId);
    if (!folder) return false;
    if (isFolderDescendant(site, folderId, newParentId)) return false;
    folder.parentId = newParentId;
    return true;
}

function isFolderDescendant(site, ancestorId, folderId) {
    let current = getMediaFolder(site, folderId);
    while (current?.parentId) {
        if (current.parentId === ancestorId) return true;
        current = getMediaFolder(site, current.parentId);
    }
    return false;
}

function addMediaItem(site, data) {
    const item = {
        id: uid("media"),
        folderId: data.folderId || MEDIA_ROOT_ID,
        name: data.name || "Bild",
        src: data.src || "",
        alt: data.alt || "",
        mime: data.mime || guessMime(data.src || ""),
        createdAt: new Date().toISOString()
    };
    site.global.media.items.push(item);
    return item;
}

function renameMediaItem(site, itemId, name) {
    const item = site.global.media.items.find((i) => i.id === itemId);
    if (!item) return false;
    item.name = name.trim() || item.name;
    return true;
}

function updateMediaItemAlt(site, itemId, alt) {
    const item = site.global.media.items.find((i) => i.id === itemId);
    if (!item) return false;
    item.alt = alt;
    return true;
}

function moveMediaItem(site, itemId, folderId) {
    const item = site.global.media.items.find((i) => i.id === itemId);
    if (!item || !getMediaFolder(site, folderId)) return false;
    item.folderId = folderId;
    return true;
}

function deleteMediaItem(site, itemId) {
    const idx = site.global.media.items.findIndex((i) => i.id === itemId);
    if (idx < 0) return false;
    site.global.media.items.splice(idx, 1);
    return true;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function addMediaFromFiles(site, files, folderId = MEDIA_ROOT_ID) {
    const added = [];
    for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const src = await readFileAsDataUrl(file);
        added.push(addMediaItem(site, {
            folderId,
            name: file.name,
            src,
            mime: file.type,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
        }));
    }
    return added;
}

function renderFolderTree(site, currentId) {
    const root = getMediaFolder(site, MEDIA_ROOT_ID);
    if (!root) return "";
    return renderFolderTreeNode(site, root, currentId, 0);
}

function renderFolderTreeNode(site, folder, currentId, depth) {
    const children = getChildFolders(site, folder.id);
    const active = folder.id === currentId ? "active" : "";
    const indent = depth * 14;
    let html = `<button type="button" class="media-folder-btn ${active}" data-media-folder="${folder.id}" style="padding-left:${12 + indent}px" draggable="true" data-folder-drag="${folder.id}">
        <span class="media-folder-icon">📂</span>
        <span>${escapeHtml(folder.name)}</span>
        <small>${getFolderItems(site, folder.id).length}</small>
    </button>`;
    children.forEach((child) => {
        html += renderFolderTreeNode(site, child, currentId, depth + 1);
    });
    return html;
}

function mediaDragPayload(item) {
    return JSON.stringify({ src: item.src, alt: item.alt || "", name: item.name, id: item.id });
}

function parseMediaDragPayload(raw) {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

window.KG_MEDIA = {
    MEDIA_ROOT_ID,
    isImageField,
    ensureMediaLibrary,
    getMediaFolder,
    getChildFolders,
    getFolderItems,
    getFolderBreadcrumb,
    createMediaFolder,
    renameMediaFolder,
    deleteMediaFolder,
    moveMediaFolder,
    moveMediaItem,
    addMediaItem,
    addMediaFromFiles,
    renameMediaItem,
    updateMediaItemAlt,
    deleteMediaItem,
    mediaDragPayload,
    parseMediaDragPayload,
    renderFolderTree,
    renderFolderTreeNode
};
