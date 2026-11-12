import { AppError } from "./errors";
import type { z } from "zod";

export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  input: unknown,
): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join("; ");
    throw new AppError(message, "VALIDATION");
  }
  return result.data;
}
