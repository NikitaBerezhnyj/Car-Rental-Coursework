"use server";

import { extraService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LIST_PATH = "/extras";

export async function createExtra(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => extraService.create(values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateExtra(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => extraService.update(id, values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteExtra(id: number): Promise<FormState> {
  const failure = await runAction(() => extraService.remove(id));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  return { error: null };
}
