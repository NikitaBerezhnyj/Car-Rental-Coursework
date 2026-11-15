"use client";

import { FormField } from "@/components/FormField/FormField";
import { FormPage } from "@/components/FormPage/FormPage";
import type { Extra } from "@/types/extra";
import type { FormState } from "@/types/formState";
import { useActionState } from "react";

type ExtraFormProps = {
  extra?: Extra;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function ExtraForm({ extra, action }: ExtraFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = extra !== undefined;

  const values = {
    name: extra?.name ?? "",
    dailyPrice: extra ? String(extra.dailyPrice) : ""
  };

  return (
    <FormPage
      title={isEdit ? "Редагування послуги" : "Нова послуга"}
      subtitle={
        isEdit
          ? "Зміна ціни не вплине на вже оформлені оренди"
          : "Вкажіть назву послуги та ціну за добу"
      }
      cancelHref="/extras"
      submitLabel={isEdit ? "Зберегти" : "Додати послугу"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Назва">
        <input name="name" className="form-control" defaultValue={values.name} />
      </FormField>

      <FormField label="Ціна за добу, грн">
        <input
          name="dailyPrice"
          className="form-control"
          inputMode="decimal"
          defaultValue={values.dailyPrice}
        />
      </FormField>
    </FormPage>
  );
}
