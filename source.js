/**
 * @typedef {object} SourceOptions
 * @property {string} [prefix]
 */

class Source {
  /**
   * @param {SourceOptions} [options]
   * @param {string} calendarId
   */
  constructor(calendarId, options) {
    /**
     * @type {string}
     */
    this.calendarId = calendarId;
    /**
     * @type {string}
     */
    this.prefix = options?.prefix ?? "";
  }

  getEvents() {
    assert(Calendar.Events);
    const { items } = Calendar.Events.list(this.calendarId, {
      singleEvents: true,
      orderBy: "startTime",
      timeMin: window.start.toISOString(),
      timeMax: window.end.toISOString(),
    });
    return nonnull(items);
  }

  /**
   * @param {CalendarEvent} event
   */
  getMetadata(event) {
    return new EventMetadata(
      this.calendarId,
      nonnull(event.id),
      new Date(nonnull(event.updated)),
    );
  }
}
