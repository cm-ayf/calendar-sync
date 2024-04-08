/**
 * @typedef {GoogleAppsScript.Calendar.Schema.Event} CalendarEvent
 * @typedef {GoogleAppsScript.Calendar.Schema.EventDateTime} EventDateTime
 */

/**
 * @param {EventDateTime} date
 */
function parseDate(date) {
  if ("dateTime" in date) {
    return { isAllDay: false, date: new Date(nonnull(date.dateTime)) };
  } else if ("date" in date) {
    return { isAllDay: true, date: new Date(nonnull(date.date)) };
  } else {
    throw new Error("Invalid EventDateTime");
  }
}

/**
 * @template T
 * @param {T} value
 * @returns {asserts value is NonNullable<T>}
 */
function assert(value) {
  if (!value) throw new Error("Assertion failed");
}

/**
 * @template T
 * @param {T} value
 * @returns {NonNullable<T>}
 */
function nonnull(value) {
  assert(value);
  return value;
}
