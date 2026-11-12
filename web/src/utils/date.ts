export function parseDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatDate(value: string): string {
  return parseDate(value).toLocaleDateString("uk-UA");
}

export function getToday(): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
