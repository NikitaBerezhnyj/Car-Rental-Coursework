"use server";

import { carCategoryService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LIST_PATH = "/settings/categories";

export async function createCarCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => carCategoryService.create(values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateCarCategory(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => carCategoryService.update(id, values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteCarCategory(id: number): Promise<FormState> {
  const failure = await runAction(() => carCategoryService.remove(id));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  return { error: null };
}
