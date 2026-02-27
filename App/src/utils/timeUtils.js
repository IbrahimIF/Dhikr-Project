export function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export const TIME_ZONES = [
  { label: 'London',        iana: 'Europe/London' },
  { label: 'New York',      iana: 'America/New_York' },
  { label: 'Los Angeles',   iana: 'America/Los_Angeles' },
  { label: 'Chicago',       iana: 'America/Chicago' },
  { label: 'Toronto',       iana: 'America/Toronto' },
  { label: 'São Paulo',     iana: 'America/Sao_Paulo' },
  { label: 'Reykjavik',     iana: 'Atlantic/Reykjavik' },
  { label: 'Paris',         iana: 'Europe/Paris' },
  { label: 'Berlin',        iana: 'Europe/Berlin' },
  { label: 'Rome',          iana: 'Europe/Rome' },
  { label: 'Madrid',        iana: 'Europe/Madrid' },
  { label: 'Amsterdam',     iana: 'Europe/Amsterdam' },
  { label: 'Stockholm',     iana: 'Europe/Stockholm' },
  { label: 'Athens',        iana: 'Europe/Athens' },
  { label: 'Istanbul',      iana: 'Europe/Istanbul' },
  { label: 'Moscow',        iana: 'Europe/Moscow' },
  { label: 'Cairo',         iana: 'Africa/Cairo' },
  { label: 'Nairobi',       iana: 'Africa/Nairobi' },
  { label: 'Lagos',         iana: 'Africa/Lagos' },
  { label: 'Johannesburg',  iana: 'Africa/Johannesburg' },
  { label: 'Riyadh',        iana: 'Asia/Riyadh' },
  { label: 'Dubai',         iana: 'Asia/Dubai' },
  { label: 'Karachi',       iana: 'Asia/Karachi' },
  { label: 'Mumbai',        iana: 'Asia/Kolkata' },
  { label: 'Dhaka',         iana: 'Asia/Dhaka' },
  { label: 'Bangkok',       iana: 'Asia/Bangkok' },
  { label: 'Jakarta',       iana: 'Asia/Jakarta' },
  { label: 'Singapore',     iana: 'Asia/Singapore' },
  { label: 'Kuala Lumpur',  iana: 'Asia/Kuala_Lumpur' },
  { label: 'Hong Kong',     iana: 'Asia/Hong_Kong' },
  { label: 'Shanghai',      iana: 'Asia/Shanghai' },
  { label: 'Beijing',       iana: 'Asia/Shanghai' },
  { label: 'Tokyo',         iana: 'Asia/Tokyo' },
  { label: 'Seoul',         iana: 'Asia/Seoul' },
  { label: 'Sydney',        iana: 'Australia/Sydney' },
  { label: 'Melbourne',     iana: 'Australia/Melbourne' },
  { label: 'Auckland',      iana: 'Pacific/Auckland' },
  { label: 'Honolulu',      iana: 'Pacific/Honolulu' },
  { label: 'Anchorage',     iana: 'America/Anchorage' },
];

export function formatTimeInZone(date, iana) {
  return date.toLocaleTimeString('en-GB', { timeZone: iana });
}