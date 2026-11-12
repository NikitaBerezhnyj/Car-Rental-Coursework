export function parseDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return new Date(NaN);
  }

  return date;
}

export function formatDate(value: string): string {
  const date = parseDate(value);

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("uk-UA");
}

export function getToday(): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
