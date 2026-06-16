const KG_STORAGE_KEY = "kg_content_override";

function loadContent() {
    const stored = localStorage.getItem(KG_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            localStorage.removeItem(KG_STORAGE_KEY);
        }
    }
    return window.KG_CONTENT || null;
}

function saveContent(content) {
    localStorage.setItem(KG_STORAGE_KEY, JSON.stringify(content));
}

function clearContentOverride() {
    localStorage.removeItem(KG_STORAGE_KEY);
}

function exportContentJs(content) {
    const body = `window.KG_CONTENT = ${JSON.stringify(content, null, 4)};\n`;
    const blob = new Blob([body], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "content.js";
    link.click();
    URL.revokeObjectURL(url);
}
