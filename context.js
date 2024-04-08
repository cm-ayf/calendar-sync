class Context {
  /**
   * @param {GoogleAppsScript.Calendar.Calendar} destination
   * @param {Source} source
   */
  constructor(destination, source) {
    /**
     * @type {GoogleAppsScript.Calendar.Calendar}
     */
    this.destination = destination;
    /**
     * @type {Source}
     */
    this.source = source;
  }

  /**
   * @param {Record<string, Pair>} pairs
   */
  sync(pairs) {
    const events = this.source.getEvents().filter(shouldSync);

    for (const event of events) {
      const eventId = nonnull(event.id);
      const existing = pairs[eventId];
      const isUpToDate =
        !!existing &&
        existing.metadata.lastUpdated.getTime() >=
          Date.parse(nonnull(event.updated));

      if (isUpToDate) {
        delete pairs[eventId];
      } else {
        const cloned = this.clone(event);
        const metadata = this.source.getMetadata(event);
        metadata.apply(cloned);
      }
    }

    // delete not-up-to-date events
    for (const eventId in pairs) {
      const { event } = nonnull(pairs[eventId]);
      event.deleteEvent();
    }
  }

  /**
   * @param {CalendarEvent} event
   * @returns
   */
  clone(event) {
    const summary = this.source.prefix + nonnull(event.summary);
    const start = parseDate(nonnull(event.start));
    const end = parseDate(nonnull(event.end));
    if (start.isAllDay !== end.isAllDay) {
      throw new Error("start and end should be both all-day or not");
    }

    if (start.isAllDay) {
      return this.destination.createAllDayEvent(summary, start.date, end.date, {
        description: event.description,
        location: event.location ?? event.hangoutLink,
      });
    } else {
      return this.destination.createEvent(summary, start.date, end.date, {
        description: event.description,
        location: event.location ?? event.hangoutLink,
      });
    }
  }
}

/**
 * @param {CalendarEvent} event
 */
function shouldSync(event) {
  if (!event.attendees) return true;
  for (const attendee of event.attendees) {
    if (attendee.self) {
      return attendee.responseStatus === "accepted";
    }
  }
  return true;
}
