const CARD_TRANSLATIONS = {
  "en": {
    "add_event": "Add event",
    "error_edit_unsupported": "This calendar does not support editing events.",
    "error_create_unsupported": "This calendar does not support adding events.",
    "error_title_required": "Enter an event title.",
    "error_icon_name": "Use an MDI icon name, for example mdi:tennis-ball.",
    "error_end_before_start": "End must be after start.",
    "calendar_unavailable": "Calendar unavailable",
    "error_read_events": "Could not read calendar events.",
    "error_calendar_dates": "Invalid event dates in calendar",
    "error_calendar_required": "Select at least one calendar.",
    "error_repeat_rule": "Invalid repeat rule.",
    "error_repeat_interval": "Repeat interval must be between 1 and 52.",
    "error_weekdays_required": "Select days of the week.",
    "error_summer_not_found": "No summer holiday event found. Select another calendar or set an end date.",
    "error_repeat_end_required": "Set a repeat end date.",
    "error_repeat_horizon": "Choose an end date after the start, within two years.",
    "error_series_limit": "Limit the series to 366 dates or fewer.",
    "error_no_dates": "No dates match this repeat rule.",
    "calendar_no_longer_writable": "Calendar is no longer writable",
    "open_event": "Open event",
    "error_edit_unavailable": "This calendar does not support editing or is unavailable.",
    "error_event_id_missing": "The calendar did not provide an event ID for editing.",
    "error_occurrence_id_missing": "The calendar did not identify this occurrence. Edit the series in its calendar app.",
    "error_update_api_unavailable": "The calendar update API is unavailable.",
    "weekday_mon": "Mon",
    "weekday_tue": "Tue",
    "weekday_wed": "Wed",
    "weekday_thu": "Thu",
    "weekday_fri": "Fri",
    "weekday_sat": "Sat",
    "weekday_sun": "Sun",
    "edit_event": "Edit event",
    "event_calendar": "Event in calendar",
    "edit_scope_hint": "Only the selected calendar entry and date are changed.",
    "template": "Template",
    "custom_settings": "Custom settings",
    "school_activity": "School activity",
    "save_template_settings": "Save these settings as a template",
    "template_name": "Template name",
    "save": "Save",
    "delete": "Delete",
    "template_storage_hint": "Templates are saved in this browser for your Home Assistant user.",
    "add_to_calendars": "Add to calendars",
    "title": "Title",
    "event_icon": "Event icon (optional)",
    "icon_theatre": "Theatre",
    "icon_music": "Music",
    "icon_tennis": "Tennis",
    "icon_sailing": "Sailing",
    "icon_football": "Football",
    "icon_running": "Running",
    "icon_cat": "Cat",
    "icon_dog": "Dog",
    "icon_school_meeting": "School meeting",
    "icon_none": "None",
    "icon_unicode_hint": "Known icons become Unicode in the title, e.g. 🎾 Tennis. A leading emoji selects its MDI icon. Other icons use [mdi:icon-name].",
    "all_day": "All day",
    "start": "Start",
    "end": "End",
    "all_day_end_hint": "For all-day events, end is the day after the last event day.",
    "repeat": "Repeat",
    "repeat_none": "Does not repeat",
    "repeat_weekly": "Weekly",
    "repeat_daily": "Daily",
    "weekdays": "Days of the week",
    "school_year_end": "Until the end of the school year",
    "repeat_until": "Repeat through (inclusive)",
    "holiday_calendar": "School holiday calendar",
    "select_calendar": "Select a calendar",
    "school_year_hint": "Stops before the first event starting in June, July or August of this school year.",
    "skip_days": "Skip days with events in other calendars",
    "skip_days_hint": "Skip a whole day if any of these calendars has an event",
    "location": "Location",
    "description": "Description",
    "series_conditions_hint": "Repeats are created as separate events. Holiday conditions are checked when preparing the series; later calendar changes do not update created events.",
    "cancel": "Cancel",
    "preview": "Preview",
    "create": "Create",
    "repeat_interval_weeks": "Repeat every N weeks",
    "repeat_interval_days": "Repeat every N days",
    "save_changes": "Save changes",
    "dates": "Dates",
    "calendars": "calendars",
    "events_to_create": "events to create",
    "skipped_dates": "Skipped dates",
    "summer_starts": "Summer holidays start",
    "show_dates": "Show dates",
    "skipped": "skipped",
    "created": "Created",
    "retry_hint": "Retry sends only remaining events. If a request timed out, check that event in the calendar before retrying.",
    "retry_remaining": "Retry remaining",
    "error_template_name_required": "Enter a template name.",
    "template_saved": "Template saved.",
    "error_template_save": "Could not save the template in this browser.",
    "error_template_delete": "Could not delete the template.",
    "today": "Today",
    "day": "Day",
    "week": "Week",
    "month": "Month",
    "previous": "Previous",
    "next": "Next",
    "error_load_events": "Failed to load calendar events",
    "no_events": "No events",
    "card_name": "Outlook style calendar",
    "card_description": "Time grid calendar with events like Outlook",
    "error_required_fields": "Fill in the required field.",
    "error_invalid_field": "Check the field value.",
    "preparing_events": "Preparing events…",
    "preview_ready": "Check the preview, then click Create to confirm."
  },
  "ru": {
    "add_event": "Добавить событие",
    "error_edit_unsupported": "Этот календарь не поддерживает редактирование событий.",
    "error_create_unsupported": "Этот календарь не поддерживает добавление событий.",
    "error_title_required": "Введите название события.",
    "error_icon_name": "Укажите имя MDI-иконки, например mdi:tennis-ball.",
    "error_end_before_start": "Окончание должно быть позже начала.",
    "calendar_unavailable": "Календарь недоступен",
    "error_read_events": "Не удалось прочитать события календаря.",
    "error_calendar_dates": "Некорректные даты события в календаре",
    "error_calendar_required": "Выберите хотя бы один календарь.",
    "error_repeat_rule": "Некорректное правило повторения.",
    "error_repeat_interval": "Интервал повторения должен быть от 1 до 52.",
    "error_weekdays_required": "Выберите дни недели.",
    "error_summer_not_found": "Летние каникулы не найдены. Выберите другой календарь или укажите дату окончания.",
    "error_repeat_end_required": "Укажите дату окончания повторений.",
    "error_repeat_horizon": "Выберите окончание не раньше начала и не более чем через два года.",
    "error_series_limit": "Сократите серию до 366 дат или меньше.",
    "error_no_dates": "Нет дат, подходящих под правило повторения.",
    "calendar_no_longer_writable": "Запись в календарь больше недоступна",
    "open_event": "Открыть событие",
    "error_edit_unavailable": "Календарь не поддерживает редактирование или недоступен.",
    "error_event_id_missing": "Календарь не передал идентификатор события для редактирования.",
    "error_occurrence_id_missing": "Календарь не указал идентификатор повторения. Измените серию в приложении календаря.",
    "error_update_api_unavailable": "API изменения событий недоступен.",
    "weekday_mon": "Пн",
    "weekday_tue": "Вт",
    "weekday_wed": "Ср",
    "weekday_thu": "Чт",
    "weekday_fri": "Пт",
    "weekday_sat": "Сб",
    "weekday_sun": "Вс",
    "edit_event": "Редактировать событие",
    "event_calendar": "Событие в календаре",
    "edit_scope_hint": "Изменяется только эта дата и запись в выбранном календаре.",
    "template": "Шаблон",
    "custom_settings": "Свои настройки",
    "school_activity": "Учебное занятие",
    "save_template_settings": "Сохранить настройки как шаблон",
    "template_name": "Название шаблона",
    "save": "Сохранить",
    "delete": "Удалить",
    "template_storage_hint": "Шаблоны сохраняются в этом браузере для вашего пользователя Home Assistant.",
    "add_to_calendars": "Добавить в календари",
    "title": "Название",
    "event_icon": "Иконка события (необязательно)",
    "icon_theatre": "Театр",
    "icon_music": "Музыка",
    "icon_tennis": "Теннис",
    "icon_sailing": "Парусный спорт",
    "icon_football": "Футбол",
    "icon_running": "Бег",
    "icon_cat": "Кошка",
    "icon_dog": "Собака",
    "icon_school_meeting": "Собрание в школе",
    "icon_none": "Без иконки",
    "icon_unicode_hint": "Знакомые иконки сохраняются символами: 🎾 Теннис. Символ в начале названия выбирает MDI-иконку. Для остальных используется [mdi:имя-иконки].",
    "all_day": "Весь день",
    "start": "Начало",
    "end": "Окончание",
    "all_day_end_hint": "Для событий на весь день окончание — день после последнего дня события.",
    "repeat": "Повторение",
    "repeat_none": "Не повторять",
    "repeat_weekly": "По неделям",
    "repeat_daily": "По дням",
    "weekdays": "Дни недели",
    "school_year_end": "До конца учебного года",
    "repeat_until": "Повторять по дату включительно",
    "holiday_calendar": "Календарь каникул",
    "select_calendar": "Выберите календарь",
    "school_year_hint": "До первого события, начинающегося в июне, июле или августе этого учебного года.",
    "skip_days": "Если не каникулы / не праздник",
    "skip_days_hint": "Пропускать весь день, если есть событие в любом из календарей",
    "location": "Место",
    "description": "Описание",
    "series_conditions_hint": "Повторения создаются отдельными событиями. Условия проверяются при подготовке серии; последующие изменения календарей не изменяют созданные события.",
    "cancel": "Отмена",
    "preview": "Предпросмотр",
    "create": "Создать",
    "repeat_interval_weeks": "Повторять каждые N недель",
    "repeat_interval_days": "Повторять каждые N дней",
    "save_changes": "Сохранить изменения",
    "dates": "Дат",
    "calendars": "календарей",
    "events_to_create": "записей к созданию",
    "skipped_dates": "Пропущено дат",
    "summer_starts": "Начало летних каникул",
    "show_dates": "Показать даты",
    "skipped": "пропущено",
    "created": "Создано",
    "retry_hint": "Повтор отправит только оставшиеся события. При тайм-ауте проверьте соответствующее событие в календаре перед повтором.",
    "retry_remaining": "Повторить оставшиеся",
    "error_template_name_required": "Введите название шаблона.",
    "template_saved": "Шаблон сохранён.",
    "error_template_save": "Не удалось сохранить шаблон в этом браузере.",
    "error_template_delete": "Не удалось удалить шаблон.",
    "today": "Сегодня",
    "day": "День",
    "week": "Неделя",
    "month": "Месяц",
    "previous": "Назад",
    "next": "Вперёд",
    "error_load_events": "Не удалось загрузить события календаря",
    "no_events": "Нет событий",
    "card_name": "Календарь в стиле Outlook",
    "card_description": "Календарь с временной сеткой в стиле Outlook",
    "error_required_fields": "Заполните обязательное поле.",
    "error_invalid_field": "Проверьте значение поля.",
    "preparing_events": "Подготовка событий…",
    "preview_ready": "Проверьте предпросмотр и нажмите «Создать» для подтверждения."
  },
  "fr": {
    "add_event": "Ajouter un événement",
    "error_edit_unsupported": "Ce calendrier ne permet pas de modifier les événements.",
    "error_create_unsupported": "Ce calendrier ne permet pas d’ajouter des événements.",
    "error_title_required": "Saisissez un titre pour l’événement.",
    "error_icon_name": "Indiquez un nom d’icône MDI, par exemple mdi:tennis-ball.",
    "error_end_before_start": "La fin doit être postérieure au début.",
    "calendar_unavailable": "Calendrier indisponible",
    "error_read_events": "Impossible de lire les événements du calendrier.",
    "error_calendar_dates": "Dates d’événement incorrectes dans le calendrier",
    "error_calendar_required": "Sélectionnez au moins un calendrier.",
    "error_repeat_rule": "Règle de répétition incorrecte.",
    "error_repeat_interval": "L’intervalle de répétition doit être compris entre 1 et 52.",
    "error_weekdays_required": "Sélectionnez les jours de la semaine.",
    "error_summer_not_found": "Aucune période de vacances d’été trouvée. Sélectionnez un autre calendrier ou indiquez une date de fin.",
    "error_repeat_end_required": "Indiquez une date de fin des répétitions.",
    "error_repeat_horizon": "Choisissez une date de fin au plus tôt le jour du début et dans les deux ans.",
    "error_series_limit": "Limitez la série à 366 dates au maximum.",
    "error_no_dates": "Aucune date ne correspond à cette règle de répétition.",
    "calendar_no_longer_writable": "L’écriture dans ce calendrier n’est plus disponible",
    "open_event": "Ouvrir l’événement",
    "error_edit_unavailable": "Ce calendrier ne permet pas la modification ou est indisponible.",
    "error_event_id_missing": "Le calendrier n’a pas fourni d’identifiant permettant de modifier cet événement.",
    "error_occurrence_id_missing": "Le calendrier n’a pas identifié cette occurrence. Modifiez la série dans son application de calendrier.",
    "error_update_api_unavailable": "L’API de modification des événements est indisponible.",
    "weekday_mon": "Lun",
    "weekday_tue": "Mar",
    "weekday_wed": "Mer",
    "weekday_thu": "Jeu",
    "weekday_fri": "Ven",
    "weekday_sat": "Sam",
    "weekday_sun": "Dim",
    "edit_event": "Modifier l’événement",
    "event_calendar": "Événement du calendrier",
    "edit_scope_hint": "Seules cette date et l’entrée du calendrier sélectionné seront modifiées.",
    "template": "Modèle",
    "custom_settings": "Paramètres personnalisés",
    "school_activity": "Activité scolaire",
    "save_template_settings": "Enregistrer ces paramètres comme modèle",
    "template_name": "Nom du modèle",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "template_storage_hint": "Les modèles sont enregistrés dans ce navigateur pour votre compte Home Assistant.",
    "add_to_calendars": "Ajouter aux calendriers",
    "title": "Titre",
    "event_icon": "Icône de l’événement (facultative)",
    "icon_theatre": "Théâtre",
    "icon_music": "Musique",
    "icon_tennis": "Tennis",
    "icon_sailing": "Voile",
    "icon_football": "Football",
    "icon_running": "Course à pied",
    "icon_cat": "Chat",
    "icon_dog": "Chien",
    "icon_school_meeting": "Réunion à l’école",
    "icon_none": "Sans icône",
    "icon_unicode_hint": "Les icônes reconnues deviennent des caractères Unicode dans le titre, par exemple 🎾 Tennis. Un emoji initial sélectionne son icône MDI. Les autres utilisent [mdi:nom-icone].",
    "all_day": "Toute la journée",
    "start": "Début",
    "end": "Fin",
    "all_day_end_hint": "Pour un événement sur toute la journée, la fin est le lendemain du dernier jour de l’événement.",
    "repeat": "Répétition",
    "repeat_none": "Ne pas répéter",
    "repeat_weekly": "Chaque semaine",
    "repeat_daily": "Chaque jour",
    "weekdays": "Jours de la semaine",
    "school_year_end": "Jusqu’à la fin de l’année scolaire",
    "repeat_until": "Répéter jusqu’au (inclus)",
    "holiday_calendar": "Calendrier des vacances scolaires",
    "select_calendar": "Sélectionnez un calendrier",
    "school_year_hint": "S’arrête avant le premier événement commençant en juin, juillet ou août de cette année scolaire.",
    "skip_days": "Sauf pendant les vacances ou les jours fériés",
    "skip_days_hint": "Ignorer toute la journée si l’un de ces calendriers contient un événement",
    "location": "Lieu",
    "description": "Description",
    "series_conditions_hint": "Les répétitions sont créées comme des événements distincts. Les conditions sont vérifiées lors de la préparation de la série ; les modifications ultérieures des calendriers ne mettent pas à jour les événements créés.",
    "cancel": "Annuler",
    "preview": "Aperçu",
    "create": "Créer",
    "repeat_interval_weeks": "Répéter toutes les N semaines",
    "repeat_interval_days": "Répéter tous les N jours",
    "save_changes": "Enregistrer les modifications",
    "dates": "Dates",
    "calendars": "calendriers",
    "events_to_create": "événements à créer",
    "skipped_dates": "Dates ignorées",
    "summer_starts": "Début des vacances d’été",
    "show_dates": "Afficher les dates",
    "skipped": "ignoré",
    "created": "Créés",
    "retry_hint": "La nouvelle tentative n’envoie que les événements restants. Si une requête a expiré, vérifiez cet événement dans le calendrier avant de réessayer.",
    "retry_remaining": "Réessayer les événements restants",
    "error_template_name_required": "Saisissez un nom pour le modèle.",
    "template_saved": "Modèle enregistré.",
    "error_template_save": "Impossible d’enregistrer le modèle dans ce navigateur.",
    "error_template_delete": "Impossible de supprimer le modèle.",
    "today": "Aujourd’hui",
    "day": "Jour",
    "week": "Semaine",
    "month": "Mois",
    "previous": "Précédent",
    "next": "Suivant",
    "error_load_events": "Impossible de charger les événements du calendrier",
    "no_events": "Aucun événement",
    "card_name": "Calendrier de style Outlook",
    "card_description": "Calendrier avec grille horaire de style Outlook",
    "error_required_fields": "Renseignez le champ obligatoire.",
    "error_invalid_field": "Vérifiez la valeur du champ.",
    "preparing_events": "Préparation des événements…",
    "preview_ready": "Vérifiez l’aperçu, puis cliquez sur Créer pour confirmer."
  }
};

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
    const languageKey = this._languageSettingsKey();
    const languageChanged = this._lastLanguageSettingsKey !== languageKey;
    this._lastLanguageSettingsKey = languageKey;
    if (this._config) {
      const calendars = this._normalizeCalendars(this._config);
      if (this._loadInFlight && JSON.stringify(calendars) !== JSON.stringify(this._calendars)) {
        this._reloadAfterLoad = true;
      }
      this._calendars = calendars;
    }
    if (languageChanged && this._config) {
      this.render();
      this._refreshDialogLanguage?.();
      const registration = window.customCards?.find(card => card.type === "outlook-calendar-card");
      if (registration) {
        registration.name = this._text("card_name");
        registration.description = this._text("card_description");
      }
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
    return date.toLocaleDateString(this._locale(), {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  _labelToday() { return this._text("today"); }
  _labelDay() { return this._text("day"); }
  _labelWeek() { return this._text("week"); }
  _labelMonth() { return this._text("month"); }
  _labelPrevious() { return this._text("previous"); }
  _labelNext() { return this._text("next"); }

  _formatTimeLabel(date) {
    return date.toLocaleTimeString(this._locale(), {
      hour: "2-digit",
      minute: "2-digit",
      ...this._timeFormatOptions()
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
      return base.toLocaleDateString(this._locale(), { month: "long", year: "numeric" });
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
          sources: [ev],
          prefixes: ev.prefix ? [ev.prefix] : [],
          icons: ev.icon ? [ev.icon] : [],
          eventIcons: ev.eventIcon ? [ev.eventIcon] : [],
          colors: ev.color ? [ev.color] : [],
          calendarIndex: ev.calendarIndex ?? 0
        });
        continue;
      }
      existing.sources.push(ev);
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
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
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
                uid: e.uid,
                recurrence_id: e.recurrence_id,
                rrule: e.rrule,
                rawSummary: e.summary || "",
                description: e.description || "",
                location: e.location || "",
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
    this._renderedEvents = [];
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
    o += `<ha-card lang="${this._locale()}">`;
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
    const addLabel = this._text("add_event");
    o += `<button type="button" data-action="add" aria-label="${addLabel}" title="${addLabel}" ${this._writableCalendars().length ? "" : "disabled"} style="background:var(--primary-color);color:var(--text-primary-color, white);border:0;border-radius:6px;padding:4px 8px;cursor:pointer;">+</button>`;
    o += `</div>`;
    const view = this._getView();
    if (view === "day") {
      o += this.renderAllDayEvents(this._events || []);
      o += `<div style="display:grid;grid-template-columns:${this._uses12HourTime() ? 84 : 56}px minmax(0, 1fr);padding:8px 0;">`;
      o += `<div data-time-axis style="position:relative;height:${this._config.height}px;">${this.renderTimeAxis(start, end, step)}</div>`;
      o += `<div data-time-grid style="position:relative;height:${this._config.height}px;border-left:1px solid var(--divider-color);">`;
      o += this.renderGrid(start, end, step);
      if (this._error) {
        o += `<div style="padding:8px;color:var(--error-color);font-size:12px;">${this._text("error_load_events")}</div>`;
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
    this._cardContainer.querySelectorAll("[data-event-index]").forEach(element => {
      const event = this._renderedEvents[Number(element.dataset.eventIndex)];
      const open = () => this._openEventDialog(event);
      element.onclick = open;
      element.onkeydown = key => {
        if (key.key === "Enter" || key.key === " ") {
          key.preventDefault();
          open();
        }
      };
    });
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

  _locale() {
    const hass = this._hass || window.hass;
    try {
      const locale = Intl.getCanonicalLocales((hass?.locale?.language || hass?.language || "en").replaceAll("_", "-"))[0];
      return Object.hasOwn(CARD_TRANSLATIONS, locale.split("-")[0]) ? locale : "en";
    } catch {
      return "en";
    }
  }

  _language() {
    return this._locale().split("-")[0];
  }

  _languageSettingsKey() {
    const hass = this._hass || window.hass;
    return JSON.stringify([this._locale(), hass?.locale?.time_format]);
  }

  _text(key) {
    return CARD_TRANSLATIONS[this._language()][key] || CARD_TRANSLATIONS.en[key] || key;
  }

  _timeFormatOptions() {
    const format = (this._hass || window.hass)?.locale?.time_format;
    if (format === "12") return { hour12: true };
    if (format === "24") return { hour12: false };
    if (format === "system") return { hour12: new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hour12 };
    return {};
  }

  _uses12HourTime() {
    return new Intl.DateTimeFormat(this._locale(), { hour: "numeric", ...this._timeFormatOptions() }).resolvedOptions().hour12;
  }

  _bindDialogTranslations(dialog) {
    const bindings = [];
    const translate = value => value.replace(/__HA_CALENDAR_I18N_([a-z_]+)__/g, (_, key) => this._text(key));
    const nodes = document.createTreeWalker(dialog, NodeFilter.SHOW_TEXT);
    while (nodes.nextNode()) {
      const node = nodes.currentNode;
      if (!node.data.includes("__HA_CALENDAR_I18N_")) continue;
      const template = node.data;
      bindings.push(() => { node.data = translate(template); });
    }
    dialog.querySelectorAll("*").forEach(element => {
      for (const attribute of element.attributes) {
        if (!attribute.value.includes("__HA_CALENDAR_I18N_")) continue;
        const name = attribute.name, template = attribute.value;
        bindings.push(() => element.setAttribute(name, translate(template)));
      }
    });
    const refresh = () => {
      dialog.lang = this._locale();
      bindings.forEach(binding => binding());
    };
    refresh();
    return refresh;
  }

  _writableCalendars(feature = 1) {
    const hass = this._hass || window.hass;
    return (this._calendars || []).filter(calendar => {
      const state = hass?.states?.[calendar.entity];
      return state && !["unavailable", "unknown"].includes(state.state)
        && (Number(state.attributes?.supported_features) & feature) !== 0;
    });
  }

  _localDateValue(date, allDay = false) {
    const pad = value => String(value).padStart(2, "0");
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return allDay ? day : `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  _eventServiceData(values, feature = 1) {
    if (!this._writableCalendars(feature).some(calendar => calendar.entity === values.entity)) {
      throw new Error(feature === 4
        ? this._text("error_edit_unsupported")
        : this._text("error_create_unsupported"));
    }
    const title = this._parseEventTitle(values.summary);
    if (!title.summary.trim()) {
      throw new Error(this._text("error_title_required"));
    }
    const eventIcon = (values.eventIcon || title.eventIcon || "").trim();
    if (eventIcon && !/^mdi:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventIcon)) {
      throw new Error(this._text("error_icon_name"));
    }
    const start = new Date(values.start);
    const end = new Date(values.end);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      throw new Error(this._text("error_end_before_start"));
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
      throw new Error(`${this._text("calendar_unavailable")}: ${this._calendarName(entity)}`);
    }
    const query = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
    const events = await hass.callApi("GET", `calendars/${entity}?${query}`);
    if (!Array.isArray(events)) throw new Error(this._text("error_read_events"));
    return events.map(event => {
      const parsed = this._parseEventTimes(event);
      if (!parsed || !Number.isFinite(parsed.start.getTime()) || !Number.isFinite(parsed.end.getTime()) || parsed.end <= parsed.start) {
        throw new Error(`${this._text("error_calendar_dates")}: ${this._calendarName(entity)}`);
      }
      return { ...parsed, summary: event.summary || "", entity };
    });
  }

  async _planEventSeries(values) {
    const entities = [...new Set(values.entities || [])];
    if (!entities.length) throw new Error(this._text("error_calendar_required"));
    for (const entity of entities) this._eventServiceData({ ...values, entity });
    const start = new Date(values.allDay ? `${values.start}T00:00:00` : values.start);
    const end = new Date(values.allDay ? `${values.end}T00:00:00` : values.end);
    const recurrence = values.recurrence || "none";
    if (!["none", "daily", "weekly"].includes(recurrence)) throw new Error(this._text("error_repeat_rule"));
    const interval = recurrence === "none" ? 1 : Number(values.interval);
    if (!Number.isInteger(interval) || interval < 1 || interval > 52) throw new Error(this._text("error_repeat_interval"));
    const weekdays = [...new Set(values.weekdays || [])].map(Number);
    if (recurrence === "weekly" && (!weekdays.length || weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6))) {
      throw new Error(this._text("error_weekdays_required"));
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
        if (!summer) throw new Error(this._text("error_summer_not_found"));
        limit = new Date(summer.start);
        limit.setHours(0, 0, 0, 0);
        limit.setDate(limit.getDate() - 1);
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(values.until || "")) throw new Error(this._text("error_repeat_end_required"));
        limit = new Date(`${values.until}T00:00:00`);
      }
    }
    const horizon = new Date(start);
    horizon.setFullYear(horizon.getFullYear() + 2);
    if (!Number.isFinite(limit.getTime()) || limit > horizon || this._dateOrdinal(limit) < this._dateOrdinal(start)) {
      throw new Error(this._text("error_repeat_horizon"));
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
      if (candidates.length > 366) throw new Error(this._text("error_series_limit"));
    }
    if (!candidates.length) throw new Error(this._text("error_no_dates"));
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
        throw new Error(`${this._text("calendar_no_longer_writable")}: ${this._calendarName(task.entity)}`);
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

  _eventInteractionAttrs(event) {
    this._renderedEvents ||= [];
    const index = this._renderedEvents.push(event) - 1;
    const label = `${this._text("open_event")}: ${event.summary || ""}`;
    return `data-event-index="${index}" role="button" tabindex="0" aria-label="${this._escapeHtml(label)}"`;
  }

  _eventEditUnavailableReason(source) {
    const hass = this._hass || window.hass;
    if (!this._writableCalendars(4).some(calendar => calendar.entity === source?.entity)) {
      return this._text("error_edit_unavailable");
    }
    if (typeof source?.uid !== "string" || !source.uid) {
      return this._text("error_event_id_missing");
    }
    if (source.rrule && !source.recurrence_id) {
      return this._text("error_occurrence_id_missing");
    }
    if (typeof hass?.callWS !== "function") {
      return this._text("error_update_api_unavailable");
    }
    return "";
  }

  async _updateCalendarEvent(source, values) {
    const reason = this._eventEditUnavailableReason(source);
    if (reason) throw new Error(reason);
    const data = this._eventServiceData({ ...values, entity: source.entity }, 4);
    await (this._hass || window.hass).callWS({
      type: "calendar/event/update", entity_id: source.entity, uid: source.uid,
      ...(source.recurrence_id ? { recurrence_id: source.recurrence_id, recurrence_range: "" } : {}),
      event: {
        summary: data.summary, description: data.description, location: data.location,
        dtstart: data.start_date || data.start_date_time,
        dtend: data.end_date || data.end_date_time
      }
    });
  }

  _openEventDialog(editEvent = null) {
    if (this.querySelector("dialog")) return;
    const editing = !!editEvent;
    const sources = editing ? editEvent.sources || [editEvent] : [];
    let editSource = sources.find(source => !this._eventEditUnavailableReason(source)) || sources[0];
    const restoreFocus = document.activeElement;
    const calendars = this._writableCalendars();
    if (!editing && !calendars.length) return;
    let buildingDialog = true;
    const text = key => buildingDialog ? `__HA_CALENDAR_I18N_${key}__` : this._text(key);
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
      [1, text("weekday_mon")], [2, text("weekday_tue")], [3, text("weekday_wed")],
      [4, text("weekday_thu")], [5, text("weekday_fri")], [6, text("weekday_sat")], [0, text("weekday_sun")]
    ];
    dialog.innerHTML = `<form novalidate style="display:grid;gap:14px;">
      <h2 style="margin:0;font-size:20px;">${editing ? text("edit_event") : text("add_event")}</h2>
      ${editing ? field(text("event_calendar"), `<select name="editSource">${sources.map((source, index) => `<option value="${index}" ${source === editSource ? "selected" : ""}>${escape(this._calendarName(source.entity))}</option>`).join("")}</select>`) + `<small>${text("edit_scope_hint")}</small><div data-edit-status role="status"></div>` : ""}
      <div data-create-only>${field(text("template"), `<select name="template"><option value="">${text("custom_settings")}</option><option value="school">${text("school_activity")}</option></select>`)}</div>
      <details data-create-only><summary>${text("save_template_settings")}</summary>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
          <input name="templateName" aria-label="${text("template_name")}" placeholder="${text("template_name")}" maxlength="80" style="flex:1;">
          <button type="button" data-save-template>${text("save")}</button>
          <button type="button" data-delete-template disabled>${text("delete")}</button>
        </div><small>${text("template_storage_hint")}</small>
      </details>
      <fieldset data-create-only><legend>${text("add_to_calendars")}</legend>${checkboxes(calendars.map(calendar => calendar.entity), "destination", true)}</fieldset>
      ${field(text("title"), '<input name="summary" required maxlength="255" autofocus>')}
      <div>
        <div data-icon-fallback>${field(text("event_icon"), '<input name="eventIcon" placeholder="mdi:tennis-ball" maxlength="120" autocomplete="off">')}</div>
        <div data-icon-picker hidden></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
          ${[
            ["mdi:drama-masks", text("icon_theatre")],
            ["mdi:music", text("icon_music")],
            ["mdi:tennis-ball", text("icon_tennis")],
            ["mdi:sail-boat", text("icon_sailing")],
            ["mdi:soccer", text("icon_football")],
            ["mdi:run", text("icon_running")],
            ["mdi:cat", text("icon_cat")],
            ["mdi:dog", text("icon_dog")],
            ["mdi:school", text("icon_school_meeting")],
            ["", text("icon_none")]
          ].map(([icon, label]) => `<button type="button" data-icon-choice="${icon}" aria-label="${label}">${icon ? `${EVENT_ICON_UNICODE[icon]} ` : ""}${label}</button>`).join("")}
        </div>
        <div data-icon-title-preview style="margin-top:6px;"></div>
        <small>${text("icon_unicode_hint")}</small>
      </div>
      <label><input name="allDay" type="checkbox"> ${text("all_day")}</label>
      ${field(text("start"), `<input name="start" type="datetime-local" value="${this._localDateValue(start)}" required>`)}
      ${field(text("end"), `<input name="end" type="datetime-local" value="${this._localDateValue(end)}" required>`)}
      <small data-end-hint hidden>${text("all_day_end_hint")}</small>
      <div data-create-only>${field(text("repeat"), `<select name="recurrence"><option value="none">${text("repeat_none")}</option><option value="weekly">${text("repeat_weekly")}</option><option value="daily">${text("repeat_daily")}</option></select>`)}</div>
      <div data-repeat-settings hidden>
        ${field('<span data-interval-label></span>', '<input name="interval" type="number" min="1" max="52" value="1" required>')}
        <fieldset data-weekdays><legend>${text("weekdays")}</legend><div style="display:flex;gap:10px;flex-wrap:wrap;">${days.map(([day, label]) => `<label><input name="weekday" type="checkbox" value="${day}" ${day === start.getDay() ? "checked" : ""}> ${label}</label>`).join("")}</div></fieldset>
        <label style="display:block;margin:12px 0;"><input name="schoolYear" type="checkbox"> ${text("school_year_end")}</label>
        <div data-until>${field(text("repeat_until"), `<input name="until" type="date" value="${this._localDateValue(defaultUntil, true)}">`)}</div>
        <div data-school-year hidden>
          ${field(text("holiday_calendar"), `<select name="holidayCalendar"><option value="">${text("select_calendar")}</option>${options(allCalendars)}</select>`)}
          <small>${text("school_year_hint")}</small>
        </div>
      </div>
      <details data-exclusions data-create-only><summary>${text("skip_days")}</summary>
        <fieldset><legend>${text("skip_days_hint")}</legend>${checkboxes(allCalendars, "exclusion")}</fieldset>
      </details>
      ${field(text("location"), '<input name="location">')}
      ${field(text("description"), '<textarea name="description" rows="3"></textarea>')}
      <small data-create-only>${text("series_conditions_hint")}</small>
      <div data-preview hidden aria-live="polite" style="border:1px solid var(--divider-color);border-radius:6px;padding:12px;"></div>
      <div role="status" data-progress aria-live="polite"></div>
      <div role="alert" data-error style="color:var(--error-color);" hidden></div>
      <div style="display:flex;flex-wrap:wrap;justify-content:flex-end;gap:12px;">
        <button type="button" data-cancel>${text("cancel")}</button>
        <button type="button" data-plan>${text("preview")}</button>
        <button type="submit">${text("create")}</button>
      </div>
    </form>`;
    buildingDialog = false;
    const translateDialog = this._bindDialogTranslations(dialog);
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
      iconPicker.label = text("event_icon");
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
      const repeating = !editing && controls.recurrence.value !== "none";
      dialog.querySelector("[data-repeat-settings]").hidden = !repeating;
      dialog.querySelector("[data-interval-label]").textContent = controls.recurrence.value === "weekly"
        ? text("repeat_interval_weeks")
        : text("repeat_interval_days");
      dialog.querySelector("[data-weekdays]").hidden = controls.recurrence.value !== "weekly";
      dialog.querySelector("[data-until]").hidden = controls.schoolYear.checked;
      dialog.querySelector("[data-school-year]").hidden = !controls.schoolYear.checked;
      dialog.querySelector("[data-end-hint]").hidden = !controls.allDay.checked;
      controls.until.required = repeating && !controls.schoolYear.checked;
      controls.holidayCalendar.required = repeating && controls.schoolYear.checked;
      controls.interval.required = repeating;
      const locked = busy || completed.size > 0;
      controls.interval.disabled = locked || !repeating;
      controls.until.disabled = locked || !repeating || controls.schoolYear.checked;
      controls.holidayCalendar.disabled = locked || !repeating || !controls.schoolYear.checked;
      controls.schoolYear.disabled = locked || !repeating;
      form.querySelectorAll('[name="weekday"]').forEach(control => {
        control.disabled = locked || !repeating || controls.recurrence.value !== "weekly";
      });
      dialog.querySelector("[data-delete-template]").disabled = editing || busy || completed.size > 0 || !controls.template.value.startsWith("saved:");
      if (editing) {
        dialog.querySelectorAll("[data-create-only]").forEach(element => {
          element.hidden = true;
          element.querySelectorAll("input,select,textarea,button").forEach(control => { control.disabled = true; });
        });
        dialog.querySelector("[data-plan]").hidden = true;
        const reason = this._eventEditUnavailableReason(editSource);
        dialog.querySelector("[data-edit-status]").textContent = reason;
        Array.from(controls).forEach(control => {
          if (control.closest("[data-create-only]")) return;
          control.disabled = busy || (!!reason && control !== controls.editSource && control !== dialog.querySelector("[data-cancel]"));
        });
        if (iconPicker) iconPicker.disabled = busy || !!reason;
        submit.disabled = busy || !!reason;
      }
    };
    const invalidate = () => {
      if (busy || completed.size) return;
      plan = null;
      preview.hidden = true;
      progress.textContent = "";
      submit.textContent = editing ? text("save_changes") : text("create");
      submit.disabled = editing && !!this._eventEditUnavailableReason(editSource);
    };
    form.addEventListener("input", event => {
      event.target.removeAttribute("aria-invalid");
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
      if (this._refreshDialogLanguage === refreshDialogLanguage) this._refreshDialogLanguage = null;
      if (editing && restoreFocus?.isConnected) restoreFocus.focus();
      else this.querySelector('[data-action="add"]')?.focus();
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
      const date = value => value.toLocaleString(this._locale(), controls.allDay.checked ? { dateStyle: "medium" } : { dateStyle: "medium", timeStyle: "short", ...this._timeFormatOptions() });
      const title = this._parseEventTitle(controls.summary.value);
      const eventIcon = controls.eventIcon.value.trim() || title.eventIcon;
      preview.innerHTML = `<div style="margin-bottom:6px;">${this._renderEventSummary({ summary: title.summary, eventIcon })}</div><strong>${text("dates")}: ${plan.accepted.length}; ${text("calendars")}: ${plan.entities.length}; ${text("events_to_create")}: ${plan.tasks.length}</strong>
        <div>${text("skipped_dates")}: ${plan.skipped.length}</div>
        ${plan.summer ? `<div>${text("summer_starts")}: ${escape(this._localDateValue(plan.summer.start, true))} — ${escape(plan.summer.summary)}</div>` : ""}
        <details><summary>${text("show_dates")}</summary><div style="max-height:200px;overflow:auto;">
        ${plan.accepted.map(item => `<div>${escape(date(item.start))} → ${escape(date(item.end))}</div>`).join("")}
        ${plan.skipped.map(item => `<div>${escape(date(item.start))} — ${text("skipped")}: ${escape(item.reasons.map(reason => `${this._calendarName(reason.entity)}: ${reason.summary}`).join("; "))}</div>`).join("")}
        </div></details>`;
      preview.hidden = false;
      submit.disabled = !plan.tasks.length;
      submit.textContent = `${text("create")} (${plan.tasks.length})`;
    };
    const validate = () => {
      updateVisibility();
      const invalid = Array.from(controls).find(control => control.willValidate && !control.validity.valid);
      if (!invalid) return true;
      const labels = {
        summary: text("title"), start: text("start"), end: text("end"),
        until: text("repeat_until"), holidayCalendar: text("holiday_calendar"),
        interval: controls.recurrence.value === "weekly" ? text("repeat_interval_weeks") : text("repeat_interval_days"),
        eventIcon: text("event_icon"), templateName: text("template_name")
      };
      const message = invalid.name === "interval" && !invalid.validity.valueMissing
        ? text("error_repeat_interval")
        : text(invalid.validity.valueMissing ? "error_required_fields" : "error_invalid_field");
      error.textContent = `${message}${labels[invalid.name] ? ` ${labels[invalid.name]}` : ""}`;
      error.hidden = false;
      invalid.setAttribute("aria-invalid", "true");
      for (let ancestor = invalid.parentElement; ancestor && ancestor !== dialog; ancestor = ancestor.parentElement) {
        if (ancestor.tagName === "DETAILS") ancestor.open = true;
      }
      invalid.scrollIntoView?.({ block: "center" });
      invalid.focus({ preventScroll: true });
      invalid.reportValidity();
      return false;
    };
    const prepare = async () => {
      plan = null;
      preview.hidden = true;
      plan = await this._planEventSeries(values());
      renderPreview();
      progress.textContent = text("preview_ready");
      preview.scrollIntoView?.({ block: "nearest" });
      return true;
    };
    dialog.querySelector("[data-plan]").onclick = async () => {
      if (busy || completed.size) return;
      error.hidden = true;
      if (!validate()) return;
      progress.textContent = text("preparing_events");
      setBusy(true);
      try { await prepare(); }
      catch (err) {
        progress.textContent = "";
        error.textContent = err?.message || String(err);
        error.hidden = false;
        error.scrollIntoView?.({ block: "nearest" });
      }
      finally { setBusy(false); if (plan) submit.disabled = !plan.tasks.length; }
    };
    form.onsubmit = async event => {
      event.preventDefault();
      if (busy) return;
      error.hidden = true;
      if (!completed.size && !validate()) return;
      if (editing) {
        setBusy(true);
        try {
          await this._updateCalendarEvent(editSource, values());
          setBusy(false);
          close();
          refresh();
        } catch (err) {
          error.textContent = err?.message || String(err);
          error.hidden = false;
          error.scrollIntoView?.({ block: "nearest" });
        } finally { setBusy(false); }
        return;
      }
      const input = values();
      const needsPreview = input.entities.length > 1 || input.recurrence !== "none" || input.excludeCalendars.length > 0;
      setBusy(true);
      try {
        if (!plan) {
          progress.textContent = text("preparing_events");
          if (!await prepare()) return;
          if (needsPreview) return;
        }
        if (!plan.tasks.length) return;
        progress.textContent = `${text("created")}: ${completed.size} / ${plan.tasks.length}`;
        await this._writeEventPlan(plan, completed, (done, total) => {
          progress.textContent = `${text("created")}: ${done} / ${total}`;
        });
        setBusy(false);
        close();
        refresh();
      } catch (err) {
        error.textContent = completed.size
          ? `${text("created")}: ${completed.size} / ${plan.tasks.length}. ${err?.message || String(err)}. ${text("retry_hint")}`
          : err?.message || String(err);
        error.hidden = false;
        error.scrollIntoView?.({ block: "nearest" });
        if (!completed.size) progress.textContent = "";
        if (completed.size) {
          submit.textContent = text("retry_remaining");
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
      if (!name) { error.textContent = text("error_template_name_required"); error.hidden = false; return; }
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
        progress.textContent = text("template_saved");
        updateVisibility();
      } catch (err) { templates = previous; error.textContent = text("error_template_save"); error.hidden = false; }
    };
    dialog.querySelector("[data-delete-template]").onclick = () => {
      if (!controls.template.value.startsWith("saved:")) return;
      const previous = templates.slice();
      templates.splice(Number(controls.template.value.slice(6)), 1);
      try { persistTemplates(); populateTemplates(); controls.template.value = ""; updateVisibility(); }
      catch (err) { templates = previous; error.textContent = text("error_template_delete"); error.hidden = false; }
    };
    const populateEditSource = () => {
      controls.summary.value = editSource.rawSummary ?? this._eventSummaryWithIcon(editSource.summary, editSource.eventIcon);
      controls.eventIcon.value = this._parseEventTitle(controls.summary.value).eventIcon;
      controls.allDay.checked = editSource.allDay;
      for (const name of ["start", "end"]) {
        controls[name].type = editSource.allDay ? "date" : "datetime-local";
        controls[name].step = "1";
        const seconds = editSource[name].getSeconds();
        controls[name].value = this._localDateValue(editSource[name], editSource.allDay)
          + (!editSource.allDay && seconds ? `:${String(seconds).padStart(2, "0")}` : "");
      }
      controls.description.value = editSource.description || "";
      controls.location.value = editSource.location || "";
      error.hidden = true;
      invalidate();
      updateVisibility();
    };
    const refreshDialogLanguage = () => {
      const previous = CARD_TRANSLATIONS[dialog.lang.split("-")[0]] || CARD_TRANSLATIONS.en;
      // Translate our own displayed errors; leave integration-provided messages intact.
      if (!error.hidden) {
        for (const [key, value] of Object.entries(previous).sort((a, b) => b[1].length - a[1].length)) {
          if (error.textContent === value || error.textContent.startsWith(`${value}:`)) {
            error.textContent = this._text(key) + error.textContent.slice(value.length);
            break;
          }
        }
        if (error.textContent.endsWith(previous.retry_hint)) {
          error.textContent = error.textContent.slice(0, -previous.retry_hint.length) + text("retry_hint");
        }
      }
      for (const key of ["template_saved", "preparing_events", "preview_ready"]) {
        if (progress.textContent === previous[key]) { progress.textContent = text(key); break; }
      }
      translateDialog();
      if (iconPicker) iconPicker.label = text("event_icon");
      updateVisibility();
      if (!busy) {
        if (plan) renderPreview();
        else submit.textContent = editing ? text("save_changes") : text("create");
        if (completed.size) {
          progress.textContent = `${text("created")}: ${completed.size} / ${plan.tasks.length}`;
          submit.textContent = text("retry_remaining");
        }
      }
    };
    this._refreshDialogLanguage = refreshDialogLanguage;
    populateTemplates();
    if (editing) {
      controls.editSource.onchange = () => {
        if (busy) return;
        editSource = sources[Number(controls.editSource.value)];
        populateEditSource();
      };
      populateEditSource();
    }
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
          return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">${this._renderEventTitle(ev)}</div>`;
        }
        const bg = this._eventBackground(ev);
        const timeLabel = this._formatTimeLabel(ev.start);
        const badgeText = `${this._escapeHtml(timeLabel)} ${this._renderEventPrefix(ev)}`;
        return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;">
          <span style="background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:4px;padding:1px 4px;margin-right:4px;display:inline-block;">${badgeText}</span>
          ${this._renderEventSummary(ev)}
        </div>`;
      }).join("");
      return `<div style="flex:1;min-width:0;border-left:1px solid var(--divider-color);padding:8px;${isToday ? "box-shadow:inset 0 0 0 2px var(--error-color);" : ""}">
        <div style="font-size:13px;font-weight:600;color:var(--secondary-text-color);margin-bottom:4px;">${this._escapeHtml(this._formatDateLabel(day))}</div>
        ${items || `<div style="color:var(--secondary-text-color);font-size:11px;">${this._text("no_events")}</div>`}
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
            return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">${this._renderEventTitle(ev)}</div>`;
          }
          const bg = this._eventBackground(ev);
          const timeLabel = this._formatTimeLabel(ev.start);
          const badgeText = `${this._escapeHtml(timeLabel)} ${this._renderEventPrefix(ev)}`;
          return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;background:var(--primary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:6px;padding:1px 4px;font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;">
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
      const date = this._getActiveDate();
      date.setHours(Math.floor(tick.minutes / 60), tick.minutes % 60, 0, 0);
      const label = this._formatTimeLabel(date);
      return `<span style="position:absolute;top:${tick.top}%;left:4px;right:8px;transform:translateY(-50%);text-align:right;white-space:nowrap;font-size:11px;line-height:16px;font-variant-numeric:tabular-nums;color:var(--secondary-text-color);">${this._escapeHtml(label)}</span>`;
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
      return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;position:absolute;left:${left}%;width:${width}%;top:${top}%;height:${height}%;background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px;font-size:12px;box-sizing:border-box;overflow:hidden;">${this._renderEventTitle(ev)}</div>`;
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
      return `<div ${this._eventInteractionAttrs(ev)} style="cursor:pointer;background:${bg.background};background-image:${bg.backgroundImage};color:${bg.textColor};border-radius:6px;padding:2px 6px;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._renderEventTitle(ev)}</div>`;
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
  name: CARD_TRANSLATIONS.en.card_name,
  description: CARD_TRANSLATIONS.en.card_description,
});
