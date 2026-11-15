"use server";

import { rentalService } from "@/container";
import { getFormValues, runAction } from "@/lib/runAction";
import type { FormState } from "@/types/formState";
import type { RentalStatus } from "@/types/rental";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRental(_prevState: FormState, formData: FormData): Promise<FormState> {
  const input = { ...getFormValues(formData), extraIds: formData.getAll("extraIds") };

  let rentalId = 0;

  const failure = await runAction(async () => {
    rentalId = await rentalService.create(input);
  });
  if (failure) return failure;

  revalidatePath("/rentals");
  redirect(`/rentals/${rentalId}`);
}

async function changeStatus(id: number, status: RentalStatus): Promise<FormState> {
  const failure = await runAction(() => rentalService.changeStatus(id, status));
  if (failure) return failure;

  revalidatePath("/rentals");
  revalidatePath(`/rentals/${id}`);
  return { error: null };
}

export async function issueRental(id: number): Promise<FormState> {
  return changeStatus(id, "active");
}

export async function returnRental(id: number): Promise<FormState> {
  return changeStatus(id, "completed");
}

export async function cancelRental(id: number): Promise<FormState> {
  return changeStatus(id, "cancelled");
}
