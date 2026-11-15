"use client";

import { FormField } from "@/components/ui/FormField/FormField";
import { FormPage } from "@/components/ui/FormPage/FormPage";
import type { Customer } from "@/types/customer";
import type { FormState } from "@/types/formState";
import { useActionState } from "react";

type CustomerFormProps = {
  customer?: Customer;
  returnTo?: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function CustomerForm({ customer, returnTo, action }: CustomerFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = customer !== undefined;

  const values = {
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    driverLicense: customer?.driverLicense ?? ""
  };

  return (
    <FormPage
      title={isEdit ? "Редагування клієнта" : "Новий клієнт"}
      subtitle={isEdit ? "Змініть дані клієнта та збережіть" : "Заповніть дані нового клієнта"}
      cancelHref={returnTo ?? "/customers"}
      submitLabel={isEdit ? "Зберегти" : "Додати клієнта"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

      <FormField label="Ім'я">
        <input name="firstName" className="form-control" defaultValue={values.firstName} />
      </FormField>

      <FormField label="Прізвище">
        <input name="lastName" className="form-control" defaultValue={values.lastName} />
      </FormField>

      <FormField label="Телефон">
        <input
          name="phone"
          className="form-control"
          placeholder="+380501112233"
          defaultValue={values.phone}
        />
      </FormField>

      <FormField label="Email (необов'язково)">
        <input name="email" className="form-control" defaultValue={values.email} />
      </FormField>

      <FormField label="Посвідчення водія">
        <input name="driverLicense" className="form-control" defaultValue={values.driverLicense} />
      </FormField>
    </FormPage>
  );
}
