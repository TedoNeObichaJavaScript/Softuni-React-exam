const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const numberFormatter = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? numberFormatter.format(number) : '';
}

export function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

export function formatDistance(km) {
  const text = formatNumber(km);
  return text ? `${text} km` : '';
}

export function formatElevation(m) {
  const text = formatNumber(Math.round(Number(m)));
  return text ? `${text} m` : '';
}

export function formatDuration(hours) {
  const totalMinutes = Math.round(Number(hours) * 60);
  if (!Number.isFinite(totalMinutes)) return '';

  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (wholeHours === 0) return `${minutes} min`;
  if (minutes === 0) return `${wholeHours} h`;
  return `${wholeHours} h ${minutes} min`;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
