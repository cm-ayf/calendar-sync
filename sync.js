function sync() {
  const destination = getDestination();
  const sources = getSources();

  const events = destination.getEvents(window.start, window.end);
  const pairIndex = createPairIndex(events);

  for (const source of sources) {
    const context = new Context(destination, source);
    context.sync(pairIndex[source.calendarId] ?? {});
  }
}

const properties = PropertiesService.getScriptProperties();

function getDestination() {
  const destinationId = properties.getProperty("destination");
  if (!destinationId) {
    throw new Error("Destination calendar ID is not set.");
  }
  return CalendarApp.getCalendarById(destinationId);
}

function getSources() {
  const calendarIds = properties.getKeys().filter((s) => s.indexOf("@") >= 0);
  return calendarIds.map((calendarId) => {
    const value = properties.getProperty(calendarId);
    const options = value ? JSON.parse(value) : {};
    return new Source(calendarId, options);
  });
}

/**
 * @param {GoogleAppsScript.Calendar.CalendarEvent[]} events
 */
function createPairIndex(events) {
  /**
   * @type {Record<string, Record<string, Pair>>}
   */
  const pairIndex = {};
  for (const event of events) {
    const metadata = EventMetadata.extract(event);
    if (!metadata) continue;

    const group = pairIndex[metadata.calendarId];
    if (group) {
      group[metadata.eventId] = { event, metadata };
    } else {
      pairIndex[metadata.calendarId] = {
        [metadata.eventId]: { event, metadata },
      };
    }
  }
  return pairIndex;
}
