"use server";

import { customerService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { getSafeReturnPath } from "@/utils/returnTo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function toValues(formData: FormData): Record<string, string> {
  return Object.fromEntries(formData) as Record<string, string>;
}

export async function createCustomer(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = getFormValues(formData);
  const returnTo = getSafeReturnPath(values.returnTo);

  let customerId = 0;

  const failure = await runAction(async () => {
    customerId = (await customerService.create(values)).id;
  });
  if (failure) return failure;

  revalidatePath("/customers");
  let redirectUrl = "/customers";

  if (returnTo) {
    const separator = returnTo.includes("?") ? "&" : "?";
    redirectUrl = `${returnTo}${separator}customerId=${customerId}`;
  }

  redirect(redirectUrl);
}

export async function updateCustomer(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = toValues(formData);

  const failure = await runAction(() => customerService.update(id, values));
  if (failure) return failure;

  revalidatePath("/customers");
  redirect("/customers");
}

export async function deleteCustomer(id: number): Promise<FormState> {
  const failure = await runAction(() => customerService.remove(id));
  if (failure) return failure;

  revalidatePath("/customers");
  return { error: null };
}
