"use server";

import { paymentService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayment(
  rentalId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const input = { ...getFormValues(formData), rentalId: String(rentalId) };

  const failure = await runAction(() => paymentService.create(input));
  if (failure) return failure;

  revalidatePath("/payments");
  revalidatePath(`/rentals/${rentalId}`);
  redirect(`/rentals/${rentalId}`);
}

export async function deletePayment(id: number): Promise<FormState> {
  const failure = await runAction(() => paymentService.remove(id));
  if (failure) return failure;

  revalidatePath("/payments");
  return { error: null };
}
