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

  _renderEventTitle(event) {
    return this._renderEventPrefix(event) + this._escapeHtml(event.summary || "");
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
                summary: e && e.summary ? e.summary : "",
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
    if (!values.summary.trim()) {
      throw new Error(this._text("Enter an event title.", "Введите название события."));
    }
    const start = new Date(values.start);
    const end = new Date(values.end);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      throw new Error(this._text("End must be after start.", "Окончание должно быть позже начала."));
    }
    return {
      entity_id: values.entity,
      summary: values.summary.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      ...(values.allDay
        ? { start_date: values.start, end_date: values.end }
        : { start_date_time: start.toISOString(), end_date_time: end.toISOString() })
    };
  }

  _openEventDialog() {
    if (this.querySelector("dialog")) return;
    const calendars = this._writableCalendars();
    if (!calendars.length) return;
    const hass = this._hass || window.hass;
    const text = (english, russian) => this._text(english, russian);
    const dialog = document.createElement("dialog");
    dialog.style.cssText = "background:var(--card-background-color, white);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:12px;padding:24px;width:min(420px, calc(100vw - 64px));max-height:80vh;overflow:auto;";
    const start = this._getActiveDate();
    start.setHours(this._config.start_hour, 0, 0, 0);
    const end = new Date(start.getTime() + 3600000);
    const field = (label, input) => `<label style="display:grid;gap:4px;">${label}${input}</label>`;
    dialog.innerHTML = `<form style="display:grid;gap:14px;">
      <h2 style="margin:0;font-size:20px;">${text("Add event", "Добавить событие")}</h2>
      ${field(text("Calendar", "Календарь"), `<select name="entity" required>${calendars.map(calendar => `<option value="${this._escapeHtml(calendar.entity)}">${this._escapeHtml(hass.states[calendar.entity]?.attributes?.friendly_name || calendar.entity)}</option>`).join("")}</select>`)}
      ${field(text("Title", "Название"), '<input name="summary" required maxlength="255" autofocus>')}
      <label><input name="allDay" type="checkbox"> ${text("All day", "Весь день")}</label>
      ${field(text("Start", "Начало"), `<input name="start" type="datetime-local" value="${this._localDateValue(start)}" required>`)}
      ${field(text("End", "Окончание"), `<input name="end" type="datetime-local" value="${this._localDateValue(end)}" required>`)}
      <small data-end-hint hidden>${text("For all-day events, end is the day after the last event day.", "Для событий на весь день окончание — день после последнего дня события.")}</small>
      ${field(text("Location", "Место"), '<input name="location">')}
      ${field(text("Description", "Описание"), '<textarea name="description" rows="3"></textarea>')}
      <div role="alert" data-error style="color:var(--error-color);" hidden></div>
      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button type="button" data-cancel>${text("Cancel", "Отмена")}</button>
        <button type="submit">${text("Create", "Создать")}</button>
      </div>
    </form>`;
    dialog.querySelectorAll("input:not([type=checkbox]), select, textarea, button").forEach(control => {
      control.style.cssText = "font:inherit;color:inherit;background:var(--primary-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:8px;min-width:0;";
    });
    const form = dialog.querySelector("form");
    const controls = form.elements;
    const close = () => {
      dialog.close();
      dialog.remove();
      this.querySelector('[data-action="add"]')?.focus();
    };
    dialog.querySelector("[data-cancel]").onclick = close;
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      if (!dialog.dataset.saving) close();
    });
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
      dialog.querySelector("[data-end-hint]").hidden = !allDay;
    };
    form.onsubmit = async event => {
      event.preventDefault();
      if (dialog.dataset.saving || !form.reportValidity()) return;
      const error = dialog.querySelector("[data-error]");
      error.hidden = true;
      try {
        const data = this._eventServiceData({
          entity: controls.entity.value, summary: controls.summary.value,
          start: controls.start.value, end: controls.end.value,
          allDay: controls.allDay.checked,
          location: controls.location.value, description: controls.description.value
        });
        dialog.dataset.saving = "true";
        Array.from(controls).forEach(control => { control.disabled = true; });
        await (this._hass || window.hass).callService("calendar", "create_event", data);
      } catch (err) {
        error.textContent = err?.message || String(err);
        error.hidden = false;
        delete dialog.dataset.saving;
        Array.from(controls).forEach(control => { control.disabled = false; });
        return;
      }
      close();
      // If an earlier fetch is still in progress, queue a fresh fetch after it.
      this._reloadAfterLoad = true;
      if (!this._loadInFlight) {
        this._reloadAfterLoad = false;
        this.loadEvents(true);
      }
    };
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
          ${this._escapeHtml(ev.summary || ev.title)}
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
            ${this._escapeHtml(ev.summary || ev.title)}
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
    if (event.start.date && event.end.date) {
      const start = new Date(`${event.start.date}T00:00:00`);
      const end = new Date(`${event.end.date}T00:00:00`);
      return { start, end, allDay: true };
    }
    if (event.start.dateTime && event.end.dateTime) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      return { start, end, allDay: false };
    }
    return null;
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
