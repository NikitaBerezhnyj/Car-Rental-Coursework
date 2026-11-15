export function toLikePattern(search?: string): string | null {
  if (!search) return null;

  return `%${search.replace(/[\\%_]/g, "\\$&")}%`;
}
