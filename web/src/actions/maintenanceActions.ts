"use server";

import { maintenanceService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LIST_PATH = "/maintenance";

export async function createMaintenance(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const failure = await runAction(() => maintenanceService.create(getFormValues(formData)));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateMaintenance(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const failure = await runAction(() => maintenanceService.update(id, getFormValues(formData)));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteMaintenance(id: number): Promise<FormState> {
  const failure = await runAction(() => maintenanceService.remove(id));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  return { error: null };
}
