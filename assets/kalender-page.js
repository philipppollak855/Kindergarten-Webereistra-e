function parseDate(value) {
    const parts = value.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDateDE(isoDate) {
    const date = parseDate(isoDate);
    return date.toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function getKalenderEvents(content) {
    const all = content?.kalender?.events || [];
    return typeof filterPublished === "function" ? filterPublished(all) : all;
}

function sortEvents(events) {
    return [...events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

function eventUrl(event) {
    return `kalender-artikel.html?id=${encodeURIComponent(event.id)}`;
}

function renderEventList(events) {
    const today = new Date(new Date().toDateString());
    const upcoming = sortEvents(events).filter((event) => parseDate(event.date) >= today);

    if (!upcoming.length) {
        return `<p class="kalender-empty">Derzeit sind keine kommenden Termine eingetragen.</p>`;
    }

    return upcoming.map((event) => `
        <a class="kalender-event-link visible" href="${eventUrl(event)}" id="event-${escapeHtml(event.id)}">
            <article class="kalender-event">
                <div class="kalender-event-date">
                    <span class="day">${parseDate(event.date).getDate()}</span>
                    <span class="month">${parseDate(event.date).toLocaleDateString("de-AT", { month: "short" })}</span>
                </div>
                <div class="kalender-event-body">
                    ${event.category ? `<span class="kalender-category">${escapeHtml(event.category)}</span>` : ""}
                    <h3>${escapeHtml(event.title)}</h3>
                    <p class="kalender-meta">${escapeHtml(formatDateDE(event.date))}${event.time ? ` · ${escapeHtml(event.time)}` : ""}</p>
                    ${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}
                    <span class="read-more">Details ansehen →</span>
                </div>
            </article>
        </a>
    `).join("");
}

function getEventsByDate(events) {
    const map = {};
    events.forEach((event) => {
        if (!map[event.date]) map[event.date] = [];
        map[event.date].push(event);
    });
    return map;
}

function buildMonthGridInner(events, year, month, options = {}) {
    const { compact = false, selectedDate = "", showNav = false } = options;
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const eventsByDate = getEventsByDate(events);
    const monthLabel = firstDay.toLocaleDateString("de-AT", { month: "long", year: "numeric" });

    let cells = "";
    for (let i = 0; i < startWeekday; i++) cells += `<div class="cal-cell empty"></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEvents = eventsByDate[iso] || [];
        const selected = iso === selectedDate ? " selected-day" : "";

        if (!dayEvents.length) {
            cells += `<div class="cal-cell${selected}" data-cal-day="${iso}"><span>${day}</span></div>`;
            continue;
        }

        if (compact) {
            cells += `<button type="button" class="cal-cell has-event${selected}" data-cal-day="${iso}" title="${escapeHtml(dayEvents.map((e) => e.title).join(", "))}">
                <span>${day}</span>${dayEvents.length > 1 ? `<span class="cal-multi">${dayEvents.length}</span>` : ""}
            </button>`;
            continue;
        }

        const href = dayEvents.length === 1
            ? eventUrl(dayEvents[0])
            : `kalender.html?datum=${iso}#kalender-list`;

        cells += `
            <a class="cal-cell has-event${selected}" href="${href}" data-cal-day="${iso}" title="${escapeHtml(dayEvents.map((e) => e.title).join(", "))}">
                <span>${day}</span>
                ${dayEvents.length > 1 ? `<span class="cal-multi">${dayEvents.length}</span>` : ""}
            </a>`;
    }

    const nav = showNav ? `
        <div class="cal-nav">
            <button type="button" class="cal-nav-btn" data-cal-action="prev" aria-label="Vorheriger Monat">‹</button>
            <strong class="cal-nav-label">${monthLabel}</strong>
            <button type="button" class="cal-nav-btn" data-cal-action="next" aria-label="Nächster Monat">›</button>
        </div>` : `<h2>${monthLabel}</h2>`;

    return `
        <div class="kalender-grid-wrap visible" data-cal-year="${year}" data-cal-month="${month}">
            ${nav}
            <div class="cal-weekdays"><span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span></div>
            <div class="cal-grid">${cells}</div>
        </div>`;
}

function renderMonthGrid(events, year, month, options = {}) {
    return buildMonthGridInner(events, year, month, { ...options, showNav: true });
}

function bindCalendarNavigation(container, events, onMonthChange) {
    const wrap = container.querySelector(".kalender-grid-wrap") || container;
    if (!wrap) return;

    wrap.querySelectorAll("[data-cal-action]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let year = Number(wrap.dataset.calYear);
            let month = Number(wrap.dataset.calMonth);
            const shifted = shiftMonth(year, month, btn.dataset.calAction === "prev" ? -1 : 1);
            if (onMonthChange) onMonthChange(shifted.year, shifted.month);
            else mountCalendarGrid(container, events, shifted.year, shifted.month);
        });
    });
}

function mountCalendarGrid(container, events, year, month) {
    container.innerHTML = renderMonthGrid(events, year, month);
    bindCalendarNavigation(container, events);
}

function highlightDateFilter(events) {
    const params = new URLSearchParams(window.location.search);
    const datum = params.get("datum");
    if (!datum) return;

    document.querySelectorAll(".kalender-event-link").forEach((link) => {
        const eventId = link.id.replace("event-", "");
        const event = events.find((e) => e.id === eventId);
        if (event?.date === datum) link.classList.add("highlighted");
    });

    const target = document.getElementById("kalender-list");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderKalender(viewYear, viewMonth) {
    const content = typeof getActiveContent === "function" ? getActiveContent() : window.KG_CONTENT;
    const events = getKalenderEvents(content);
    const listRoot = document.querySelector("[data-render='kalender-list']");
    const gridRoot = document.querySelector("[data-render='kalender-grid']");

    if (listRoot) {
        listRoot.id = "kalender-list";
        listRoot.innerHTML = renderEventList(events);
    }

    if (gridRoot) {
        const now = new Date();
        const year = viewYear ?? (Number(gridRoot.dataset.calYear) || now.getFullYear());
        const month = viewMonth ?? (Number(gridRoot.dataset.calMonth) || now.getMonth());
        mountCalendarGrid(gridRoot, events, year, month);
    }

    highlightDateFilter(events);
}

if (document.querySelector("[data-render='kalender-list'], [data-render='kalender-grid']")) {
    renderKalender();
}
