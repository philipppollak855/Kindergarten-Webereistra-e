function spParseDate(value) {
    const parts = String(value).split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function spAddDaysISO(isoDate, days) {
    const d = spParseDate(isoDate);
    d.setDate(d.getDate() + days);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function spPlanEndDate(plan) {
    const count = plan.durationDays || plan.days?.length || 7;
    return spAddDaysISO(plan.startDate, count - 1);
}

function spDateInPlan(plan, date) {
    const start = spParseDate(plan.startDate);
    const end = spParseDate(spPlanEndDate(plan));
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
}

function spEscapeHtml(text) {
    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function getSpeiseplanPlans(site) {
    const all = site?.global?.speiseplan?.plans || site?.speiseplan?.plans || [];
    const published = typeof filterPublished === "function" ? filterPublished(all) : all;
    return [...published].sort((a, b) => spParseDate(a.startDate) - spParseDate(b.startDate));
}

function findDefaultPlanIndex(plans) {
    if (!plans.length) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const current = plans.findIndex((p) => spDateInPlan(p, today));
    if (current >= 0) return current;
    const future = plans.findIndex((p) => {
        const start = spParseDate(p.startDate);
        start.setHours(0, 0, 0, 0);
        return start > today;
    });
    if (future >= 0) return future;
    return plans.length - 1;
}

function syncPlanDays(plan) {
    const count = plan.durationDays === 14 ? 14 : 7;
    const byDate = {};
    (plan.days || []).forEach((d) => {
        if (d?.date) byDate[d.date] = d;
    });
    plan.durationDays = count;
    plan.days = [];
    for (let i = 0; i < count; i++) {
        const date = spAddDaysISO(plan.startDate, i);
        const old = byDate[date] || {};
        plan.days.push({
            date,
            breakfast: old.breakfast || "",
            snack: old.snack || "",
            lunch: old.lunch || "",
            note: old.note || ""
        });
    }
}

function getVisibleDays(plan, viewMode, weekOffset) {
    const allDays = plan.days || [];
    if (viewMode === "14days") return allDays.slice(0, Math.min(14, allDays.length));
    const start = Math.min(weekOffset * 7, Math.max(0, allDays.length - 7));
    return allDays.slice(start, start + 7);
}

function formatDayHeader(dateStr) {
    const d = spParseDate(dateStr);
    const weekday = d.toLocaleDateString("de-AT", { weekday: "short" });
    const date = d.toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit" });
    return { weekday, date };
}

function isToday(dateStr) {
    const d = spParseDate(dateStr);
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function renderSpeiseplanTable(days) {
    if (!days.length) {
        return `<p class="speiseplan-empty">Für diesen Zeitraum sind keine Mahlzeiten eingetragen.</p>`;
    }

    const headers = days.map((day) => {
        const { weekday, date } = formatDayHeader(day.date);
        const todayCls = isToday(day.date) ? " speiseplan-today" : "";
        return `<th class="speiseplan-day-head${todayCls}"><span class="speiseplan-weekday">${spEscapeHtml(weekday)}</span><span class="speiseplan-date">${spEscapeHtml(date)}</span></th>`;
    }).join("");

    const row = (label, key) => {
        const cells = days.map((day) => {
            const val = day[key] || "";
            const todayCls = isToday(day.date) ? " speiseplan-today" : "";
            return `<td class="${todayCls}">${val ? spEscapeHtml(val) : '<span class="speiseplan-empty-cell">–</span>'}</td>`;
        }).join("");
        return `<tr><th scope="row" class="speiseplan-meal-label">${spEscapeHtml(label)}</th>${cells}</tr>`;
    };

    return `
        <div class="speiseplan-table-wrap">
            <table class="speiseplan-table">
                <thead><tr><th class="speiseplan-corner"></th>${headers}</tr></thead>
                <tbody>
                    ${row("Frühstück", "breakfast")}
                    ${row("Jause", "snack")}
                    ${row("Mittagessen", "lunch")}
                    ${row("Hinweis", "note")}
                </tbody>
            </table>
        </div>`;
}

function renderSpeiseplanToolbar(plans, planIndex, plan, viewMode, weekOffset, props) {
    const planLabel = plan.title || `KW ${spParseDate(plan.startDate).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit" })}`;
    const rangeEnd = spPlanEndDate(plan);
    const rangeLabel = `${spParseDate(plan.startDate).toLocaleDateString("de-AT")} – ${spParseDate(rangeEnd).toLocaleDateString("de-AT")}`;

    const canPrevPlan = planIndex > 0;
    const canNextPlan = planIndex < plans.length - 1;

    const duration = plan.durationDays || plan.days?.length || 7;
    const maxWeekOffset = duration > 7 ? Math.ceil(duration / 7) - 1 : 0;
    const canPrevWeek = viewMode === "week" && weekOffset > 0;
    const canNextWeek = viewMode === "week" && weekOffset < maxWeekOffset;

    const viewToggle = props.allowViewSwitch !== false ? `
        <div class="speiseplan-view-toggle" role="group" aria-label="Ansicht">
            <button type="button" class="speiseplan-view-btn ${viewMode === "week" ? "active" : ""}" data-sp-view="week">Woche</button>
            <button type="button" class="speiseplan-view-btn ${viewMode === "14days" ? "active" : ""}" data-sp-view="14days" ${duration < 14 ? 'title="Dieser Plan umfasst nur 7 Tage"' : ""}>14 Tage</button>
        </div>` : "";

    const weekNav = viewMode === "week" && duration > 7 ? `
        <div class="speiseplan-week-nav">
            <button type="button" class="speiseplan-nav-btn" data-sp-week="prev" ${canPrevWeek ? "" : "disabled"} aria-label="Vorherige Woche">‹</button>
            <span>Woche ${weekOffset + 1} von ${maxWeekOffset + 1}</span>
            <button type="button" class="speiseplan-nav-btn" data-sp-week="next" ${canNextWeek ? "" : "disabled"} aria-label="Nächste Woche">›</button>
        </div>` : "";

    return `
        <div class="speiseplan-toolbar">
            ${viewToggle}
            <div class="speiseplan-plan-nav">
                <button type="button" class="speiseplan-nav-btn" data-sp-plan="prev" ${canPrevPlan ? "" : "disabled"} aria-label="Vorheriger Plan">‹</button>
                <div class="speiseplan-plan-meta">
                    <strong>${spEscapeHtml(planLabel)}</strong>
                    <small>${spEscapeHtml(rangeLabel)}</small>
                </div>
                <button type="button" class="speiseplan-nav-btn" data-sp-plan="next" ${canNextPlan ? "" : "disabled"} aria-label="Nächster Plan">›</button>
            </div>
            ${weekNav}
        </div>`;
}

function mountSpeiseplanSection(section, site) {
    const root = section.querySelector("[data-render='speiseplan-root']");
    if (!root) return;

    const props = {
        defaultView: section.dataset.defaultView || "week",
        allowViewSwitch: section.dataset.allowSwitch !== "false"
    };

    const plans = getSpeiseplanPlans(site);
    if (!plans.length) {
        root.innerHTML = `<p class="speiseplan-empty">Derzeit ist kein Speiseplan veröffentlicht.</p>`;
        return;
    }

    let planIndex = Number(section.dataset.planIndex);
    if (Number.isNaN(planIndex) || planIndex < 0 || planIndex >= plans.length) {
        planIndex = findDefaultPlanIndex(plans);
        section.dataset.planIndex = String(planIndex);
    }

    let viewMode = section.dataset.viewMode || props.defaultView;
    if (viewMode !== "week" && viewMode !== "14days") viewMode = "week";

    let weekOffset = Number(section.dataset.weekOffset);
    if (Number.isNaN(weekOffset) || weekOffset < 0) weekOffset = 0;

    const plan = plans[planIndex];
    const duration = plan.durationDays || plan.days?.length || 7;
    const maxWeekOffset = duration > 7 ? Math.ceil(duration / 7) - 1 : 0;
    if (weekOffset > maxWeekOffset) weekOffset = 0;

    if (viewMode === "14days" && duration < 14) viewMode = "week";

    const days = getVisibleDays(plan, viewMode, weekOffset);
    root.innerHTML = renderSpeiseplanToolbar(plans, planIndex, plan, viewMode, weekOffset, props)
        + renderSpeiseplanTable(days);

    root.querySelectorAll("[data-sp-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
            section.dataset.viewMode = btn.dataset.spView;
            section.dataset.weekOffset = "0";
            mountSpeiseplanSection(section, site);
        });
    });

    root.querySelectorAll("[data-sp-plan]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const delta = btn.dataset.spPlan === "prev" ? -1 : 1;
            const next = Math.max(0, Math.min(plans.length - 1, planIndex + delta));
            section.dataset.planIndex = String(next);
            section.dataset.weekOffset = "0";
            mountSpeiseplanSection(section, site);
        });
    });

    root.querySelectorAll("[data-sp-week]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const delta = btn.dataset.spWeek === "prev" ? -1 : 1;
            section.dataset.weekOffset = String(Math.max(0, Math.min(maxWeekOffset, weekOffset + delta)));
            mountSpeiseplanSection(section, site);
        });
    });
}

function initSpeiseplanModules(root, site) {
    const scope = root || document;
    scope.querySelectorAll("[data-mod-speiseplan]").forEach((section) => {
        mountSpeiseplanSection(section, site);
    });
}

if (document.querySelector("[data-mod-speiseplan]")) {
    const site = typeof loadSite === "function" ? loadSite() : window.KG_SITE;
    initSpeiseplanModules(document, site);
}
