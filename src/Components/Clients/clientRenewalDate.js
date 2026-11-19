export const BUSINESS_TIME_ZONE = 'Africa/Johannesburg';

export const toZonedDateKey = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

const isValidDateOnlyString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

// Whole calendar days from today in `timeZone` to `date`. Negative = overdue.
export const getDaysLeft = (
  date,
  timeZone = BUSINESS_TIME_ZONE,
  now = new Date()
) => {
  if (!date) return null;

  let targetDateKey;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    if (!isValidDateOnlyString(date)) return null;
    targetDateKey = date;
  } else {
    const target = new Date(date);
    if (Number.isNaN(target.getTime())) return null;
    targetDateKey = toZonedDateKey(target, timeZone);
  }

  const todayKey = toZonedDateKey(now, timeZone);
  const msPerDay = 86_400_000;
  const todayUtc = Date.parse(`${todayKey}T00:00:00Z`);
  const targetUtc = Date.parse(`${targetDateKey}T00:00:00Z`);
  return Math.round((targetUtc - todayUtc) / msPerDay);
};
