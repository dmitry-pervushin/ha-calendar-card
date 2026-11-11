const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync(require.resolve('../outlook-calendar-card.js'), 'utf8');

function setup() {
  const dom = new JSDOM('', { runScripts: 'outside-only', url: 'https://home-assistant.test' });
  const { window } = dom;
  window.console.warn = () => {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.eval(source);
  const card = window.document.createElement('outlook-calendar-card');
  card._scheduleLoad = () => {};
  card.setConfig({ calendars: [{ entity: 'calendar.work' }] });
  card.hass = {
    locale: { language: 'en' },
    states: {
      'calendar.work': { state: 'on', attributes: { color: '#123456', icon: 'mdi:briefcase', friendly_name: 'Work', supported_features: 1 } },
      'calendar.readonly': { state: 'off', attributes: { supported_features: 0 } }
    },
    callApi: async () => [{ summary: '<Meeting>', start: { dateTime: '2026-11-11T10:00:00' }, end: { dateTime: '2026-11-11T11:00:00' } }],
    callService: async () => {}
  };
  card._setActiveDate(new Date(2026, 10, 11));
  window.document.body.appendChild(card);
  return { card, window, dom };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

 test('calendar attributes are defaults; explicit color and empty prefix take priority', async () => {
  const { card, dom } = setup();
  const calendar = card._calendars[0];
  assert.equal(await card._getCalendarColor(calendar), '#123456');
  assert.equal(card._getCalendarIcon(calendar), 'mdi:briefcase');
  assert.equal(await card._getCalendarColor({ ...calendar, color: 'red' }), 'red');
  assert.equal(card._getCalendarIcon({ ...calendar, prefix: '' }), '');
  assert.equal(card._getCalendarIcon({ ...calendar, prefix: 'Work: ' }), '');
  card._hass.states['calendar.work'].attributes.color = undefined;
  assert.equal(await card._getCalendarColor(calendar), 'var(--color-2, var(--primary-color))');
  dom.window.close();
});

test('metadata changes invalidate the event cache', () => {
  const { card, dom } = setup();
  const before = card._configKey();
  card._hass.states['calendar.work'].attributes.icon = 'mdi:home';
  assert.notEqual(card._configKey(), before);
  dom.window.close();
});

test('icons render as elements and summaries remain escaped in all views', async () => {
  const { card, dom } = setup();
  await card.loadEvents(true);
  assert.equal(card._events.length, 1);
  for (const view of ['day', 'week', 'month']) {
    card._setView(view);
    card.render();
    assert.ok(card.querySelector('ha-icon[icon="mdi:briefcase"]'), view);
    assert.ok(card.innerHTML.includes('&lt;Meeting&gt;'), view);
    assert.equal(card.querySelector('meeting'), null);
  }
  const event = card._events[0];
  const merged = card._mergeDuplicateEvents([event, { ...event, icon: 'mdi:home', color: 'red' }]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].icons.length, 2);
  assert.equal(merged[0].colors.length, 2);
  dom.window.close();
});

test('read-only calendars cannot be selected or submitted', () => {
  const { card, dom } = setup();
  card.setConfig({ calendars: [{ entity: 'calendar.readonly' }] });
  card.render();
  assert.equal(card.querySelector('[data-action="add"]').disabled, true);
  card._openEventDialog();
  assert.equal(card.querySelector('dialog'), null);
  assert.throws(() => card._eventServiceData({ entity: 'calendar.readonly' }), /does not support/);
  dom.window.close();
});

test('timed events send ISO timestamps and refresh after successful creation', async () => {
  const { card, window, dom } = setup();
  let sent, refreshed = 0;
  card._hass.callService = async (...args) => { sent = args; };
  card.loadEvents = async force => { assert.equal(force, true); refreshed++; };
  card.render();
  card.querySelector('[data-action="add"]').click();
  const form = card.querySelector('form');
  form.elements.summary.value = ' Team meeting ';
  form.elements.start.value = '2026-11-11T10:00';
  form.elements.end.value = '2026-11-11T11:00';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.deepEqual(sent.slice(0, 2), ['calendar', 'create_event']);
  assert.equal(sent[2].summary, 'Team meeting');
  assert.equal(sent[2].entity_id, 'calendar.work');
  assert.equal(sent[2].start_date_time, new Date('2026-11-11T10:00').toISOString());
  assert.equal(refreshed, 1);
  assert.equal(card.querySelector('dialog'), null);
  dom.window.close();
});

test('all-day mode defaults to an exclusive next-day end date', async () => {
  const { card, window, dom } = setup();
  let data;
  card._hass.callService = async (_domain, _service, values) => { data = values; };
  card.loadEvents = async () => {};
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Holiday';
  form.elements.allDay.click();
  assert.equal(form.elements.start.type, 'date');
  assert.equal(form.elements.start.value, '2026-11-11');
  assert.equal(form.elements.end.value, '2026-11-12');
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.equal(data.start_date, '2026-11-11');
  assert.equal(data.end_date, '2026-11-12');
  assert.equal(data.start_date_time, undefined);
  dom.window.close();
});

test('invalid ranges and empty titles are rejected before calling the service', () => {
  const { card, dom } = setup();
  const values = { entity: 'calendar.work', summary: 'Test', start: '2026-11-11T12:00', end: '2026-11-11T11:00', location: '', description: '' };
  assert.throws(() => card._eventServiceData(values), /End must be after start/);
  assert.throws(() => card._eventServiceData({ ...values, summary: '  ' }), /Enter an event title/);
  dom.window.close();
});

test('errors keep the form editable and background rendering preserves user input', async () => {
  const { card, window, dom } = setup();
  card._hass.callService = async () => { throw new Error('Permission denied'); };
  card.render();
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Keep this title';
  card.render();
  assert.equal(card.querySelector('form'), form);
  assert.equal(form.elements.summary.value, 'Keep this title');
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.equal(card.querySelector('[data-error]').textContent, 'Permission denied');
  assert.equal(form.elements.summary.disabled, false);
  dom.window.close();
});

test('omitting calendars discovers all calendar entities when hass arrives', async () => {
  const { card, dom } = setup();
  const hass = card.hass;
  card._hass = undefined;
  card.setConfig({});
  assert.equal(card._calendars.length, 0);
  hass.states['sensor.temperature'] = { state: '20', attributes: {} };
  card.hass = hass;
  assert.deepEqual(Array.from(card._calendars, calendar => calendar.entity), ['calendar.readonly', 'calendar.work']);
  const requested = [];
  hass.callApi = async (_method, path) => { requested.push(path); return []; };
  await card.loadEvents(true);
  assert.equal(requested.length, 2);
  assert.ok(requested.some(path => path.startsWith('calendars/calendar.work?')));
  assert.ok(requested.some(path => path.startsWith('calendars/calendar.readonly?')));
  dom.window.close();
});

test('automatic selection follows calendars being added and removed', () => {
  const { card, dom } = setup();
  card.setConfig({});
  const before = card._configKey();
  const hass = card.hass;
  hass.states['calendar.family'] = { state: 'off', attributes: { supported_features: 1 } };
  delete hass.states['calendar.readonly'];
  card.hass = hass;
  assert.deepEqual(Array.from(card._calendars, calendar => calendar.entity), ['calendar.family', 'calendar.work']);
  assert.notEqual(card._configKey(), before);
  assert.equal(card._writableCalendars().length, 2);
  dom.window.close();
});

test('explicit calendar lists and empty lists override automatic discovery', () => {
  const { card, dom } = setup();
  card.setConfig({ calendars: [] });
  card.hass = card.hass;
  assert.equal(card._calendars.length, 0);
  card.setConfig({ calendars: [{ entity: 'calendar.work', prefix: '', color: 'red' }] });
  card.hass = card.hass;
  assert.equal(card._calendars.length, 1);
  assert.equal(card._calendars[0].entity, 'calendar.work');
  assert.equal(card._calendars[0].prefix, '');
  assert.equal(card._calendars[0].color, 'red');
  dom.window.close();
});

test('calendar UI colors are read from registry options and reach event backgrounds', async () => {
  const { card, dom } = setup();
  delete card.hass.states['calendar.work'].attributes.color;
  const requests = [];
  let color = '#aabbcc';
  card.hass.callWS = async message => {
    requests.push(message);
    return { options: { calendar: { color } } };
  };
  await card.loadEvents(true);
  assert.equal(requests[0].type, 'config/entity_registry/get');
  assert.equal(requests[0].entity_id, 'calendar.work');
  assert.equal(card._events[0].color, '#aabbcc');
  assert.equal(card._eventBackground(card._events[0]).background, '#aabbcc');
  for (const view of ['day', 'week', 'month']) {
    card._setView(view);
    card.render();
    assert.ok(card.innerHTML.includes('background:#aabbcc'), view);
  }
  color = '#112233';
  await card.loadEvents(true);
  assert.equal(card._events[0].color, '#112233');
  dom.window.close();
});

test('theme colors in registry options use Home Assistant CSS variables', async () => {
  const { card, dom } = setup();
  delete card.hass.states['calendar.work'].attributes.color;
  card.hass.entities = { 'calendar.work': { options: { calendar: { color: 'deep-orange' } } } };
  assert.equal(await card._getCalendarColor(card._calendars[0]), 'var(--deep-orange-color)');
  const key = card._configKey();
  card.hass.entities['calendar.work'].options.calendar.color = 'blue-grey';
  assert.notEqual(card._configKey(), key);
  assert.equal(await card._getCalendarColor(card._calendars[0]), 'var(--blue-grey-color)');
  assert.equal(await card._getCalendarColor({ entity: 'calendar.work', color: 'red' }), 'red');
  dom.window.close();
});

test('registry errors fall back to distinct palette colors without losing events', async () => {
  const { card, dom } = setup();
  delete card.hass.states['calendar.work'].attributes.color;
  card.hass.callWS = async () => { throw new Error('Not allowed'); };
  await card.loadEvents(true);
  assert.equal(card._events.length, 1);
  assert.equal(card._events[0].color, 'var(--color-2, var(--primary-color))');
  assert.equal(await card._getCalendarColor({ entity: 'calendar.readonly' }), 'var(--color-1, var(--primary-color))');
  dom.window.close();
});

function seriesValues(overrides = {}) {
  return {
    entities: ['calendar.work'], summary: 'Class', start: '2026-11-14T10:00', end: '2026-11-14T11:00',
    allDay: false, description: '', location: '', recurrence: 'weekly', interval: 1,
    weekdays: [6], until: '2026-12-05', excludeCalendars: [], schoolYear: false,
    ...overrides
  };
}

function addCalendar(card, entity, writable = false) {
  card.hass.states[entity] = { state: 'off', attributes: { friendly_name: entity, supported_features: writable ? 1 : 0 } };
  if (writable) card.setConfig({ calendars: [...card._calendars, { entity }] });
}

const dates = (card, items) => Array.from(items, item => card._localDateValue(item.start, true));

test('weekly series creates every Saturday in multiple calendars', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  const plan = await card._planEventSeries(seriesValues({ entities: ['calendar.work', 'calendar.family', 'calendar.work'] }));
  assert.deepEqual(dates(card, plan.accepted), ['2026-11-14', '2026-11-21', '2026-11-28', '2026-12-05']);
  assert.equal(plan.tasks.length, 8);
  const sent = [];
  card.hass.callService = async (_domain, _service, data) => sent.push(data);
  await card._writeEventPlan(plan, new Set());
  assert.equal(sent.length, 8);
  assert.equal(sent[0].entity_id, 'calendar.work');
  assert.equal(sent[1].entity_id, 'calendar.family');
  dom.window.close();
});

