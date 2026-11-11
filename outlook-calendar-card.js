const EVENT_ICON_UNICODE = Object.freeze({
  "mdi:drama-masks": "🎭",
  "mdi:sail-boat": "⛵",
  "mdi:cat": "🐱",
  "mdi:dog": "🐶",
  "mdi:tennis-ball": "🎾",
  "mdi:swim": "🏊",
  "mdi:soccer": "⚽",
  "mdi:music": "🎵",
  "mdi:piano": "🎹",
  "mdi:guitar-acoustic": "🎸",
  "mdi:run": "🏃",
  "mdi:bike": "🚴",
  "mdi:basketball": "🏀",
  "mdi:volleyball": "🏐",
  "mdi:baseball": "⚾",
  "mdi:karate": "🥋",
  "mdi:school": "🏫",
  "mdi:book-open-variant": "📖",
  "mdi:palette": "🎨",
  "mdi:cake-variant": "🎂",
  "mdi:airplane": "✈️",
  "mdi:calendar": "📅"
});

class OutlookCalendarCard extends HTMLElement {
  setConfig(config) {
    this._config = {
      start_hour: 8,
      end_hour: 20,
      step_minutes: 60,
      height: 600,
      header: "Outlook calendar",
      refresh_minutes: 5,
      debug: false,
      now_line_color: "var(--error-color)",
      now_line_width: 1,
      view: "day",
      ...config
    };
    if (Object.hasOwn(this._config, "calendars") && !Array.isArray(this._config.calendars)) {
      this._config.calendars = [];
    }
    this._calendars = this._normalizeCalendars(this._config);
    if (!this._activeDate) {
      this._setActiveDate(new Date());
    }
    this._setView(this._config.view);
    this._scheduleLoad(true);
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config) {
      const calendars = this._normalizeCalendars(this._config);
      if (this._loadInFlight && JSON.stringify(calendars) !== JSON.stringify(this._calendars)) {
        this._reloadAfterLoad = true;
      }
      this._calendars = calendars;
    }
    this._scheduleLoad(false);
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    if (!this._activeDate) {
      this._setActiveDate(new Date());
    }
    if (!this._view) {
      this._setView(this._config && this._config.view ? this._config.view : "day");
    }
    this._scheduleLoad(true);
  }

  _log(...args) {
    if (this._config && this._config.debug) {
      console.log(...args);
    }
  }

  _escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  _setActiveDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    this._activeDate = d;
  }

  _getActiveDate() {
    if (!this._activeDate) {
      this._setActiveDate(new Date());
    }
    return new Date(this._activeDate);
  }

  _formatDateLabel(date) {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  _localizeFirst(keys, fallback) {
    const hass = this._hass || window.hass;
    if (hass && typeof hass.localize === "function") {
      for (const key of keys) {
        const value = hass.localize(key);
        if (value && value !== key) {
          return value;
        }
      }
    }
    return fallback;
  }

  _labelToday() {
    return this._localizeFirst(["ui.common.today"], "Today");
  }

  _labelDay() {
    return this._localizeFirst(
      ["ui.panel.calendar.day", "ui.common.day"],
      "Day"
    );
  }

  _labelWeek() {
    return this._localizeFirst(
      ["ui.panel.calendar.week", "ui.common.week"],
      "Week"
    );
  }

  _labelMonth() {
    return this._localizeFirst(
      ["ui.panel.calendar.month", "ui.common.month"],
      "Month"
    );
  }

  _labelPrevious() {
    return this._localizeFirst(["ui.common.previous"], "Previous");
  }

  _labelNext() {
    return this._localizeFirst(["ui.common.next"], "Next");
  }

  _formatTimeLabel(date) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  _setView(view) {
    const allowed = ["day", "week", "month"];
    this._view = allowed.includes(view) ? view : "day";
  }

  _getView() {
    if (!this._view) {
      this._setView(this._config && this._config.view ? this._config.view : "day");
    }
    return this._view;
  }

  _getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  _getMonthStart(date) {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  _getViewRange() {
    const base = this._getActiveDate();
    const view = this._getView();
    if (view === "week") {
      const start = this._getWeekStart(base);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return { start, end };
    }
    if (view === "month") {
      const start = this._getMonthStart(base);
      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      return { start, end };
    }
    const start = new Date(base);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return { start, end };
  }

  _getHeaderLabel() {
    const view = this._getView();
    if (view === "month") {
      const base = this._getActiveDate();
      return base.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }
    if (view === "week") {
      const { start, end } = this._getViewRange();
      const last = new Date(end);
      last.setDate(end.getDate() - 1);
      const startLabel = this._formatDateLabel(start);
      const endLabel = this._formatDateLabel(last);
      return `${startLabel} – ${endLabel}`;
    }
    return this._formatDateLabel(this._getActiveDate());
  }

  _isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  _shiftRange(delta) {
    const next = this._getActiveDate();
    const view = this._getView();
    if (view === "week") {
      next.setDate(next.getDate() + delta * 7);
    } else if (view === "month") {
      next.setMonth(next.getMonth() + delta);
    } else {
      next.setDate(next.getDate() + delta);
    }
    this._setActiveDate(next);
    this.loadEvents(true);
  }

  _goToday() {
    this._setActiveDate(new Date());
    this.loadEvents(true);
  }

  _setViewAndReload(view) {
    this._setView(view);
    this.loadEvents(true);
  }

  _scheduleLoad(force) {
    if (!this._config) return;
    if (this._loadScheduled) return;
    this._loadScheduled = true;
    setTimeout(() => {
      this._loadScheduled = false;
      this.loadEvents(force);
    }, 0);
  }

  _configKey() {
    return JSON.stringify({
      start_hour: this._config.start_hour,
      end_hour: this._config.end_hour,
      view: this._config.view,
      calendars: (this._calendars || []).map(cal => ({
        entity: cal.entity,
        color: cal.color,
        prefix: cal.prefix,
        colorAttribute: (this._hass || window.hass)?.states?.[cal.entity]?.attributes?.color,
        initialColor: (this._hass || window.hass)?.states?.[cal.entity]?.attributes?.initial_color,
        icon: (this._hass || window.hass)?.states?.[cal.entity]?.attributes?.icon,
        supportedFeatures: (this._hass || window.hass)?.states?.[cal.entity]?.attributes?.supported_features,
        state: (this._hass || window.hass)?.states?.[cal.entity]?.state,
        registryColor: (this._hass || window.hass)?.entities?.[cal.entity]?.options?.calendar?.color
          || (this._hass || window.hass)?.entities?.[cal.entity]?.color,
        registryIcon: (this._hass || window.hass)?.entities?.[cal.entity]?.icon
      }))
    });
  }

  _calendarCssColor(color) {
    const themeColors = [
      "primary", "accent", "red", "pink", "purple", "deep-purple", "indigo",
      "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime",
      "yellow", "amber", "orange", "deep-orange", "brown", "light-grey",
      "grey", "dark-grey", "blue-grey", "black", "white"
    ];
    return themeColors.includes(color) ? `var(--${color}-color)` : color;
  }

  async _getCalendarColor(calendar) {
    if (calendar?.color) return calendar.color;
    const hass = this._hass || window.hass;
    const entityId = calendar?.entity;
    const attrs = hass?.states?.[entityId]?.attributes;
    const attrColor = attrs?.color || attrs?.initial_color;
    if (attrColor) return this._calendarCssColor(attrColor);
    const entry = hass?.entities?.[entityId];
    const registryColor = entry?.options?.calendar?.color || entry?.color;
    if (registryColor) return this._calendarCssColor(registryColor);
    if (hass && typeof hass.callWS === "function" && entityId) {
      try {
        const reg = await hass.callWS({
          type: "config/entity_registry/get",
          entity_id: entityId
        });
        const color = reg?.options?.calendar?.color || reg?.color;
        if (color) return this._calendarCssColor(color);
      } catch (err) {
        this._log("Failed to fetch entity registry color", entityId, err);
      }
    }
    // Match the built-in calendar's palette and alphabetical entity order.
    const entityIds = Object.keys(hass?.states || {})
      .filter(id => id.startsWith("calendar.")
        && hass.states[id].state !== "unavailable" && !hass.entities?.[id]?.hidden)
      .sort();
    const index = Math.max(0, entityIds.indexOf(entityId));
    return `var(--color-${index % 54 + 1}, var(--primary-color))`;
  }

  _normalizeCalendars(config) {
    if (!Object.hasOwn(config, "calendars")) {
      const hass = this._hass || window.hass;
      return Object.keys(hass?.states || {})
        .filter(entity => entity.startsWith("calendar."))
        .sort()
        .map(entity => ({ entity, color: null, prefix: null }));
    }
    if (Array.isArray(config.calendars) && config.calendars.length > 0) {
      return config.calendars.map(entry => {
        if (entry && typeof entry === "object") {
          if (entry.entity) {
            return {
              entity: entry.entity,
              color: entry.color || null,
              prefix: typeof entry.prefix === "string" ? entry.prefix : null
            };
          }
        }
        return null;
      }).filter(Boolean);
    }

    return [];
  }

  _getCalendarIcon(calendar) {
    if (typeof calendar.prefix === "string") return "";
    const hass = this._hass || window.hass;
    return hass?.states?.[calendar.entity]?.attributes?.icon
      || hass?.entities?.[calendar.entity]?.icon || "mdi:calendar";
  }

  _joinEventPrefixes(prefixes) {
    if (prefixes.length <= 1) return prefixes.join("");
    const combined = prefixes.map(prefix => prefix.trim()).join("");
    return combined ? `${combined} ` : "";
  }

  _renderEventPrefix(event) {
    const prefixes = event.prefixes || (event.prefix ? [event.prefix] : []);
    const icons = event.icons || (event.icon ? [event.icon] : []);
    return this._joinEventPrefixes([
      ...prefixes.map(prefix => this._escapeHtml(prefix)),
      ...icons.map(icon => `<ha-icon icon="${this._escapeHtml(icon)}" style="--mdc-icon-size:14px;vertical-align:middle;"></ha-icon> `)
    ]);
  }

  _parseEventTitle(summary) {
    const value = String(summary || "");
    const match = value.match(/^\[(mdi:[a-z0-9]+(?:-[a-z0-9]+)*)\]\s*/);
    if (match) return { eventIcon: match[1], summary: value.slice(match[0].length) };
    for (const [eventIcon, emoji] of Object.entries(EVENT_ICON_UNICODE)) {
      const prefix = emoji.replace(/\uFE0F/g, "");
      const unicode = value.match(new RegExp(`^${prefix}\\uFE0F?(?![\\u{1F3FB}-\\u{1F3FF}\\u200D\\uFE0F])\\s*`, "u"));
      if (unicode) return { eventIcon, summary: value.slice(unicode[0].length) };
    }
    return { eventIcon: "", summary: value };
  }

  _eventSummaryWithIcon(summary, eventIcon) {
    const title = this._parseEventTitle(summary).summary.trim();
    if (!eventIcon) return title;
    return `${EVENT_ICON_UNICODE[eventIcon] || `[${eventIcon}]`} ${title}`;
  }

  _renderEventSummary(event) {
    const icons = event.eventIcons || (event.eventIcon ? [event.eventIcon] : []);
    return icons.map(icon => `<ha-icon icon="${this._escapeHtml(icon)}" aria-hidden="true" style="--mdc-icon-size:14px;vertical-align:middle;"></ha-icon>`).join("")
      + (icons.length ? " " : "") + this._escapeHtml(event.summary || "");
  }

  _renderEventTitle(event) {
    return this._renderEventPrefix(event) + this._renderEventSummary(event);
  }

  _mergeDuplicateEvents(events) {
    const merged = new Map();
    for (const ev of events || []) {
      if (!ev || !ev.start || !ev.end) continue;
      // TEMPORARY: normalize summary for looser duplicate detection.
      const summaryKey = this._normalizeSummary(ev.summary || "");
      const key = [
        ev.allDay ? "1" : "0",
        ev.start.getTime(),
        ev.end.getTime(),
        summaryKey
      ].join("|");
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, {
          ...ev,
          prefixes: ev.prefix ? [ev.prefix] : [],
          icons: ev.icon ? [ev.icon] : [],
          eventIcons: ev.eventIcon ? [ev.eventIcon] : [],
          colors: ev.color ? [ev.color] : [],
          calendarIndex: ev.calendarIndex ?? 0
        });
        continue;
      }
      if (ev.prefix && !existing.prefixes.includes(ev.prefix)) {
        existing.prefixes.push(ev.prefix);
      }
      if (ev.icon && !existing.icons.includes(ev.icon)) {
        existing.icons.push(ev.icon);
      }
      if (ev.eventIcon && !existing.eventIcons.includes(ev.eventIcon)) {
        existing.eventIcons.push(ev.eventIcon);
      }
      if (ev.color && !existing.colors.includes(ev.color)) {
        existing.colors.push(ev.color);
      }
      const idx = ev.calendarIndex ?? 0;
      if (existing.calendarIndex === undefined || idx < existing.calendarIndex) {
        existing.calendarIndex = idx;
      }
    }

    const out = [];
    for (const ev of merged.values()) {
      const prefixText = this._joinEventPrefixes(ev.prefixes);
      out.push({
        ...ev,
        title: `${prefixText}${ev.summary || ""}`,
        color: ev.color,
        colors: ev.colors,
        calendarIndex: ev.calendarIndex ?? 0
      });
    }
    return out;
  }

  _normalizeSummary(value) {
    // TEMPORARY: ignore case, punctuation, and extra whitespace.
    return String(value)
      .toLowerCase()
      .replace(/[^\w\s]|_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  _eventTextColor(background) {
    this._eventTextColors ||= new Map();
    if (this._eventTextColors.has(background)) return this._eventTextColors.get(background);
    // Let the browser resolve hex, RGB and theme CSS variables alike.
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
    probe.style.color = background;
    this.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    const white = /^rgba?\(255[, ]+255[, ]+255(?:\s*[,/]\s*1)?\)$/.test(resolved);
    const color = white ? "#212121" : "white";
    this._eventTextColors.set(background, color);
    return color;
  }

  _eventBackground(ev) {
    const colors = Array.isArray(ev.colors) ? ev.colors.filter(Boolean) : [];
    const background = colors[0] || ev.color || "var(--primary-color)";
    const textColor = this._eventTextColor(background);
    if (colors.length <= 1) {
      return {
        background,
        textColor,
        backgroundImage: ""
      };
    }
    const stripeWidth = 10;
    let offset = 0;
    const stops = colors.map(color => {
      const start = offset;
      const end = offset + stripeWidth;
      offset = end;
      return `${color} ${start}px ${end}px`;
    }).join(", ");
    return {
      background,
      textColor,
      backgroundImage: `repeating-linear-gradient(45deg, ${stops})`
    };
  }

  _isReloadDue(force) {
    const now = Date.now();
    const refreshMs = Math.max(1, this._config.refresh_minutes) * 60 * 1000;
    const configKey = this._configKey();
    const dayKey = `${this._getActiveDate().toDateString()}|${this._getView()}`;
    const configChanged = configKey !== this._lastConfigKey;
    const dayChanged = dayKey !== this._lastDayKey;
    const timeDue = !this._lastLoadAt || now - this._lastLoadAt >= refreshMs;

    if (force || configChanged || dayChanged || timeDue) {
      this._lastConfigKey = configKey;
      this._lastDayKey = dayKey;
      return true;
    }
    return false;
  }

  async loadEvents(force = false) {
     if (!this._config) return;
     if (this._loadInFlight) return;
     if (!this._isReloadDue(force)) return;

     const events = [];

     const hass = this._hass || window.hass;
     if (!hass) return;

     const baseDate = this._getActiveDate();
     const { start: queryStart, end: queryEnd } = this._getViewRange();

     const pad = (n) => String(n).padStart(2, "0");
    const toDateOnly = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const qs = new URLSearchParams({
          start: queryStart.toISOString(),
          end: queryEnd.toISOString(),
     }).toString();
    const qsDateOnly = new URLSearchParams({
          start: toDateOnly(queryStart),
          end: toDateOnly(queryEnd),
     }).toString();

     this._loadInFlight = true;
     this._error = null;
     try {
       for (let calendarIndex = 0; calendarIndex < this._calendars.length; calendarIndex++) {
          const calendar = this._calendars[calendarIndex];
          if (!calendar || !calendar.entity) {
            continue;
          }
          if (this._config.debug) {
            const state = hass.states && hass.states[calendar.entity];
            const name = state && state.attributes && state.attributes.friendly_name;
            this._log("Fetching calendar:", name || calendar.entity, `(${calendar.entity})`);
          }
          try {
            let resp;
            try {
              resp = await hass.callApi("GET", `calendars/${calendar.entity}?${qs}`);
            } catch (err) {
              const isBadRequest = err?.status === 400 || err?.statusCode === 400;
              if (isBadRequest) {
                try {
                  resp = await hass.callApi("GET", `calendars/${calendar.entity}?${qsDateOnly}`);
                } catch (err2) {
                  this._log("Calendar API 400 for", calendar.entity, "- skipping. Tried ISO and date-only.");
                  continue;
                }
              } else {
                throw err;
              }
            }
            if (this._config.debug && Array.isArray(resp) && resp.length > 0) {
              this._log("Sample calendar event:", resp[0]);
            }
            const color = await this._getCalendarColor(calendar);
            for (const e of resp) {
              this._log(e);
              const parsed = this._parseEventTimes(e);
              if (!parsed) {
                continue;
              }
              const { start: st, end: fi, allDay } = parsed;
              if (st >= queryEnd) {
                continue;
              }
              if (fi <= queryStart) {
                continue;
              }
              events.push({
                icon: this._getCalendarIcon(calendar),
                ...this._parseEventTitle(e.summary),
                prefix: calendar && typeof calendar.prefix === "string" ? calendar.prefix : "",
                start: st,
                end: fi,
                entity: calendar.entity,
                calendarIndex,
                color,
                allDay
              });
            }
          } catch (err) {
            this._log("Calendar fetch failed for", calendar.entity, err?.message || err);
          }
       }
       this._events = this._mergeDuplicateEvents(events);
     } catch (err) {
       this._error = err;
       this._events = [];
     } finally {
       this._lastLoadAt = Date.now();
       this._loadInFlight = false;
       this.render();
       if (this._reloadAfterLoad) {
         this._reloadAfterLoad = false;
         this._scheduleLoad(true);
       }
     }
  }

  render() {

    if (!this._config) return;
    const hass = this._hass || window.hass;
    if (!hass) return;

    this._eventTextColors = new Map();
    const start = this._config.start_hour;
    const end = this._config.end_hour;
    const step = this._config.step_minutes;

    let o = ''
    const dateLabel = this._getHeaderLabel();
    const labelToday = this._labelToday();
    const labelDay = this._labelDay();
    const labelWeek = this._labelWeek();
    const labelMonth = this._labelMonth();
    const labelPrev = this._labelPrevious();
    const labelNext = this._labelNext();
    o += `<ha-card>`;
    o += `<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--divider-color);">`;
    o += `<button type="button" data-action="prev" aria-label="${this._escapeHtml(labelPrev)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">◀</button>`;
    o += `<button type="button" data-action="today" aria-label="${this._escapeHtml(labelToday)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">${this._escapeHtml(labelToday)}</button>`;
    o += `<div style="flex:1;text-align:center;font-weight:600;">${this._escapeHtml(dateLabel)}</div>`;
    o += `<button type="button" data-action="next" aria-label="${this._escapeHtml(labelNext)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">▶</button>`;
    o += `<div style="display:flex;gap:6px;">`;
    o += `<button type="button" data-view="day" aria-label="${this._escapeHtml(labelDay)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">${this._escapeHtml(labelDay)}</button>`;
    o += `<button type="button" data-view="week" aria-label="${this._escapeHtml(labelWeek)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">${this._escapeHtml(labelWeek)}</button>`;
    o += `<button type="button" data-view="month" aria-label="${this._escapeHtml(labelMonth)}" style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 8px;cursor:pointer;">${this._escapeHtml(labelMonth)}</button>`;
    o += `</div>`;
    const addLabel = this._text("Add event", "Добавить событие");
    o += `<button type="button" data-action="add" aria-label="${addLabel}" title="${addLabel}" ${this._writableCalendars().length ? "" : "disabled"} style="background:var(--primary-color);color:var(--text-primary-color, white);border:0;border-radius:6px;padding:4px 8px;cursor:pointer;">+</button>`;
    o += `</div>`;
    const view = this._getView();
    if (view === "day") {
      o += this.renderAllDayEvents(this._events || []);
      o += `<div style="display:grid;grid-template-columns:56px minmax(0, 1fr);padding:8px 0;">`;
      o += `<div data-time-axis style="position:relative;height:${this._config.height}px;">${this.renderTimeAxis(start, end, step)}</div>`;
      o += `<div data-time-grid style="position:relative;height:${this._config.height}px;border-left:1px solid var(--divider-color);">`;
      o += this.renderGrid(start, end, step);
      if (this._error) {
        o += `<div style="padding:8px;color:var(--error-color);font-size:12px;">Failed to load calendar events</div>`;
      } else {
        o += this.renderEvents(this._events || [], start, end);
      }
      o += this.renderNowLine(start, end);
      o += '</div></div>';
    } else if (view === "week") {
      o += this.renderWeekView(this._events || []);
    } else {
      o += this.renderMonthView(this._events || []);
    }
    o += '</ha-card>';

    if (!this._cardContainer) {
      this._cardContainer = document.createElement("div");
      this.appendChild(this._cardContainer);
    }
    this._cardContainer.innerHTML = o;
    const add = this.querySelector('[data-action="add"]');
    if (add) add.onclick = () => this._openEventDialog();
    const prev = this.querySelector('[data-action="prev"]');
    if (prev) {
      prev.onclick = () => this._shiftRange(-1);
    }
    const today = this.querySelector('[data-action="today"]');
    if (today) {
      today.onclick = () => this._goToday();
    }
    const next = this.querySelector('[data-action="next"]');
    if (next) {
      next.onclick = () => this._shiftRange(1);
    }
    const viewButtons = this.querySelectorAll('[data-view]');
    viewButtons.forEach(btn => {
      btn.onclick = () => this._setViewAndReload(btn.getAttribute("data-view"));
      if (btn.getAttribute("data-view") === this._getView()) {
        btn.style.background = "var(--primary-color)";
        btn.style.color = "var(--text-primary-color, white)";
      }
    });
  }

  _text(english, russian) {
    const hass = this._hass || window.hass;
    return (hass?.locale?.language || hass?.language || "").startsWith("ru") ? russian : english;
  }

  _writableCalendars() {
    const hass = this._hass || window.hass;
    return (this._calendars || []).filter(calendar => {
      const state = hass?.states?.[calendar.entity];
      return state && !["unavailable", "unknown"].includes(state.state)
        && (Number(state.attributes?.supported_features) & 1) !== 0;
    });
  }

  _localDateValue(date, allDay = false) {
    const pad = value => String(value).padStart(2, "0");
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return allDay ? day : `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  _eventServiceData(values) {
    if (!this._writableCalendars().some(calendar => calendar.entity === values.entity)) {
      throw new Error(this._text("This calendar does not support adding events.", "Этот календарь не поддерживает добавление событий."));
    }
    const title = this._parseEventTitle(values.summary);
    if (!title.summary.trim()) {
      throw new Error(this._text("Enter an event title.", "Введите название события."));
    }
    const eventIcon = (values.eventIcon || title.eventIcon || "").trim();
    if (eventIcon && !/^mdi:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventIcon)) {
      throw new Error(this._text("Use an MDI icon name, for example mdi:tennis-ball.", "Укажите имя MDI-иконки, например mdi:tennis-ball."));
    }
    const start = new Date(values.start);
    const end = new Date(values.end);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      throw new Error(this._text("End must be after start.", "Окончание должно быть позже начала."));
    }
    return {
      entity_id: values.entity,
      summary: this._eventSummaryWithIcon(values.summary, eventIcon),
      description: values.description.trim(),
      location: values.location.trim(),
      ...(values.allDay
        ? { start_date: values.start, end_date: values.end }
        : { start_date_time: start.toISOString(), end_date_time: end.toISOString() })
    };
  }

  _allCalendarEntities() {
    const hass = this._hass || window.hass;
    return Object.keys(hass?.states || {}).filter(entity => entity.startsWith("calendar.")).sort();
  }

  _calendarName(entity) {
    return (this._hass || window.hass)?.states?.[entity]?.attributes?.friendly_name || entity;
  }

  _dateOrdinal(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
  }

  async _readPlanningCalendar(entity, start, end) {
    const hass = this._hass || window.hass;
    const state = hass?.states?.[entity];
    if (!state || ["unknown", "unavailable"].includes(state.state)) {
      throw new Error(`${this._text("Calendar unavailable", "Календарь недоступен")}: ${this._calendarName(entity)}`);
    }
    const query = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
    const events = await hass.callApi("GET", `calendars/${entity}?${query}`);
    if (!Array.isArray(events)) throw new Error(this._text("Could not read calendar events.", "Не удалось прочитать события календаря."));
    return events.map(event => {
      const parsed = this._parseEventTimes(event);
      if (!parsed || !Number.isFinite(parsed.start.getTime()) || !Number.isFinite(parsed.end.getTime()) || parsed.end <= parsed.start) {
        throw new Error(`${this._text("Invalid event dates in calendar", "Некорректные даты события в календаре")}: ${this._calendarName(entity)}`);
      }
      return { ...parsed, summary: event.summary || "", entity };
    });
  }

  async _planEventSeries(values) {
    const entities = [...new Set(values.entities || [])];
    if (!entities.length) throw new Error(this._text("Select at least one calendar.", "Выберите хотя бы один календарь."));
    for (const entity of entities) this._eventServiceData({ ...values, entity });
    const start = new Date(values.allDay ? `${values.start}T00:00:00` : values.start);
    const end = new Date(values.allDay ? `${values.end}T00:00:00` : values.end);
    const recurrence = values.recurrence || "none";
    if (!["none", "daily", "weekly"].includes(recurrence)) throw new Error(this._text("Invalid repeat rule.", "Некорректное правило повторения."));
    const interval = recurrence === "none" ? 1 : Number(values.interval);
    if (!Number.isInteger(interval) || interval < 1 || interval > 52) throw new Error(this._text("Repeat interval must be between 1 and 52.", "Интервал повторения должен быть от 1 до 52."));
    const weekdays = [...new Set(values.weekdays || [])].map(Number);
    if (recurrence === "weekly" && (!weekdays.length || weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6))) {
      throw new Error(this._text("Select days of the week.", "Выберите дни недели."));
    }
    let summer = null;
    let limit = new Date(start);
    limit.setHours(0, 0, 0, 0);
    if (recurrence !== "none") {
      if (values.schoolYear) {
        const year = start.getFullYear() + (start.getMonth() >= 8 ? 1 : 0);
        const holidays = await this._readPlanningCalendar(values.holidayCalendar, new Date(year, 5, 1), new Date(year, 8, 1));
        summer = holidays.filter(event => event.start.getFullYear() === year && event.start.getMonth() >= 5 && event.start.getMonth() <= 7)
          .sort((a, b) => a.start - b.start)[0];
        if (!summer) throw new Error(this._text("No summer holiday event found. Select another calendar or set an end date.", "Летние каникулы не найдены. Выберите другой календарь или укажите дату окончания."));
        limit = new Date(summer.start);
        limit.setHours(0, 0, 0, 0);
        limit.setDate(limit.getDate() - 1);
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(values.until || "")) throw new Error(this._text("Set a repeat end date.", "Укажите дату окончания повторений."));
        limit = new Date(`${values.until}T00:00:00`);
      }
    }
    const horizon = new Date(start);
    horizon.setFullYear(horizon.getFullYear() + 2);
    if (!Number.isFinite(limit.getTime()) || limit > horizon || this._dateOrdinal(limit) < this._dateOrdinal(start)) {
      throw new Error(this._text("Choose an end date after the start, within two years.", "Выберите окончание не раньше начала и не более чем через два года."));
    }
    const endDayOffset = this._dateOrdinal(end) - this._dateOrdinal(start);
    const monday = new Date(start);
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    const candidates = [];
    const firstDay = new Date(start);
    firstDay.setHours(0, 0, 0, 0);
    for (const day = firstDay; this._dateOrdinal(day) <= this._dateOrdinal(limit); day.setDate(day.getDate() + 1)) {
      const dayIndex = this._dateOrdinal(day) - this._dateOrdinal(start);
      const weekIndex = Math.floor((this._dateOrdinal(day) - this._dateOrdinal(monday)) / 7);
      if (recurrence === "daily" && dayIndex % interval !== 0) continue;
      if (recurrence === "weekly" && (weekIndex % interval !== 0 || !weekdays.includes(day.getDay()))) continue;
      const occurrenceStart = new Date(day);
      occurrenceStart.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), 0);
      const occurrenceEnd = new Date(day);
      occurrenceEnd.setDate(occurrenceEnd.getDate() + endDayOffset);
      occurrenceEnd.setHours(end.getHours(), end.getMinutes(), end.getSeconds(), 0);
      if (summer) {
        const summerDay = new Date(summer.start);
        summerDay.setHours(0, 0, 0, 0);
        if (occurrenceEnd > summerDay) continue;
      }
      candidates.push({ start: occurrenceStart, end: occurrenceEnd });
      if (candidates.length > 366) throw new Error(this._text("Limit the series to 366 dates or fewer.", "Сократите серию до 366 дат или меньше."));
    }
    if (!candidates.length) throw new Error(this._text("No dates match this repeat rule.", "Нет дат, подходящих под правило повторения."));
    const excludedEntities = [...new Set(values.excludeCalendars || [])];
    const queryStart = new Date(candidates[0].start);
    queryStart.setHours(0, 0, 0, 0);
    const queryEnd = new Date(Math.max(...candidates.map(item => item.end.getTime())));
    if (queryEnd.getHours() || queryEnd.getMinutes() || queryEnd.getSeconds() || queryEnd.getMilliseconds()) queryEnd.setDate(queryEnd.getDate() + 1);
    queryEnd.setHours(0, 0, 0, 0);
    const exclusions = [];
    for (const entity of excludedEntities) exclusions.push(...await this._readPlanningCalendar(entity, queryStart, queryEnd));
    const accepted = [], skipped = [];
    for (const occurrence of candidates) {
      const dayStart = new Date(occurrence.start);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(occurrence.end);
      if (dayEnd.getHours() || dayEnd.getMinutes() || dayEnd.getSeconds() || dayEnd.getMilliseconds()) dayEnd.setDate(dayEnd.getDate() + 1);
      dayEnd.setHours(0, 0, 0, 0);
      const reasons = exclusions.filter(event => event.start < dayEnd && event.end > dayStart);
      if (reasons.length) skipped.push({ ...occurrence, reasons });
      else accepted.push(occurrence);
    }
    const tasks = accepted.flatMap(occurrence => entities.map(entity => ({
      entity,
      start: occurrence.start,
      data: this._eventServiceData({ ...values, entity,
        start: this._localDateValue(occurrence.start, values.allDay),
        end: this._localDateValue(occurrence.end, values.allDay)
      })
    })));
    return { accepted, skipped, tasks, summer, entities };
  }

  async _writeEventPlan(plan, completed, onProgress = () => {}) {
    for (let index = 0; index < plan.tasks.length; index++) {
      if (completed.has(index)) continue;
      const task = plan.tasks[index];
      if (!this._writableCalendars().some(calendar => calendar.entity === task.entity)) {
        throw new Error(`${this._text("Calendar is no longer writable", "Запись в календарь больше недоступна")}: ${this._calendarName(task.entity)}`);
      }
      await (this._hass || window.hass).callService("calendar", "create_event", task.data);
      completed.add(index);
      onProgress(completed.size, plan.tasks.length);
    }
  }

  _eventTemplateStorageKey() {
    const hass = this._hass || window.hass;
    return `outlook-calendar-card:event-templates:${hass?.user?.id || "default"}`;
  }

  _readEventTemplates() {
    try {
      const templates = JSON.parse(localStorage.getItem(this._eventTemplateStorageKey()) || "[]");
      return Array.isArray(templates) ? templates.filter(item => item && typeof item.name === "string" && item.values && typeof item.values === "object") : [];
    } catch (err) {
      this._log("Could not read event templates", err);
      return [];
    }
  }

  _openEventDialog() {
    if (this.querySelector("dialog")) return;
    const calendars = this._writableCalendars();
    if (!calendars.length) return;
    const text = (english, russian) => this._text(english, russian);
    const escape = value => this._escapeHtml(value);
    const allCalendars = this._allCalendarEntities();
    const dialog = document.createElement("dialog");
    dialog.style.cssText = "background:var(--card-background-color, white);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:12px;padding:24px;width:min(560px, calc(100vw - 64px));max-height:85vh;overflow:auto;";
    const start = this._getActiveDate();
    start.setHours(this._config.start_hour, 0, 0, 0);
    const end = new Date(start.getTime() + 3600000);
    const defaultUntil = new Date(start);
    defaultUntil.setMonth(defaultUntil.getMonth() + 3);
    const field = (label, input) => `<label style="display:grid;gap:4px;">${label}${input}</label>`;
    const options = entities => entities.map(entity => `<option value="${escape(entity)}">${escape(this._calendarName(entity))}</option>`).join("");
    const checkboxes = (entities, name, selectFirst = false) => entities.map((entity, index) => `<label style="display:block;margin:6px 0;"><input type="checkbox" name="${name}" value="${escape(entity)}" ${selectFirst && index === 0 ? "checked" : ""}> ${escape(this._calendarName(entity))}</label>`).join("");
    const days = [
      [1, text("Mon", "Пн")], [2, text("Tue", "Вт")], [3, text("Wed", "Ср")],
      [4, text("Thu", "Чт")], [5, text("Fri", "Пт")], [6, text("Sat", "Сб")], [0, text("Sun", "Вс")]
    ];
    dialog.innerHTML = `<form style="display:grid;gap:14px;">
      <h2 style="margin:0;font-size:20px;">${text("Add event", "Добавить событие")}</h2>
      ${field(text("Template", "Шаблон"), `<select name="template"><option value="">${text("Custom settings", "Свои настройки")}</option><option value="school">${text("School activity", "Учебное занятие")}</option></select>`)}
      <details><summary>${text("Save these settings as a template", "Сохранить настройки как шаблон")}</summary>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
          <input name="templateName" aria-label="${text("Template name", "Название шаблона")}" placeholder="${text("Template name", "Название шаблона")}" maxlength="80" style="flex:1;">
          <button type="button" data-save-template>${text("Save", "Сохранить")}</button>
          <button type="button" data-delete-template disabled>${text("Delete", "Удалить")}</button>
        </div><small>${text("Templates are saved in this browser for your Home Assistant user.", "Шаблоны сохраняются в этом браузере для вашего пользователя Home Assistant.")}</small>
      </details>
      <fieldset><legend>${text("Add to calendars", "Добавить в календари")}</legend>${checkboxes(calendars.map(calendar => calendar.entity), "destination", true)}</fieldset>
      ${field(text("Title", "Название"), '<input name="summary" required maxlength="255" autofocus>')}
      <div>
        <div data-icon-fallback>${field(text("Event icon (optional)", "Иконка события (необязательно)"), '<input name="eventIcon" placeholder="mdi:tennis-ball" maxlength="120" autocomplete="off">')}</div>
        <div data-icon-picker hidden></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
          ${[
            ["mdi:drama-masks", text("Theatre", "Театр")],
            ["mdi:music", text("Music", "Музыка")],
            ["mdi:tennis-ball", text("Tennis", "Теннис")],
            ["mdi:sail-boat", text("Sailing", "Парусный спорт")],
            ["mdi:soccer", text("Football", "Футбол")],
            ["mdi:run", text("Running", "Бег")],
            ["mdi:cat", text("Cat", "Кошка")],
            ["mdi:dog", text("Dog", "Собака")],
            ["mdi:school", text("School meeting", "Собрание в школе")],
            ["", text("None", "Без иконки")]
          ].map(([icon, label]) => `<button type="button" data-icon-choice="${icon}" aria-label="${label}">${icon ? `${EVENT_ICON_UNICODE[icon]} ` : ""}${label}</button>`).join("")}
        </div>
        <div data-icon-title-preview style="margin-top:6px;"></div>
        <small>${text("Known icons become Unicode in the title, e.g. 🎾 Tennis. A leading emoji selects its MDI icon. Other icons use [mdi:icon-name].", "Знакомые иконки сохраняются символами: 🎾 Теннис. Символ в начале названия выбирает MDI-иконку. Для остальных используется [mdi:имя-иконки].")}</small>
      </div>
      <label><input name="allDay" type="checkbox"> ${text("All day", "Весь день")}</label>
      ${field(text("Start", "Начало"), `<input name="start" type="datetime-local" value="${this._localDateValue(start)}" required>`)}
      ${field(text("End", "Окончание"), `<input name="end" type="datetime-local" value="${this._localDateValue(end)}" required>`)}
      <small data-end-hint hidden>${text("For all-day events, end is the day after the last event day.", "Для событий на весь день окончание — день после последнего дня события.")}</small>
      ${field(text("Repeat", "Повторение"), `<select name="recurrence"><option value="none">${text("Does not repeat", "Не повторять")}</option><option value="weekly">${text("Weekly", "По неделям")}</option><option value="daily">${text("Daily", "По дням")}</option></select>`)}
      <div data-repeat-settings hidden>
        ${field('<span data-interval-label></span>', '<input name="interval" type="number" min="1" max="52" value="1" required>')}
        <fieldset data-weekdays><legend>${text("Days of the week", "Дни недели")}</legend><div style="display:flex;gap:10px;flex-wrap:wrap;">${days.map(([day, label]) => `<label><input name="weekday" type="checkbox" value="${day}" ${day === start.getDay() ? "checked" : ""}> ${label}</label>`).join("")}</div></fieldset>
        <label style="display:block;margin:12px 0;"><input name="schoolYear" type="checkbox"> ${text("Until the end of the school year", "До конца учебного года")}</label>
        <div data-until>${field(text("Repeat through (inclusive)", "Повторять по дату включительно"), `<input name="until" type="date" value="${this._localDateValue(defaultUntil, true)}">`)}</div>
        <div data-school-year hidden>
          ${field(text("School holiday calendar", "Календарь каникул"), `<select name="holidayCalendar"><option value="">${text("Select a calendar", "Выберите календарь")}</option>${options(allCalendars)}</select>`)}
          <small>${text("Stops before the first event starting in June, July or August of this school year.", "До первого события, начинающегося в июне, июле или августе этого учебного года.")}</small>
        </div>
      </div>
      <details data-exclusions><summary>${text("Skip days with events in other calendars", "Если не каникулы / не праздник")}</summary>
        <fieldset><legend>${text("Skip a whole day if any of these calendars has an event", "Пропускать весь день, если есть событие в любом из календарей")}</legend>${checkboxes(allCalendars, "exclusion")}</fieldset>
      </details>
      ${field(text("Location", "Место"), '<input name="location">')}
      ${field(text("Description", "Описание"), '<textarea name="description" rows="3"></textarea>')}
      <small>${text("Repeats are created as separate events. Holiday conditions are checked when preparing the series; later calendar changes do not update created events.", "Повторения создаются отдельными событиями. Условия проверяются при подготовке серии; последующие изменения календарей не изменяют созданные события.")}</small>
      <div data-preview hidden aria-live="polite" style="border:1px solid var(--divider-color);border-radius:6px;padding:12px;"></div>
      <div role="status" data-progress aria-live="polite"></div>
      <div role="alert" data-error style="color:var(--error-color);" hidden></div>
      <div style="display:flex;flex-wrap:wrap;justify-content:flex-end;gap:12px;">
        <button type="button" data-cancel>${text("Cancel", "Отмена")}</button>
        <button type="button" data-plan>${text("Preview", "Предпросмотр")}</button>
        <button type="submit">${text("Create", "Создать")}</button>
      </div>
    </form>`;
    dialog.querySelectorAll("input:not([type=checkbox]), select, textarea, button").forEach(control => {
      const layout = control.style.cssText;
      control.style.cssText = `${layout}font:inherit;color:inherit;background:var(--primary-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:8px;min-width:0;box-sizing:border-box;`;
    });
    dialog.querySelectorAll("fieldset").forEach(fieldset => {
      fieldset.style.cssText = "min-width:0;border:1px solid var(--divider-color);border-radius:6px;";
    });
    const form = dialog.querySelector("form");
    const controls = form.elements;
    const submit = dialog.querySelector('[type="submit"]');
    const preview = dialog.querySelector("[data-preview]");
    const error = dialog.querySelector("[data-error]");
    const progress = dialog.querySelector("[data-progress]");
    let plan = null;
    const completed = new Set();
    let busy = false;
    let templates = this._readEventTemplates();
    const selected = name => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`), input => input.value);
    const values = () => ({
      entities: selected("destination"), summary: controls.summary.value, eventIcon: controls.eventIcon.value,
      start: controls.start.value, end: controls.end.value, allDay: controls.allDay.checked,
      location: controls.location.value, description: controls.description.value,
      recurrence: controls.recurrence.value, interval: Number(controls.interval.value),
      weekdays: selected("weekday").map(Number), until: controls.until.value,
      schoolYear: controls.schoolYear.checked, holidayCalendar: controls.holidayCalendar.value,
      excludeCalendars: selected("exclusion")
    });
    let iconPicker = null;
    const updateIconPreview = () => {
      const title = this._parseEventTitle(controls.summary.value);
      const eventIcon = controls.eventIcon.value.trim() || title.eventIcon;
      const target = dialog.querySelector("[data-icon-title-preview]");
      target.innerHTML = this._renderEventSummary({ summary: title.summary, eventIcon: /^mdi:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventIcon) ? eventIcon : "" });
      if (iconPicker) iconPicker.value = controls.eventIcon.value;
    };
    // Reuse Home Assistant's searchable picker when its component is loaded.
    if (customElements.get("ha-icon-picker")) {
      iconPicker = document.createElement("ha-icon-picker");
      iconPicker.label = text("Event icon (optional)", "Иконка события (необязательно)");
      iconPicker.placeholder = "mdi:tennis-ball";
      iconPicker.addEventListener("value-changed", event => {
        if (busy || completed.size) return;
        controls.eventIcon.value = event.detail?.value || "";
        controls.eventIcon.dispatchEvent(new Event("input", { bubbles: true }));
      });
      dialog.querySelector("[data-icon-picker]").appendChild(iconPicker);
      dialog.querySelector("[data-icon-picker]").hidden = false;
      dialog.querySelector("[data-icon-fallback]").hidden = true;
    }
    dialog.querySelectorAll("[data-icon-choice]").forEach(button => {
      button.onclick = () => {
        controls.eventIcon.value = button.dataset.iconChoice;
        controls.eventIcon.dispatchEvent(new Event("input", { bubbles: true }));
      };
    });
    const updateVisibility = () => {
      updateIconPreview();
      const repeating = controls.recurrence.value !== "none";
      dialog.querySelector("[data-repeat-settings]").hidden = !repeating;
      dialog.querySelector("[data-interval-label]").textContent = controls.recurrence.value === "weekly"
        ? text("Repeat every N weeks", "Повторять каждые N недель")
        : text("Repeat every N days", "Повторять каждые N дней");
      dialog.querySelector("[data-weekdays]").hidden = controls.recurrence.value !== "weekly";
      dialog.querySelector("[data-until]").hidden = controls.schoolYear.checked;
      dialog.querySelector("[data-school-year]").hidden = !controls.schoolYear.checked;
      dialog.querySelector("[data-end-hint]").hidden = !controls.allDay.checked;
      controls.until.required = repeating && !controls.schoolYear.checked;
      controls.holidayCalendar.required = repeating && controls.schoolYear.checked;
      controls.interval.required = repeating;
      dialog.querySelector("[data-delete-template]").disabled = busy || completed.size > 0 || !controls.template.value.startsWith("saved:");
    };
    const invalidate = () => {
      if (busy || completed.size) return;
      plan = null;
      preview.hidden = true;
      progress.textContent = "";
      submit.textContent = text("Create", "Создать");
      submit.disabled = false;
    };
    form.addEventListener("input", event => {
      if (["templateName", "template"].includes(event.target.name)) return;
      if (event.target.name === "summary") {
        controls.eventIcon.value = this._parseEventTitle(controls.summary.value).eventIcon;
      } else if (event.target.name === "eventIcon") {
        const icon = controls.eventIcon.value.trim();
        if (!icon || /^mdi:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(icon)) {
          controls.summary.value = this._eventSummaryWithIcon(controls.summary.value, icon);
        }
      }
      invalidate();
      updateVisibility();
    });
    form.addEventListener("change", event => {
      if (["templateName", "template"].includes(event.target.name)) return;
      invalidate();
      updateVisibility();
    });
    const setBusy = active => {
      busy = active;
      if (active) dialog.dataset.saving = "true";
      else delete dialog.dataset.saving;
      Array.from(controls).forEach(control => { control.disabled = active || completed.size > 0; });
      if (iconPicker) iconPicker.disabled = active || completed.size > 0;
      if (!active) {
        submit.disabled = false;
        dialog.querySelector("[data-cancel]").disabled = false;
        updateVisibility();
      }
    };
    const refresh = () => {
      this._reloadAfterLoad = true;
      if (!this._loadInFlight) {
        this._reloadAfterLoad = false;
        this.loadEvents(true);
      }
    };
    const close = () => {
      if (busy) return;
      dialog.close();
      dialog.remove();
      this.querySelector('[data-action="add"]')?.focus();
    };
    dialog.querySelector("[data-cancel]").onclick = close;
    dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
    controls.allDay.onchange = () => {
      const allDay = controls.allDay.checked;
      for (const name of ["start", "end"]) {
        const value = controls[name].value;
        controls[name].type = allDay ? "date" : "datetime-local";
        controls[name].value = allDay ? value.slice(0, 10) : `${value}T${name === "start" ? "09:00" : "10:00"}`;
      }
      if (allDay && controls.end.value <= controls.start.value) {
        const nextDay = new Date(`${controls.start.value}T12:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        controls.end.value = this._localDateValue(nextDay, true);
      }
      invalidate();
      updateVisibility();
    };
    const renderPreview = () => {
      const date = value => value.toLocaleString(undefined, controls.allDay.checked ? { dateStyle: "medium" } : { dateStyle: "medium", timeStyle: "short" });
      const title = this._parseEventTitle(controls.summary.value);
      const eventIcon = controls.eventIcon.value.trim() || title.eventIcon;
      preview.innerHTML = `<div style="margin-bottom:6px;">${this._renderEventSummary({ summary: title.summary, eventIcon })}</div><strong>${text("Dates", "Дат")}: ${plan.accepted.length}; ${text("calendars", "календарей")}: ${plan.entities.length}; ${text("events to create", "записей к созданию")}: ${plan.tasks.length}</strong>
        <div>${text("Skipped dates", "Пропущено дат")}: ${plan.skipped.length}</div>
        ${plan.summer ? `<div>${text("Summer holidays start", "Начало летних каникул")}: ${escape(this._localDateValue(plan.summer.start, true))} — ${escape(plan.summer.summary)}</div>` : ""}
        <details><summary>${text("Show dates", "Показать даты")}</summary><div style="max-height:200px;overflow:auto;">
        ${plan.accepted.map(item => `<div>${escape(date(item.start))} → ${escape(date(item.end))}</div>`).join("")}
        ${plan.skipped.map(item => `<div>${escape(date(item.start))} — ${text("skipped", "пропущено")}: ${escape(item.reasons.map(reason => `${this._calendarName(reason.entity)}: ${reason.summary}`).join("; "))}</div>`).join("")}
        </div></details>`;
      preview.hidden = false;
      submit.disabled = !plan.tasks.length;
      submit.textContent = `${text("Create", "Создать")} (${plan.tasks.length})`;
    };
    const prepare = async () => {
      if (!form.reportValidity()) return false;
      plan = null;
      preview.hidden = true;
      plan = await this._planEventSeries(values());
      renderPreview();
      return true;
    };
    dialog.querySelector("[data-plan]").onclick = async () => {
      if (busy || completed.size || !form.reportValidity()) return;
      error.hidden = true;
      setBusy(true);
      try { await prepare(); }
      catch (err) { error.textContent = err?.message || String(err); error.hidden = false; }
      finally { setBusy(false); if (plan) submit.disabled = !plan.tasks.length; }
    };
    form.onsubmit = async event => {
      event.preventDefault();
      if (busy || (!completed.size && !form.reportValidity())) return;
      error.hidden = true;
      const input = values();
      const needsPreview = input.entities.length > 1 || input.recurrence !== "none" || input.excludeCalendars.length > 0;
      setBusy(true);
      try {
        if (!plan) {
          if (!await prepare()) return;
          if (needsPreview) return;
        }
        if (!plan.tasks.length) return;
        await this._writeEventPlan(plan, completed, (done, total) => {
          progress.textContent = `${text("Created", "Создано")}: ${done} / ${total}`;
        });
        setBusy(false);
        close();
        refresh();
      } catch (err) {
        error.textContent = completed.size
          ? `${text("Created", "Создано")}: ${completed.size} / ${plan.tasks.length}. ${err?.message || String(err)}. ${text("Retry sends only remaining events. If a request timed out, check that event in the calendar before retrying.", "Повтор отправит только оставшиеся события. При тайм-ауте проверьте соответствующее событие в календаре перед повтором.")}`
          : err?.message || String(err);
        error.hidden = false;
        if (completed.size) {
          submit.textContent = text("Retry remaining", "Повторить оставшиеся");
          refresh();
        }
      } finally {
        setBusy(false);
        if (plan && !completed.size) submit.disabled = !plan.tasks.length;
      }
    };
    const populateTemplates = () => {
      controls.template.querySelectorAll('[data-saved]').forEach(option => option.remove());
      templates.forEach((template, index) => {
        const option = document.createElement("option");
        option.value = `saved:${index}`;
        option.dataset.saved = "true";
        option.textContent = template.name;
        controls.template.appendChild(option);
      });
    };
    const applyTemplate = template => {
      const settings = template.values;
      for (const [name, items] of [["destination", settings.entities || []], ["exclusion", settings.excludeCalendars || []], ["weekday", (settings.weekdays || []).map(String)]]) {
        form.querySelectorAll(`input[name="${name}"]`).forEach(input => { input.checked = items.includes(input.value); });
      }
      for (const name of ["summary", "eventIcon", "description", "location", "recurrence", "interval", "holidayCalendar"]) {
        if (settings[name] !== undefined) controls[name].value = settings[name];
      }
      if (settings.eventIcon !== undefined || settings.summary !== undefined) {
        controls.eventIcon.value = settings.eventIcon || this._parseEventTitle(controls.summary.value).eventIcon;
      }
      controls.schoolYear.checked = !!settings.schoolYear;
      if (settings.allDay !== undefined) {
        controls.allDay.checked = !!settings.allDay;
        const day = controls.start.value.slice(0, 10);
        const templateStart = new Date(`${day}T${settings.startTime || "09:00"}`);
        const templateEnd = new Date(`${day}T${settings.endTime || "10:00"}`);
        templateEnd.setDate(templateEnd.getDate() + Number(settings.endDayOffset || 0));
        for (const [name, value] of [["start", templateStart], ["end", templateEnd]]) {
          controls[name].type = settings.allDay ? "date" : "datetime-local";
          controls[name].value = this._localDateValue(value, !!settings.allDay);
        }
      }
      if (settings.untilDays !== undefined) {
        const until = new Date(`${controls.start.value.slice(0, 10)}T12:00:00`);
        until.setDate(until.getDate() + Number(settings.untilDays));
        controls.until.value = this._localDateValue(until, true);
      }
      dialog.querySelector("[data-exclusions]").open = selected("exclusion").length > 0;
      invalidate();
      updateVisibility();
    };
    controls.template.onchange = () => {
      if (controls.template.value === "school") {
        const holiday = allCalendars.find(entity => /каникул|holiday|vacances|ferien/i.test(this._calendarName(entity) + " " + entity)) || "";
        const exclusions = allCalendars.filter(entity => /каникул|праздник|holiday|vacances|férié|ferien/i.test(this._calendarName(entity) + " " + entity));
        applyTemplate({ values: { recurrence: "weekly", interval: 1, weekdays: [new Date(`${controls.start.value.slice(0, 10)}T12:00:00`).getDay()], schoolYear: true, holidayCalendar: holiday, excludeCalendars: exclusions, entities: selected("destination") } });
      } else if (controls.template.value.startsWith("saved:")) {
        const template = templates[Number(controls.template.value.slice(6))];
        if (template) { applyTemplate(template); controls.templateName.value = template.name; }
      }
      updateVisibility();
    };
    const persistTemplates = () => localStorage.setItem(this._eventTemplateStorageKey(), JSON.stringify(templates));
    dialog.querySelector("[data-save-template]").onclick = () => {
      error.hidden = true;
      const name = controls.templateName.value.trim();
      if (!name) { error.textContent = text("Enter a template name.", "Введите название шаблона."); error.hidden = false; return; }
      const settings = values();
      const from = new Date(`${settings.start.slice(0, 10)}T12:00:00`);
      const to = new Date(`${settings.end.slice(0, 10)}T12:00:00`);
      if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) return;
      const template = { name, values: { ...settings, startTime: settings.start.slice(11) || "00:00", endTime: settings.end.slice(11) || "00:00", endDayOffset: this._dateOrdinal(to) - this._dateOrdinal(from), untilDays: Math.max(0, this._dateOrdinal(new Date(`${settings.until}T12:00:00`)) - this._dateOrdinal(from)) } };
      delete template.values.start;
      delete template.values.end;
      delete template.values.until;
      const previous = templates.slice();
      const index = templates.findIndex(item => item.name === name);
      if (index >= 0) templates[index] = template;
      else templates.push(template);
      try {
        persistTemplates();
        populateTemplates();
        controls.template.value = `saved:${index >= 0 ? index : templates.length - 1}`;
        progress.textContent = text("Template saved.", "Шаблон сохранён.");
        updateVisibility();
      } catch (err) { templates = previous; error.textContent = text("Could not save the template in this browser.", "Не удалось сохранить шаблон в этом браузере."); error.hidden = false; }
    };
    dialog.querySelector("[data-delete-template]").onclick = () => {
      if (!controls.template.value.startsWith("saved:")) return;
      const previous = templates.slice();
      templates.splice(Number(controls.template.value.slice(6)), 1);
      try { persistTemplates(); populateTemplates(); controls.template.value = ""; updateVisibility(); }
      catch (err) { templates = previous; error.textContent = text("Could not delete the template.", "Не удалось удалить шаблон."); error.hidden = false; }
    };
    populateTemplates();
    updateVisibility();
    this.appendChild(dialog);
    dialog.showModal();
  }

  _eventOverlapsDay(ev, dayStart, dayEnd) {
    if (ev.allDay) {
      const startDay = new Date(ev.start);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(ev.end);
      endDay.setHours(0, 0, 0, 0);
      const durationDays = Math.round((endDay - startDay) / 86400000);
      if (durationDays <= 1) {
        return this._isSameDay(startDay, dayStart);
      }
    }
    return ev.start < dayEnd && ev.end > dayStart;
  }

  renderWeekView(events) {
    const { start } = this._getViewRange();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    const out = days.map(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const isToday = this._isSameDay(day, new Date());
      const dayEvents = (events || [])
        .filter(ev => this._eventOverlapsDay(ev, dayStart, dayEnd))
        .sort((a, b) => a.start - b.start || a.end - b.end);
      const items = dayEvents.map(ev => {
        if (ev.allDay) {
          const bg = this._eventBackground(ev);
          return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">${this._renderEventTitle(ev)}</div>`;
        }
        const bg = this._eventBackground(ev);
        const timeLabel = this._formatTimeLabel(ev.start);
        const badgeText = `${this._escapeHtml(timeLabel)} ${this._renderEventPrefix(ev)}`;
        return `<div style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">
          <span style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:4px;padding:1px 4px;margin-right:4px;display:inline-block;">${badgeText}</span>
          ${this._renderEventSummary(ev)}
        </div>`;
      }).join("");
      return `<div style="flex:1;min-width:0;border-left:1px solid var(--divider-color);padding:8px;${isToday ? "box-shadow:inset 0 0 0 2px var(--error-color);" : ""}">
        <div style="font-size:13px;font-weight:600;color:var(--secondary-text-color);margin-bottom:4px;">${this._escapeHtml(this._formatDateLabel(day))}</div>
        ${items || '<div style="color:var(--secondary-text-color);font-size:11px;">No events</div>'}
      </div>`;
    }).join("");
    return `<div style="display:flex;border-top:1px solid var(--divider-color);">${out}</div>`;
  }

  renderMonthView(events) {
    const { start } = this._getViewRange();
    const monthStart = this._getMonthStart(this._getActiveDate());
    const gridStart = this._getWeekStart(monthStart);
    const cells = [];
    for (let week = 0; week < 6; week++) {
      let weekHasCurrentMonth = false;
      const weekCells = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + week * 7 + i);
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);
        const isToday = this._isSameDay(day, new Date());
        const isCurrentMonth = day.getMonth() === monthStart.getMonth();
        if (isCurrentMonth) {
          weekHasCurrentMonth = true;
        }
        const dayEvents = isCurrentMonth
          ? (events || [])
            .filter(ev => this._eventOverlapsDay(ev, dayStart, dayEnd))
            .sort((a, b) => a.start - b.start || a.end - b.end)
          : [];
        const items = dayEvents.map(ev => {
          if (ev.allDay) {
            const bg = this._eventBackground(ev);
            return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">${this._renderEventTitle(ev)}</div>`;
          }
          const bg = this._eventBackground(ev);
          const timeLabel = this._formatTimeLabel(ev.start);
          const badgeText = `${this._escapeHtml(timeLabel)} ${this._renderEventPrefix(ev)}`;
          return `<div style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">
            <span style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:4px;padding:0 3px;margin-right:3px;display:inline-block;">${badgeText}</span>
            ${this._renderEventSummary(ev)}
          </div>`;
        }).join("");
        const dayLabel = isCurrentMonth
          ? `<div style="font-size:13px;font-weight:600;color:var(--secondary-text-color);">${day.getDate()}</div>`
          : "";
        weekCells.push(`<div style="border:1px solid var(--divider-color);padding:6px;box-sizing:border-box;${isCurrentMonth ? "" : "background:var(--secondary-background-color);"}${isToday ? "box-shadow:inset 0 0 0 2px var(--error-color);" : ""}">
          ${dayLabel}
          ${items}
        </div>`);
      }
      if (weekHasCurrentMonth) {
        cells.push(...weekCells);
      }
    }
    return `<div style="display:grid;grid-template-columns:repeat(7, minmax(0, 1fr));gap:0;border-top:1px solid var(--divider-color);">${cells.join("")}</div>`;
  }

  _timeTicks(start, end, step) {
    const duration = (end - start) * 60;
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(step) || step <= 0) return [];
    const ticks = [];
    for (let minutes = 0; minutes < duration; minutes += step) {
      ticks.push({ minutes: start * 60 + minutes, top: minutes / duration * 100 });
    }
    ticks.push({ minutes: end * 60, top: 100 });
    return ticks;
  }

  renderTimeAxis(start, end, step) {
    return this._timeTicks(start, end, step).map(tick => {
      const hours = String(Math.floor(tick.minutes / 60)).padStart(2, "0");
      const minutes = String(tick.minutes % 60).padStart(2, "0");
      return `<span style="position:absolute;top:${tick.top}%;left:4px;right:8px;transform:translateY(-50%);text-align:right;white-space:nowrap;font-size:11px;line-height:16px;font-variant-numeric:tabular-nums;color:var(--secondary-text-color);">${hours}:${minutes}</span>`;
    }).join("");
  }

  renderGrid(start, end, step) {
    return this._timeTicks(start, end, step).map(tick =>
      `<div style="position:absolute;top:${tick.top}%;left:0;right:0;border-top:1px solid var(--divider-color);height:1px;"></div>`
    ).join("");
  }

  renderEvents(events, start, end) {
    const timedEvents = (events || []).filter(ev => !ev.allDay);
    const totalMinutes = (end - start) * 60;
    const baseDate = this._getActiveDate();
    const windowStart = new Date(baseDate);
    windowStart.setHours(start, 0, 0, 0);
    const windowEnd = new Date(baseDate);
    windowEnd.setHours(end, 0, 0, 0);
    const laidOut = this._layoutEvents(timedEvents, windowStart, windowEnd);
    let o = laidOut.map(ev => {
      this._log(ev);
      const startClamped = ev._startClamped;
      const endClamped = ev._endClamped;
      if (endClamped <= startClamped) {
        return '';
      }
      const startMin = (startClamped - windowStart) / 60000;
      const durMin = (endClamped - startClamped) / 60000;
      const top = (startMin / totalMinutes) * 100;
      const height = (durMin / totalMinutes) * 100;
      const width = 100 / ev._columns;
      const left = width * ev._column;
      const bg = this._eventBackground(ev);
      return `<div style="position:absolute;left:${left}%;width:${width}%;top:${top}%;height:${height}%;background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px;font-size:12px;box-sizing:border-box;overflow:hidden;">${this._renderEventTitle(ev)}</div>`;
    }).join('');
    return o;
  }

  renderAllDayEvents(events) {
    const allDay = (events || []).filter(ev => ev.allDay);
    if (allDay.length === 0) {
      return '';
    }
    const items = allDay.map(ev => {
      const bg = this._eventBackground(ev);
      return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._renderEventTitle(ev)}</div>`;
    }).join('');
    return `<div style="padding:6px;border-bottom:1px solid var(--divider-color);display:flex;flex-wrap:wrap;gap:6px;">${items}</div>`;
  }

  _parseEventTimes(event) {
    if (!event || !event.start || !event.end) return null;
    const startValue = typeof event.start === "string" ? event.start : event.start.date || event.start.dateTime;
    const endValue = typeof event.end === "string" ? event.end : event.end.date || event.end.dateTime;
    if (typeof startValue !== "string" || typeof endValue !== "string") return null;
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(startValue) && /^\d{4}-\d{2}-\d{2}$/.test(endValue);
    return {
      start: new Date(allDay ? `${startValue}T00:00:00` : startValue),
      end: new Date(allDay ? `${endValue}T00:00:00` : endValue),
      allDay
    };
  }

  renderNowLine(start, end) {
    const now = new Date();
    const baseDate = this._getActiveDate();
    if (!this._isSameDay(now, baseDate)) {
      return '';
    }
    const windowStart = new Date(baseDate);
    windowStart.setHours(start, 0, 0, 0);
    const windowEnd = new Date(baseDate);
    windowEnd.setHours(end, 0, 0, 0);
    if (now < windowStart || now > windowEnd) {
      return '';
    }
    const totalMinutes = (end - start) * 60;
    const nowMin = (now - windowStart) / 60000;
    const top = (nowMin / totalMinutes) * 100;
    const color = this._config.now_line_color || "var(--error-color)";
    const width = Number.isFinite(this._config.now_line_width)
      ? this._config.now_line_width
      : 2;
    return `<div style="position:absolute;left:0;right:0;top:${top}%;height:0;border-top:${width}px solid ${color};z-index:5;pointer-events:none;"></div>`;
  }

  _layoutEvents(events, windowStart, windowEnd) {
    const normalized = events.map(ev => {
      const startClamped = ev.start < windowStart ? windowStart : ev.start;
      const endClamped = ev.end > windowEnd ? windowEnd : ev.end;
      return {
        ...ev,
        _startClamped: startClamped,
        _endClamped: endClamped,
        _column: 0,
        _columns: 1
      };
    }).filter(ev => ev._endClamped > ev._startClamped);

    normalized.sort((a, b) => a._startClamped - b._startClamped || a._endClamped - b._endClamped);

    let group = [];
    let groupEnd = null;
    const finalizeGroup = () => {
      if (group.length === 0) return;
      // Group by calendar index (config order), then pack within each calendar's block
      const byCalendar = new Map();
      for (const ev of group) {
        const idx = ev.calendarIndex ?? 0;
        if (!byCalendar.has(idx)) byCalendar.set(idx, []);
        byCalendar.get(idx).push(ev);
      }
      const sortedIndices = [...byCalendar.keys()].sort((a, b) => a - b);
      let totalColumns = 0;
      for (const calIdx of sortedIndices) {
        const calEvents = byCalendar.get(calIdx);
        calEvents.sort((a, b) => a._startClamped - b._startClamped || a._endClamped - b._endClamped);
        const columnsEnd = [];
        for (const ev of calEvents) {
          let col = 0;
          while (col < columnsEnd.length && columnsEnd[col] > ev._startClamped) col++;
          if (col === columnsEnd.length) columnsEnd.push(ev._endClamped);
          else columnsEnd[col] = ev._endClamped;
          ev._column = totalColumns + col;
        }
        totalColumns += columnsEnd.length;
      }
      for (const ev of group) {
        ev._columns = totalColumns;
      }
      group = [];
      groupEnd = null;
    };

    for (const ev of normalized) {
      if (groupEnd !== null && ev._startClamped >= groupEnd) {
        finalizeGroup();
      }
      group.push(ev);
      groupEnd = groupEnd === null ? ev._endClamped : new Date(Math.max(groupEnd, ev._endClamped));
    }
    finalizeGroup();

    return normalized;
  }
}

console.warn("outlook-calendar-card");

if (!customElements.get("outlook-calendar-card")) {
  customElements.define("outlook-calendar-card", OutlookCalendarCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "outlook-calendar-card",
  name: "Outlook style calendar",
  description: "Time grid calendar with events like Outlook",
});
