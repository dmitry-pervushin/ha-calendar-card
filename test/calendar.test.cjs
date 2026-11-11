const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync(require.resolve('../outlook-calendar-card.js'), 'utf8');

function setup() {
  const dom = new JSDOM('', { runScripts: 'outside-only' });
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