test('a holiday at another time of day still excludes the entire date', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.holidays');
  card.hass.callApi = async () => [
    { summary: 'Evening holiday', start: { dateTime: '2026-11-21T20:00:00' }, end: { dateTime: '2026-11-21T21:00:00' } },
    { summary: 'Break', start: { date: '2026-11-28' }, end: { date: '2026-12-01' } }
  ];
  const plan = await card._planEventSeries(seriesValues({ excludeCalendars: ['calendar.holidays'] }));
  assert.deepEqual(dates(card, plan.accepted), ['2026-11-14', '2026-12-05']);
  assert.equal(plan.skipped.length, 2);
  assert.equal(plan.skipped[0].reasons[0].summary, 'Evening holiday');
  dom.window.close();
});

test('any selected exclusion calendar can veto a date; midnight ends are exclusive', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  addCalendar(card, 'calendar.holidays');
  card.hass.callApi = async (_method, path) => path.includes('calendar.breaks?')
    ? [{ summary: 'Break', start: '2026-11-13', end: '2026-11-14' }]
    : [{ summary: 'Holiday', start: '2026-11-21', end: '2026-11-22' }];
  const plan = await card._planEventSeries(seriesValues({ excludeCalendars: ['calendar.breaks', 'calendar.holidays'] }));
  assert.deepEqual(dates(card, plan.accepted), ['2026-11-14', '2026-11-28', '2026-12-05']);
  assert.equal(plan.skipped.length, 1);
  dom.window.close();
});

