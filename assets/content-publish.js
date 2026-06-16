function parsePublishAt(item) {
    if (!item?.publishAt) return null;
    const d = new Date(item.publishAt);
    return Number.isNaN(d.getTime()) ? null : d;
}

function isPublished(item, now = new Date()) {
    const pub = parsePublishAt(item);
    if (!pub) return true;
    return now >= pub;
}

function publishStatus(item, now = new Date()) {
    if (!parsePublishAt(item)) return "live";
    return isPublished(item, now) ? "live" : "scheduled";
}

function publishStatusLabel(item) {
    const status = publishStatus(item);
    if (status === "scheduled") {
        const pub = parsePublishAt(item);
        const date = pub.toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = pub.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" });
        return `Geplant · ${date} um ${time}`;
    }
    if (item.showOnHomepage) return "Live · Startseite";
    return "Live";
}

function formatPublishAtInput(item) {
    if (!item?.publishAt) return "";
    const d = new Date(item.publishAt);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function filterPublished(items) {
    return (items || []).filter((item) => isPublished(item));
}

function getHomepageFeed(site) {
    const news = filterPublished(site.global?.news?.items || [])
        .filter((n) => n.showOnHomepage)
        .map((n) => ({ ...n, _feedType: "news" }));
    const events = filterPublished(site.global?.kalender?.events || [])
        .filter((e) => e.showOnHomepage)
        .map((e) => ({ ...e, _feedType: "event" }));
    return [...news, ...events].sort((a, b) => {
        const da = parsePublishAt(a) || new Date(a.date || 0);
        const db = parsePublishAt(b) || new Date(b.date || 0);
        return db - da;
    });
}

function shiftMonth(year, month, delta) {
    let m = month + delta;
    let y = year;
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    return { year: y, month: m };
}
