function initCarousel(root, options = {}) {
    if (!root) return;

    const slides = root.querySelectorAll(".carousel-slide");
    if (!slides.length) return;

    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsRoot = root.querySelector("[data-carousel-dots]");
    let index = 0;
    let timer = null;

    const autoPlay = options.autoPlay ?? root.dataset.autoplay === "true";
    const interval = Number(options.interval || root.dataset.interval || 5000);

    function goTo(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
        if (dotsRoot) {
            dotsRoot.querySelectorAll("button").forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAuto() {
        stopAuto();
        if (autoPlay && slides.length > 1) {
            timer = setInterval(next, interval);
        }
    }

    function stopAuto() {
        if (timer) clearInterval(timer);
    }

    if (dotsRoot && slides.length > 1) {
        dotsRoot.innerHTML = Array.from(slides).map((_, i) => `
            <button type="button" aria-label="Bild ${i + 1}" data-dot="${i}"></button>
        `).join("");
        dotsRoot.querySelectorAll("button").forEach((dot) => {
            dot.addEventListener("click", () => {
                goTo(Number(dot.dataset.dot));
                startAuto();
            });
        });
    }

    prevBtn?.addEventListener("click", () => { prev(); startAuto(); });
    nextBtn?.addEventListener("click", () => { next(); startAuto(); });
    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);

    goTo(0);
    startAuto();
}

function buildCarouselHtml(images, options = {}) {
    if (!images?.length) return "";

    const slides = images.map((img, i) => `
        <figure class="carousel-slide ${i === 0 ? "active" : ""}">
            <img src="${img.src}" alt="${img.alt || ""}">
            ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ""}
        </figure>
    `).join("");

    const controls = images.length > 1 ? `
        <button type="button" class="carousel-btn prev" data-carousel-prev aria-label="Zurück">‹</button>
        <button type="button" class="carousel-btn next" data-carousel-next aria-label="Weiter">›</button>
        <div class="carousel-dots" data-carousel-dots></div>
    ` : "";

    return `
        <div class="carousel" data-autoplay="${options.autoPlay ? "true" : "false"}" data-interval="${options.interval || 5000}">
            <div class="carousel-track">${slides}</div>
            ${controls}
        </div>
    `;
}
