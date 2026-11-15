"use client";

import { FormField } from "@/components/FormField/FormField";
import { FormPage } from "@/components/FormPage/FormPage";
import type { Car } from "@/types/car";
import type { CarCategory } from "@/types/carCategory";
import type { FormState } from "@/types/formState";
import { formatCurrency } from "@/utils/currency";
import { useActionState } from "react";

type CarFormProps = {
  car?: Car;
  categories: CarCategory[];
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function CarForm({ car, categories, action }: CarFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = car !== undefined;

  const values = {
    brand: car?.brand ?? "",
    model: car?.model ?? "",
    plateNumber: car?.plateNumber ?? "",
    year: car ? String(car.year) : "",
    categoryId: car ? String(car.categoryId) : "",
    status: car?.status === "retired" ? "retired" : "available"
  };

  return (
    <FormPage
      title={isEdit ? "Редагування автомобіля" : "Новий автомобіль"}
      subtitle={
        isEdit
          ? "Статуси «В оренді» та «На обслуговуванні» визначаються автоматично"
          : "Заповніть дані нового автомобіля"
      }
      cancelHref="/cars"
      submitLabel={isEdit ? "Зберегти" : "Додати автомобіль"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Марка">
        <input name="brand" className="form-control" defaultValue={values.brand} />
      </FormField>

      <FormField label="Модель">
        <input name="model" className="form-control" defaultValue={values.model} />
      </FormField>

      <FormField label="Номерний знак">
        <input
          name="plateNumber"
          className="form-control"
          placeholder="AA1234BB"
          defaultValue={values.plateNumber}
        />
      </FormField>

      <FormField label="Рік випуску">
        <input
          name="year"
          className="form-control"
          inputMode="numeric"
          placeholder="2022"
          defaultValue={values.year}
        />
      </FormField>

      <FormField label="Категорія">
        <select name="categoryId" className="form-control" defaultValue={values.categoryId}>
          <option value="" disabled>
            Оберіть категорію
          </option>

          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} — {formatCurrency(category.dailyRate)} / доба
            </option>
          ))}
        </select>
      </FormField>

      {isEdit && (
        <FormField label="Статус">
          <select name="status" className="form-control" defaultValue={values.status}>
            <option value="available">В експлуатації</option>
            <option value="retired">Списаний</option>
          </select>
        </FormField>
      )}
    </FormPage>
  );
}
