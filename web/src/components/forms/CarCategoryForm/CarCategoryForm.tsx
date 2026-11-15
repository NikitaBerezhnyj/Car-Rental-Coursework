"use client";

import { FormField } from "@/components/ui/FormField/FormField";
import { FormPage } from "@/components/ui/FormPage/FormPage";
import type { CarCategory } from "@/types/carCategory";
import type { FormState } from "@/types/formState";
import { useActionState } from "react";

type CarCategoryFormProps = {
  category?: CarCategory;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function CarCategoryForm({ category, action }: CarCategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = category !== undefined;

  const values = {
    name: category?.name ?? "",
    dailyRate: category ? String(category.dailyRate) : ""
  };

  return (
    <FormPage
      title={isEdit ? "Редагування категорії" : "Нова категорія"}
      subtitle={
        isEdit
          ? "Зміна тарифу не вплине на вже оформлені оренди"
          : "Вкажіть назву категорії та тариф за добу"
      }
      cancelHref="/settings/categories"
      submitLabel={isEdit ? "Зберегти" : "Додати категорію"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Назва">
        <input name="name" className="form-control" defaultValue={values.name} />
      </FormField>

      <FormField label="Тариф за добу, грн">
        <input
          name="dailyRate"
          className="form-control"
          inputMode="decimal"
          defaultValue={values.dailyRate}
        />
      </FormField>
    </FormPage>
  );
}
