"use server";

import { employeeService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LIST_PATH = "/settings/employees";

export async function createEmployee(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => employeeService.create(values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateEmployee(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);

  const failure = await runAction(() => employeeService.update(id, values));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteEmployee(id: number): Promise<FormState> {
  const failure = await runAction(() => employeeService.remove(id));
  if (failure) return failure;

  revalidatePath(LIST_PATH);
  return { error: null };
}
