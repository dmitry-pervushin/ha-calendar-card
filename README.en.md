# Home Assistant Outlook calendar card

**English** · [Français](README.fr.md) · [Русский](README.ru.md)

A Home Assistant calendar card with day, week, two-week and month views.

## Installation

### Marketplace / HACS

[Open this repository in Home Assistant Marketplace](https://my.home-assistant.io/redirect/marketplace_repository/?owner=dmitry-pervushin&repository=ha-calendar-card&category=plugin), or add `https://github.com/dmitry-pervushin/ha-calendar-card` as a custom repository with type **Dashboard** (`plugin`). In older HACS versions, use **Custom repositories → Dashboard**. Install the card and reload the browser. The repository must be public; preparing it does not automatically include it in the shared catalog.

Marketplace normally adds the JavaScript resource automatically. With YAML-managed resources, add it yourself if necessary:

```yaml
url: /local/community/ha-calendar-card/outlook-calendar-card.js
type: module
```

When migrating from a manual installation, remove the old `/local/outlook-calendar-card.js` resource entry so the card is loaded only once.

### Manual installation

Copy `outlook-calendar-card.js` to Home Assistant’s `/config/www/` directory and add a dashboard resource of type **JavaScript module**:

```text
/local/outlook-calendar-card.js
```

When `calendars` is omitted, the card automatically uses all `calendar.*` entities in Home Assistant. New calendars are discovered when Home Assistant updates its state. Minimal configuration:

```yaml
type: custom:outlook-calendar-card
```

An explicit `calendars` list limits the card to those calendars; `calendars: []` leaves it with no calendars.

Example configuration:

```yaml
type: custom:outlook-calendar-card
calendars:
  - entity: calendar.work
  - entity: calendar.family
start_hour: 8
end_hour: 20
view: week
```

The calendar’s `color` attribute supplies its event color. If absent, the card uses `initial_color`, the entity registry’s calendar color (`options.calendar.color`), or Home Assistant’s color palette. Calendar colors set in the Home Assistant interface are fetched through the WebSocket API when unavailable in `hass`. Theme names such as `deep-orange` are converted to theme CSS variables. An explicit `color` in the card configuration takes priority. The calendar’s `icon` appears before the event title, followed by a space; `mdi:calendar` is used when no icon is set.

When the same event appears in several calendars, its prefixes are joined without spaces between them, with one trailing space before the title. This also applies to calendar icons. A single text prefix retains its configured spacing.

Events with a white background use dark text and icons, including when white comes from a theme variable.

Explicit settings take priority:

```yaml
calendars:
  - entity: calendar.work
    color: "#4285f4"
    prefix: "Work: "
  - entity: calendar.family
    prefix: "" # Disable the automatic calendar icon
```

## Two-week view

The **2 weeks** button displays two rows of seven days: the week containing the selected date and the following week. On opening, these are the current week and next week, Monday through Sunday. **Today** returns to the current week; the arrows move the range by two weeks.

To open this view by default:

```yaml
type: custom:outlook-calendar-card
view: two-weeks
```

## Localization

The card automatically follows the current Home Assistant language (`hass.locale.language`, with `hass.language` supported for compatibility):

- `ru` — Russian;
- `fr` — French;
- `en` — English.

Regional variants such as `fr-FR`, `fr-CA`, `ru-RU` and `en-GB` are supported. Other languages fall back to English. The browser language does not determine the card’s interface language.

Translations cover navigation, empty states, creation and editing dialogs, templates, icon labels, previews, the card’s own errors and help text. Calendar names, event content and custom templates retain the user’s wording. Messages returned by integrations are shown as received.

Dates, month names and time labels use `Intl` with the Home Assistant locale. The HA 12/24-hour preference (`hass.locale.time_format`) is also respected; when set to `system`, the system time format is used. Date entry and scheduling continue to use the browser’s time zone.

Changing the Home Assistant language updates the card and any open dialog without losing entered values or a prepared plan. All translations are included in `CARD_TRANSLATIONS` inside the single JavaScript file; no additional resources are required.

## Adding events

On wide screens, the dialog has two columns: event details on the left, calendars and recurrence on the right. Screens up to 640 px use one column. Long calendar lists scroll independently, and action buttons remain visible at the bottom. The footer displays the loaded version: `2026.11.11.3`.

The **+** button opens a dialog with multiple destination calendars, a title, start and end, an all-day option, location and description. Only configured calendars that support event creation are available as destinations. The button is disabled when none are available. Inactive recurrence fields do not participate in form validation. Missing or invalid active fields produce a localized message and receive focus.

### Event icons

Choose an icon using a dialog button or enter its MDI name, such as `mdi:tennis-ball`. If Home Assistant has already loaded `ha-icon-picker`, its searchable picker is used; otherwise a text field and quick choices are available.

Main choices:

| Event | Unicode in title | MDI |
| --- | --- | --- |
| Theatre | 🎭 | `mdi:drama-masks` |
| Music | 🎵 | `mdi:music` |
| Tennis | 🎾 | `mdi:tennis-ball` |
| Sailing | ⛵ | `mdi:sail-boat` |
| Football | ⚽ | `mdi:soccer` |
| Running | 🏃 | `mdi:run` |
| Cat | 🐱 | `mdi:cat` |
| Dog | 🐶 | `mdi:dog` |
| School meeting | 🏫 | `mdi:school` |

A title may consist of an icon alone, such as `🎾`, without additional text.

Conversion works both ways: choosing `mdi:tennis-ball` immediately prefixes the title with `🎾`; typing `🎾 Tennis` selects the corresponding MDI icon. The calendar stores the ordinary title `🎾 Tennis`, leaving the description unchanged. On loading, the card displays the symbol as an MDI icon beside the title while keeping calendar prefixes separate. Templates remember the icon, and it is applied to every event in a series.

MDI icons without a Unicode equivalent use a text prefix: `[mdi:atom] Activity`. The card recognizes these prefixes and displays the icon. Use **None** to remove it. Only a symbol or marker at the start of the title is converted; other symbols remain ordinary text. Unknown emoji and unsupported compound variants are preserved as text.

### Recurrence and conditions

Create daily or weekly events with a chosen interval. Weekly recurrence lets you select weekdays, such as every Saturday. The repeat end date is inclusive. A series is limited to two years and 366 dates.

Under **Skip days with events in other calendars**, select one or more exclusion calendars. Any event in any selected calendar excludes the whole day, regardless of its time. Events crossing midnight check every day they touch. All existing calendars are available here, including read-only calendars and calendars outside the card’s display list.

**Until the end of the school year** replaces the manual end date. Select a school holiday calendar: the card finds its first event starting in June, July or August of the relevant school year. The event title is ignored. The series ends before that day. Series starting in September or later use the following summer; January–August use the same year’s summer. Creation does not begin if no summer holiday is found or an exclusion calendar is unavailable.

**Preview** shows dates, the total number of entries across selected calendars, skipped dates with reasons, and the detected summer holiday date. For multiple calendars, recurrence or exclusion conditions, the first **Create** click also prepares a preview; the second writes the events. Editing fields invalidates the preview.

Recurrences are created as **separate events** through [`calendar.create_event`](https://www.home-assistant.io/actions/calendar.create_event/). Conditions are checked when preparing the series. Later changes to holidays or exclusion calendars do not recalculate prepared or created events. To refresh conditions before writing, click **Preview** again. The series is not a single recurring entry that can be edited as a group.

If writing fails partway through, the form shows how many events were created. **Retry remaining** skips confirmed writes. Settings for a partially written series stay locked until completion or closing the dialog. Retry state exists only in the open dialog. If a request times out, the result of that write may be unknown: check the calendar before retrying it.

### Templates

The built-in **School activity** template enables weekly recurrence on the activity’s starting weekday, the school-year end condition, and selects holiday calendars based on their names. Review and adjust these selections before previewing.

Under **Save these settings as a template**, enter a name to save your own template. It remembers calendars, conditions, recurrence, title, event icon, location, description, time and duration. Applying it keeps the selected start date and uses the template’s time and duration. For a manual recurrence end, the length of the recurrence period is saved rather than the old absolute date.

Templates are stored locally in this browser, separately for each Home Assistant user. Save under the same name to update a template, or delete the selected template. Templates do not synchronize across browsers or devices.

### Dates and time

All-day event end dates are exclusive: an event covering November 11 alone ends on November 12. Switching to all-day mode automatically sets the next day as the end when start and end were on the same date.

Changing the start automatically shifts the end while preserving the last valid duration. You can adjust the end manually. If it precedes the start, an error appears directly beneath the end field.

The form uses the browser’s time zone. Recurrence preserves the activity’s local time across daylight-saving changes. After saving, the card fetches events again; how quickly an event appears depends on its calendar integration. Interface, date and time language follow Home Assistant, with Russian, French and English supported.

## Editing events

Click an event in day, week, two-week or month view; keyboard users can use Tab and Enter/Space. The dialog includes the title, icon, start and end, all-day option, location and description. **Save changes** updates the existing entry by `uid` through the `calendar/event/update` WebSocket API.

If an event combines entries from several calendars, choose the desired entry under **Event in calendar**. Its own values populate the form. Changes apply only to that entry; copies in other calendars remain unchanged.

Editing requires an integration with `UPDATE_EVENT` support (bit `4` in `supported_features`) and an event with a `uid`. Supporting event creation does not by itself imply editing support. Uneditable entries can be viewed, and the dialog explains why saving is disabled.

For a native recurring series, only the selected occurrence identified by `recurrence_id` is changed; future occurrences and the series rule remain unchanged. Saving is disabled if the calendar returns a recurrence rule without identifying the occurrence. Series created by this card as separate events are edited one date at a time.

API errors leave your changes in the open dialog. Background card updates also preserve the form. Events are fetched again after a successful update.

## Checks

Development requires Node.js 18 or later:

```sh
npm ci
npm run check
npm test
```

Tests cover color and prefix settings, icons, duplicate merging, write support, recurrence, multiple calendars, whole-day exclusions, summer holidays, daylight-saving changes, previews, retry after partial failure and template storage. To test daylight-saving transitions: `TZ=Europe/Paris npm test`.

Compatibility with `scoped-custom-element-registry` is checked separately: its `form.elements` collection provides indexed access but does not support iteration. The card accesses controls without invoking that iterator.
