class EventMetadata {
  /**
   * @param {GoogleAppsScript.Calendar.CalendarEvent} event
   * @returns {EventMetadata | undefined}
   */
  static extract(event) {
    const calendarId = event.getTag("calendarId");
    const eventId = event.getTag("eventId");
    const lastUpdated = event.getTag("lastUpdated");
    if (!calendarId || !eventId || !lastUpdated) return;
    return new EventMetadata(calendarId, eventId, new Date(lastUpdated));
  }

  /**
   * @param {string} calendarId
   * @param {string} eventId
   * @param {Date} lastUpdated
   */
  constructor(calendarId, eventId, lastUpdated) {
    /**
     * @type {string}
     */
    this.calendarId = calendarId;
    /**
     * @type {string}
     */
    this.eventId = eventId;
    /**
     * @type {Date}
     */
    this.lastUpdated = lastUpdated;
  }

  /**
   * @param {GoogleAppsScript.Calendar.CalendarEvent} event
   */
  apply(event) {
    event.setTag("calendarId", this.calendarId);
    event.setTag("eventId", this.eventId);
    event.setTag("lastUpdated", this.lastUpdated.toISOString());
  }
}

/**
 * @typedef {object} Pair
 * @property {GoogleAppsScript.Calendar.CalendarEvent} event
 * @property {EventMetadata} metadata
 */
