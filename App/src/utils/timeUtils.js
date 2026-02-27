// utils/timeUtils.js

export function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/* --- Generate ALL supported IANA zones --- */
const allZones = Intl.supportedValuesOf('timeZone');

export const TIME_ZONES = [
  { label: 'London', iana: 'Europe/London' }, // Always first
  ...allZones
    .filter(tz => tz !== 'Europe/London')
    .map(tz => ({
      label: tz.replaceAll('_', ' '),
      iana: tz
    }))
];

export function formatTimeInZone(date, iana) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: iana,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}