test('school-year cutoff is the earliest event starting in summer, regardless of title', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async (_method, path) => {
    const url = new URL(path, 'https://ha.test/');
    assert.equal(new Date(url.searchParams.get('start')).getFullYear(), 2027);
    return [
      { summary: 'August break', start: '2027-08-01', end: '2027-08-31' },
      { summary: 'School closed', start: '2027-06-12', end: '2027-07-01' },
      { summary: 'Spring break', start: '2027-05-29', end: '2027-06-05' }
    ];
  };
  const plan = await card._planEventSeries(seriesValues({ start: '2027-05-29T10:00', end: '2027-05-29T11:00', schoolYear: true, holidayCalendar: 'calendar.breaks' }));
  assert.deepEqual(dates(card, plan.accepted), ['2027-05-29', '2027-06-05']);
  assert.equal(plan.summer.summary, 'School closed');
  dom.window.close();
});

test('September school year searches the following summer; missing summer aborts', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async (_method, path) => {
    const url = new URL(path, 'https://ha.test/');
    assert.equal(new Date(url.searchParams.get('start')).getFullYear(), 2027);
    return [];
  };
  await assert.rejects(() => card._planEventSeries(seriesValues({ schoolYear: true, holidayCalendar: 'calendar.breaks' })), /No summer holiday/);
  dom.window.close();
});

