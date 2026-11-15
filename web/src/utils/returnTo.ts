export function getSafeReturnPath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const isInternal = value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");

  return isInternal ? value : undefined;
}
