class OutlookCalendarCard extends HTMLElement {
  setConfig(config) {
    this._config = {
      calendars: [],
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
    if (!Array.isArray(this._config.calendars)) {
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
    const hass = window.hass || this._hass;
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
        prefix: cal.prefix
      }))
    });
  }

  async _getCalendarColor(calendar) {
    if (!this._config) return "var(--primary-color)";
    if (calendar && calendar.color) return calendar.color;
    const hass = window.hass || this._hass;
    const entityId = calendar && calendar.entity;
    const state = hass && hass.states && entityId ? hass.states[entityId] : null;
    const attrs = state && state.attributes;
    const attrColor = attrs ? attrs.color : null;
    if (attrColor) return attrColor;
    const initialColor = attrs ? attrs.initial_color : null;
    if (initialColor) return initialColor;
    const registryColor = hass && hass.entities && calendar
      ? hass.entities[calendar.entity] && hass.entities[calendar.entity].color
      : null;
    if (registryColor) return registryColor;
    if (this._config && this._config.debug) {
      this._log("No color on state or hass.entities for", entityId, state);
    }
    if (!this._registryColorCache) {
      this._registryColorCache = {};
    }
    if (entityId && this._registryColorCache[entityId]) {
      return this._registryColorCache[entityId];
    }
    if (hass && typeof hass.callWS === "function" && entityId) {
      try {
        const reg = await hass.callWS({
          type: "config/entity_registry/get",
          entity_id: entityId
        });
        if (reg && reg.color) {
          this._registryColorCache[entityId] = reg.color;
          return reg.color;
        }
        if (this._config && this._config.debug) {
          this._log("Entity registry entry without color for", entityId, reg);
        }
      } catch (err) {
        this._log("Failed to fetch entity registry color", err);
      }
    }
    return "var(--primary-color)";
  }

  _normalizeCalendars(config) {
    if (Array.isArray(config.calendars) && config.calendars.length > 0) {
      return config.calendars.map(entry => {
        if (entry && typeof entry === "object") {
          if (entry.entity) {
            return {
              entity: entry.entity,
              color: entry.color || null,
              prefix: typeof entry.prefix === "string" ? entry.prefix : ""
            };
          }
        }
        return null;
      }).filter(Boolean);
    }

    return [];
  }

  _formatEventTitle(event, calendar) {
    const prefix = calendar && typeof calendar.prefix === "string" ? calendar.prefix : "";
    const summary = event && event.summary ? event.summary : "";
    return `${prefix}${summary}`;
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
          colors: ev.color ? [ev.color] : [],
          calendarIndex: ev.calendarIndex ?? 0
        });
        continue;
      }
      if (ev.prefix && !existing.prefixes.includes(ev.prefix)) {
        existing.prefixes.push(ev.prefix);
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
      const prefixText = ev.prefixes.length > 0 ? ev.prefixes.join("") : "";
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

  _eventBackground(ev) {
    const colors = Array.isArray(ev.colors) ? ev.colors.filter(Boolean) : [];
    if (colors.length <= 1) {
      return {
        background: colors[0] || ev.color || "var(--primary-color)",
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
      background: colors[0] || ev.color || "var(--primary-color)",
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

     const hass = window.hass || this._hass;
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
                title: this._formatEventTitle(e, calendar),
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
     }
  }

  render() {

    if (!this._config) return;
    const hass = window.hass || this._hass;
    if (!hass) return;

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
    o += `</div>`;
    const view = this._getView();
    if (view === "day") {
      o += this.renderAllDayEvents(this._events || []);
      o += `<div style="position:relative;height:${this._config.height}px;border-left:1px solid var(--divider-color);">`;
      o += this.renderGrid(start, end, step);
      if (this._error) {
        o += `<div style="padding:8px;color:var(--error-color);font-size:12px;">Failed to load calendar events</div>`;
      } else {
        o += this.renderEvents(this._events || [], start, end);
      }
      o += this.renderNowLine(start, end);
      o += '</div>';
    } else if (view === "week") {
      o += this.renderWeekView(this._events || []);
    } else {
      o += this.renderMonthView(this._events || []);
    }
    o += '</ha-card>';

    this.innerHTML = o;
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

  _eventPrefixText(ev) {
    if (Array.isArray(ev.prefixes) && ev.prefixes.length > 0) {
      return ev.prefixes.join("");
    }
    return ev.prefix || "";
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
          return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">${this._escapeHtml(ev.title)}</div>`;
        }
        const bg = this._eventBackground(ev);
        const timeLabel = this._formatTimeLabel(ev.start);
        const prefixText = this._eventPrefixText(ev);
        const badgeText = `${timeLabel} ${prefixText}`.trim();
        return `<div style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">
          <span style="background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:4px;padding:1px 4px;margin-right:4px;display:inline-block;">${this._escapeHtml(badgeText)}</span>
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
            return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">${this._escapeHtml(ev.title)}</div>`;
          }
          const bg = this._eventBackground(ev);
          const timeLabel = this._formatTimeLabel(ev.start);
          const prefixText = this._eventPrefixText(ev);
          const badgeText = `${timeLabel} ${prefixText}`.trim();
          return `<div style="background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">
            <span style="background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:4px;padding:0 3px;margin-right:3px;display:inline-block;">${this._escapeHtml(badgeText)}</span>
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

  renderGrid(start, end, step) {
    let out = '';
    const steps = (end - start) * 60 / step;
    for (let i = 0; i <= steps; i++) {
      const totalMin = start * 60 + i * step;
      const h = Math.floor(totalMin/60);
      const m = totalMin % 60;

     out += `<div style="
        	  position:absolute;
		  top:${(i/steps)*100}%;
		  left:0;
		  right:0;
		  border-top:1px solid var(--divider-color);
		  height:1px;
	     "></div>
	     <span style="
		  position:absolute;
  		  left:-42px;
    		  top:${(i/steps)*100}%;
  		  font-size:11px;
  		  color:var(--secondary-text-color);
	     ">${h}:${m.toString().padStart(2,'0')}</span>`;
    }
    return out;
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
      return `<div style="position:absolute;left:${left}%;width:${width}%;top:${top}%;height:${height}%;background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:6px;padding:2px;font-size:12px;box-sizing:border-box;overflow:hidden;">${this._escapeHtml(ev.title)}</div>`;
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
      return `<div style="background:${bg.background};background-image:${bg.backgroundImage};color:white;border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escapeHtml(ev.title)}</div>`;
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
