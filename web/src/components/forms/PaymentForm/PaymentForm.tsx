"use client";

import { FormField } from "@/components/ui/FormField/FormField";
import { FormPage } from "@/components/ui/FormPage/FormPage";
import type { FormState } from "@/types/formState";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/types/payment";
import type { Rental } from "@/types/rental";
import { formatCurrency } from "@/utils/currency";
import { useActionState } from "react";

type PaymentFormProps = {
  rental: Rental;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function PaymentForm({ rental, action }: PaymentFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <FormPage
      title="Реєстрація оплати"
      subtitle={`Оренда #${rental.id} · ${rental.customerName}. Залишок до сплати: ${formatCurrency(rental.balance)}`}
      cancelHref={`/rentals/${rental.id}`}
      submitLabel="Зареєструвати оплату"
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Сума, грн">
        <input
          name="amount"
          className="form-control"
          inputMode="decimal"
          defaultValue={rental.balance}
        />
      </FormField>

      <FormField label="Спосіб оплати">
        <select name="method" className="form-control" defaultValue="card">
          {PAYMENT_METHODS.map(method => (
            <option key={method} value={method}>
              {PAYMENT_METHOD_LABELS[method]}
            </option>
          ))}
        </select>
      </FormField>
    </FormPage>
  );
}
