const ZONED_ISO_TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/i;

export const isValidTimeZone = (timeZone) => {
  if (typeof timeZone !== 'string' || !timeZone) return false;

  try {
    new Intl.DateTimeFormat('en', { timeZone });
    return true;
  } catch {
    return false;
  }
};

export const parseLoginTimestamp = (value) => {
  if (typeof value !== 'string') return null;

  // Without an explicit offset, parsing depends on the browser's local timezone.
  const match = value.match(ZONED_ISO_TIMESTAMP);
  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds, , , offsetHours, offsetMinutes] =
    match;
  const calendarDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  if (
    Number.isNaN(calendarDate.getTime()) ||
    calendarDate.toISOString().slice(0, 10) !== `${year}-${month}-${day}` ||
    Number(hours) > 23 ||
    Number(minutes) > 59 ||
    Number(seconds) > 59 ||
    Number(offsetHours) > 23 ||
    Number(offsetMinutes) > 59
  ) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatLoginTimestamp = (value, timeZone) => {
  const date = parseLoginTimestamp(value);
  if (!date || !isValidTimeZone(timeZone)) return null;

  return {
    dateTime: date.toISOString(),
    text: new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone,
    }).format(date),
  };
};
