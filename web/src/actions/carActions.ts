"use server";

import { carService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LIST_PATH = "/cars";

export async function createCar(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => carService.create(values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateCar(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => carService.update(id, values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteCar(id: number): Promise<FormState> {
  const failure = await runAction(() => carService.remove(id));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  return { error: null };
}