test('calendar read errors and malformed exclusion dates abort before any writes', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async () => { throw new Error('Read denied'); };
  await assert.rejects(() => card._planEventSeries(seriesValues({ excludeCalendars: ['calendar.breaks'] })), /Read denied/);
  card.hass.callApi = async () => [{ summary: 'Bad', start: 'bad-date', end: 'bad-date' }];
  await assert.rejects(() => card._planEventSeries(seriesValues({ excludeCalendars: ['calendar.breaks'] })), /Invalid event dates/);
  card.hass.states['calendar.breaks'].state = 'unavailable';
  await assert.rejects(() => card._planEventSeries(seriesValues({ excludeCalendars: ['calendar.breaks'] })), /Calendar unavailable/);
  dom.window.close();
});

test('all-day repeats preserve exclusive ends and skip multi-day occurrences touching a holiday', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async () => [{ start: '2026-11-22', end: '2026-11-23', summary: 'Sunday holiday' }];
  const plan = await card._planEventSeries(seriesValues({ allDay: true, start: '2026-11-14', end: '2026-11-16', excludeCalendars: ['calendar.breaks'] }));
  assert.equal(plan.tasks[0].data.start_date, '2026-11-14');
  assert.equal(plan.tasks[0].data.end_date, '2026-11-16');
  assert.deepEqual(dates(card, plan.skipped), ['2026-11-21']);
  dom.window.close();
});

test('daily and every-other-week repeats honor interval and inclusive end date', async () => {
  const { card, dom } = setup();
  const daily = await card._planEventSeries(seriesValues({ recurrence: 'daily', interval: 2, until: '2026-11-18' }));
  assert.deepEqual(dates(card, daily.accepted), ['2026-11-14', '2026-11-16', '2026-11-18']);
  const weekly = await card._planEventSeries(seriesValues({ interval: 2 }));
  assert.deepEqual(dates(card, weekly.accepted), ['2026-11-14', '2026-11-28']);
  await assert.rejects(() => card._planEventSeries(seriesValues({ weekdays: [] })), /Select days/);
  await assert.rejects(() => card._planEventSeries(seriesValues({ until: '' })), /end date/);
  await assert.rejects(() => card._planEventSeries(seriesValues({ entities: [] })), /at least one calendar/);
  dom.window.close();
});

test('retry skips already completed calendar writes', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  const plan = await card._planEventSeries(seriesValues({ recurrence: 'none', entities: ['calendar.work', 'calendar.family'] }));
  const completed = new Set();
  let fail = true;
  const successes = [];
  card.hass.callService = async (_domain, _service, data) => {
    if (data.entity_id === 'calendar.family' && fail) throw new Error('Offline');
    successes.push(data.entity_id);
  };
  await assert.rejects(() => card._writeEventPlan(plan, completed), /Offline/);
  assert.equal(completed.size, 1);
  fail = false;
  await card._writeEventPlan(plan, completed);
  assert.deepEqual(successes, ['calendar.work', 'calendar.family']);
  dom.window.close();
});

