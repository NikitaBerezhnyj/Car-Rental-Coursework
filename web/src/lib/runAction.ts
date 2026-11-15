import { AppError } from "@/lib/errors";
import type { FormState } from "@/types/formState";

export async function runAction(operation: () => Promise<unknown>): Promise<FormState | null> {
  try {
    await operation();
    return null;
  } catch (error) {
    if (error instanceof AppError) return { error: error.message };
    throw error;
  }
}

export function getFormValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(formData) as Record<string, string>;
}
