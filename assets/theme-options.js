const DECORATION_OPTIONS = [
    { id: "none", name: "Keine", icon: "⬜", description: "Schlichter Hintergrund ohne Deko." },
    { id: "clouds", name: "Wolken", icon: "☁️", description: "Schwebende Wolken am Himmel." },
    { id: "bubbles", name: "Blasen", icon: "🫧", description: "Leicht aufsteigende Seifenblasen." },
    { id: "stars", name: "Sterne", icon: "✨", description: "Funkelnde Sterne und Glitzer." },
    { id: "leaves", name: "Blätter", icon: "🍃", description: "Sanft fallende Blätter." },
    { id: "dots", name: "Punkte", icon: "⚪", description: "Verspieltes Punktemuster im Hintergrund." },
    { id: "sunrays", name: "Sonnenstrahlen", icon: "☀️", description: "Warme Lichtstrahlen von oben." },
    { id: "waves", name: "Wellen", icon: "🌊", description: "Sanfte Wellen am unteren Rand." }
];

const ANIMATION_OPTIONS = [
    { id: "none", name: "Keine", icon: "—", description: "Inhalte erscheinen ohne Animation." },
    { id: "fade-up", name: "Von unten", icon: "↑", description: "Sanft von unten einblenden." },
    { id: "fade-in", name: "Einblenden", icon: "○", description: "Weich und dezent erscheinen." },
    { id: "slide-in", name: "Hereinschieben", icon: "→", description: "Seitlich hereingleiten." },
    { id: "scale-in", name: "Heranzoomen", icon: "⊕", description: "Leicht vergrößernd einblenden." },
    { id: "bounce-in", name: "Hüpfend", icon: "⤴", description: "Freundlicher Bounce-Effekt." }
];

function buildDecorationMarkup(type) {
    switch (type) {
        case "clouds":
            return `
                <span class="deco-cloud c1"></span>
                <span class="deco-cloud c2"></span>
                <span class="deco-cloud c3"></span>`;
        case "bubbles":
            return Array.from({ length: 14 }, (_, i) => `<span class="deco-bubble b${i + 1}"></span>`).join("");
        case "stars":
            return Array.from({ length: 18 }, (_, i) => `<span class="deco-star s${i + 1}">✦</span>`).join("");
        case "leaves":
            return Array.from({ length: 12 }, (_, i) => `<span class="deco-leaf l${i + 1}">🍃</span>`).join("");
        case "dots":
            return `<div class="deco-dots-grid"></div>`;
        case "sunrays":
            return `<div class="deco-sun-core"></div><div class="deco-sun-rays"></div>`;
        case "waves":
            return `
                <div class="deco-wave w1"></div>
                <div class="deco-wave w2"></div>
                <div class="deco-wave w3"></div>`;
        default:
            return "";
    }
}

function getDecorationOption(id) {
    return DECORATION_OPTIONS.find((d) => d.id === id) || DECORATION_OPTIONS[0];
}

function getAnimationOption(id) {
    return ANIMATION_OPTIONS.find((a) => a.id === id) || ANIMATION_OPTIONS[1];
}