test('complex form previews before writing, and invalidates preview on edits', async () => {
  const { card, window, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  const sent = [];
  card.hass.callService = async (_domain, _service, data) => sent.push(data);
  card.loadEvents = async () => {};
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Class';
  form.querySelector('[name="destination"][value="calendar.family"]').click();
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.equal(sent.length, 0);
  assert.equal(card.querySelector('[data-preview]').hidden, false);
  form.elements.summary.value = 'New title';
  form.elements.summary.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(card.querySelector('[data-preview]').hidden, true);
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.equal(sent.length, 0);
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await tick();
  assert.equal(sent.length, 2);
  assert.equal(sent[0].summary, 'New title');
  dom.window.close();
});

test('templates save and restore calendar selections, recurrence and time on a new date', () => {
  const { card, window, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card._openEventDialog();
  let form = card.querySelector('form');
  form.elements.summary.value = 'Swimming';
  form.elements.start.value = '2026-11-14T15:30';
  form.elements.end.value = '2026-11-14T16:30';
  form.elements.recurrence.value = 'weekly';
  form.elements.schoolYear.checked = true;
  form.elements.holidayCalendar.value = 'calendar.breaks';
  form.querySelector('[name="exclusion"][value="calendar.breaks"]').checked = true;
  form.elements.templateName.value = 'Saturday swimming';
  form.querySelector('[data-save-template]').click();
  assert.equal(card._readEventTemplates().length, 1);
  assert.equal(card._readEventTemplates()[0].values.start, undefined);
  form.querySelector('[data-cancel]').click();
  card._setActiveDate(new Date(2027, 0, 9));
  card._openEventDialog();
  form = card.querySelector('form');
  form.elements.template.value = 'saved:0';
  form.elements.template.dispatchEvent(new window.Event('change'));
  assert.equal(form.elements.start.value, '2027-01-09T15:30');
  assert.equal(form.elements.end.value, '2027-01-09T16:30');
  assert.equal(form.elements.summary.value, 'Swimming');
  assert.equal(form.elements.schoolYear.checked, true);
  assert.equal(form.querySelector('[name="exclusion"][value="calendar.breaks"]').checked, true);
  dom.window.close();
});

test('school template preselects holiday calendars and enables school-year recurrence', () => {
  const { card, window, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.states['calendar.breaks'].attributes.friendly_name = 'Каникулы';
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.template.value = 'school';
  form.elements.template.dispatchEvent(new window.Event('change'));
  assert.equal(form.elements.recurrence.value, 'weekly');
  assert.equal(form.elements.schoolYear.checked, true);
  assert.equal(form.elements.holidayCalendar.value, 'calendar.breaks');
  assert.equal(form.querySelector('[name="exclusion"][value="calendar.breaks"]').checked, true);
  assert.equal(card.querySelector('[data-school-year]').hidden, false);
  dom.window.close();
});

test('weekly wall-clock times survive daylight-saving transitions', async () => {
  const { card, dom } = setup();
  const plan = await card._planEventSeries(seriesValues({ start: '2027-03-27T10:00', end: '2027-03-27T11:00', until: '2027-04-10' }));
  assert.deepEqual(dates(card, plan.accepted), ['2027-03-27', '2027-04-03', '2027-04-10']);
  assert.ok(plan.accepted.every(item => item.start.getHours() === 10 && item.end.getHours() === 11));
  const allDay = await card._planEventSeries(seriesValues({ allDay: true, recurrence: 'daily', start: '2027-03-27', end: '2027-03-28', until: '2027-03-30' }));
  assert.equal(allDay.tasks[2].data.start_date, '2027-03-29');
  assert.equal(allDay.tasks[2].data.end_date, '2027-03-30');
  dom.window.close();
});

test('overnight events also check the following day for holidays', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async () => [{ start: '2026-11-15T18:00:00', end: '2026-11-15T19:00:00', summary: 'Sunday holiday' }];
  const plan = await card._planEventSeries(seriesValues({ start: '2026-11-14T23:00', end: '2026-11-15T01:00', until: '2026-11-21', excludeCalendars: ['calendar.breaks'] }));
  assert.deepEqual(dates(card, plan.accepted), ['2026-11-21']);
  assert.deepEqual(dates(card, plan.skipped), ['2026-11-14']);
  dom.window.close();
});

test('partial failure locks the plan and UI retry only sends remaining writes', async () => {
  const { card, window, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  let fail = true;
  const successes = [];
  card.loadEvents = async () => {};
  card.hass.callService = async (_domain, _service, data) => {
    if (fail && data.entity_id === 'calendar.family') throw new Error('Offline');
    successes.push(data.entity_id);
  };
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Class';
  form.querySelector('[name="destination"][value="calendar.family"]').click();
  const submit = () => form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  submit(); await tick(); // Preview.
  submit(); await tick(); // First calendar succeeds, second fails.
  assert.equal(form.elements.summary.disabled, true);
  assert.equal(form.querySelector('[type="submit"]').disabled, false);
  assert.match(card.querySelector('[data-error]').textContent, /1 \/ 2/);
  fail = false;
  submit(); await tick();
  assert.deepEqual(successes, ['calendar.work', 'calendar.family']);
  assert.equal(card.querySelector('dialog'), null);
  dom.window.close();
});

test('an all-excluded preview can be edited and recreated without getting stuck', async () => {
  const { card, window, dom } = setup();
  addCalendar(card, 'calendar.breaks');
  card.hass.callApi = async () => [{ start: '2026-11-11', end: '2026-11-12', summary: 'Holiday' }];
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Class';
  const exclusion = form.querySelector('[name="exclusion"][value="calendar.breaks"]');
  exclusion.click();
  form.querySelector('[data-plan]').click(); await tick();
  assert.equal(form.querySelector('[type="submit"]').disabled, true);
  exclusion.click();
  assert.equal(form.querySelector('[type="submit"]').disabled, false);
  assert.equal(card.querySelector('[data-preview]').hidden, true);
  dom.window.close();
});

test('templates are scoped per user and can be deleted', () => {
  const { card, window, dom } = setup();
  card.hass.user = { id: 'alice' };
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.templateName.value = 'Class';
  form.querySelector('[data-save-template]').click();
  assert.equal(card._readEventTemplates().length, 1);
  card.hass.user = { id: 'bob' };
  assert.equal(card._readEventTemplates().length, 0);
  card.hass.user = { id: 'alice' };
  form.querySelector('[data-delete-template]').click();
  assert.equal(card._readEventTemplates().length, 0);
  window.localStorage.setItem(card._eventTemplateStorageKey(), 'broken json');
  assert.equal(card._readEventTemplates().length, 0);
  dom.window.close();
});

test('curated event icons round-trip between MDI and Unicode titles', () => {
  const { card, dom } = setup();
  const choices = [
    ['mdi:drama-masks', '🎭'], ['mdi:music', '🎵'], ['mdi:tennis-ball', '🎾'],
    ['mdi:sail-boat', '⛵'], ['mdi:soccer', '⚽'], ['mdi:run', '🏃'],
    ['mdi:cat', '🐱'], ['mdi:dog', '🐶'], ['mdi:school', '🏫']
  ];
  for (const [icon, emoji] of choices) {
    assert.equal(card._eventSummaryWithIcon('Lesson', icon), `${emoji} Lesson`);
    const parsed = card._parseEventTitle(`${emoji} Lesson`);
    assert.equal(parsed.eventIcon, icon);
    assert.equal(parsed.summary, 'Lesson');
  }
  assert.equal(card._parseEventTitle('⛵️ Sailing').eventIcon, 'mdi:sail-boat');
  assert.equal(card._parseEventTitle('🏃🏽 Running').summary, '🏃🏽 Running');
  assert.equal(card._parseEventTitle('🦄 Unicorn').eventIcon, '');
  assert.equal(card._eventSummaryWithIcon('Lesson', 'mdi:atom'), '[mdi:atom] Lesson');
  assert.equal(card._parseEventTitle('[mdi:atom] Lesson').eventIcon, 'mdi:atom');
  dom.window.close();
});

test('event creation stores Unicode in summary, preserves description and avoids duplicate prefixes', () => {
  const { card, dom } = setup();
  const values = { ...seriesValues(), entity: 'calendar.work', eventIcon: 'mdi:tennis-ball', description: 'Bring a racket' };
  assert.equal(card._eventServiceData(values).summary, '🎾 Class');
  assert.equal(card._eventServiceData(values).description, 'Bring a racket');
  assert.equal(card._eventServiceData({ ...values, summary: '🎾 Class' }).summary, '🎾 Class');
  assert.equal(card._eventServiceData({ ...values, summary: '🎾 🎵 Class' }).summary, '🎾 🎵 Class');
  assert.equal(card._eventServiceData({ ...values, eventIcon: '', summary: '🐱 Vet' }).summary, '🐱 Vet');
  assert.throws(() => card._eventServiceData({ ...values, eventIcon: 'mdi:tennis-ball" onclick="bad' }), /MDI/);
  assert.throws(() => card._eventServiceData({ ...values, summary: '🎾 ' }), /Enter an event title/);
  dom.window.close();
});

test('icon buttons update title immediately and typing Unicode selects MDI in reverse', () => {
  const { card, window, dom } = setup();
  card._openEventDialog();
  const form = card.querySelector('form');
  form.elements.summary.value = 'Tennis';
  form.querySelector('[data-icon-choice="mdi:tennis-ball"]').click();
  assert.equal(form.elements.summary.value, '🎾 Tennis');
  assert.equal(form.elements.eventIcon.value, 'mdi:tennis-ball');
  form.elements.summary.value = '🎭 Theatre';
  form.elements.summary.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(form.elements.eventIcon.value, 'mdi:drama-masks');
  form.querySelector('[data-icon-choice=""]').click();
  assert.equal(form.elements.summary.value, 'Theatre');
  assert.equal(form.elements.eventIcon.value, '');
  dom.window.close();
});

test('Unicode event icons survive loading, merge once and render alongside calendar prefixes', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  card.hass.callApi = async () => [{ summary: '🎾 <Lesson>', start: '2026-11-11T10:00:00', end: '2026-11-11T11:00:00' }];
  await card.loadEvents(true);
  assert.equal(card._events.length, 1);
  assert.equal(card._events[0].eventIcons.length, 1);
  assert.equal(card._events[0].summary, '<Lesson>');
  for (const view of ['day', 'week', 'month']) {
    card._setView(view);
    card.render();
    assert.equal(card.querySelectorAll('ha-icon[icon="mdi:tennis-ball"]').length, 1, view);
    assert.ok(card.querySelector('ha-icon[icon="mdi:briefcase"]'), view);
    assert.ok(card.innerHTML.includes('&lt;Lesson&gt;'), view);
    assert.equal(card.querySelector('lesson'), null);
  }
  dom.window.close();
});

test('event icons are copied to every date and calendar in a series', async () => {
  const { card, dom } = setup();
  addCalendar(card, 'calendar.family', true);
  const plan = await card._planEventSeries(seriesValues({ eventIcon: 'mdi:sail-boat', entities: ['calendar.work', 'calendar.family'] }));
  assert.equal(plan.tasks.length, 8);
  assert.ok(plan.tasks.every(task => task.data.summary === '⛵ Class'));
  dom.window.close();
});

test('saved templates restore event icons and Unicode titles', () => {
  const { card, window, dom } = setup();
  card._openEventDialog();
  let form = card.querySelector('form');
  form.elements.summary.value = 'Tennis';
  form.querySelector('[data-icon-choice="mdi:tennis-ball"]').click();
  form.elements.templateName.value = 'Tennis class';
  form.querySelector('[data-save-template]').click();
  form.querySelector('[data-cancel]').click();
  card._openEventDialog();
  form = card.querySelector('form');
  form.elements.template.value = 'saved:0';
  form.elements.template.dispatchEvent(new window.Event('change'));
  assert.equal(form.elements.eventIcon.value, 'mdi:tennis-ball');
  assert.equal(form.elements.summary.value, '🎾 Tennis');
  dom.window.close();
});

test('Home Assistant icon picker updates Unicode title when available', () => {
  const { card, window, dom } = setup();
  window.customElements.define('ha-icon-picker', class extends window.HTMLElement {});
  card._openEventDialog();
  const form = card.querySelector('form');
  const picker = card.querySelector('ha-icon-picker');
  form.elements.summary.value = 'Vet';
  assert.equal(card.querySelector('[data-icon-fallback]').hidden, true);
  picker.dispatchEvent(new window.CustomEvent('value-changed', { detail: { value: 'mdi:cat' } }));
  assert.equal(form.elements.summary.value, '🐱 Vet');
  assert.equal(form.elements.eventIcon.value, 'mdi:cat');
  assert.equal(picker.value, 'mdi:cat');
  dom.window.close();
});
