"use client";

import { FormField } from "@/components/ui/FormField/FormField";
import { FormPage } from "@/components/ui/FormPage/FormPage";
import type { Car } from "@/types/car";
import type { FormState } from "@/types/formState";
import type { Maintenance } from "@/types/maintenance";
import { useActionState } from "react";

type MaintenanceFormProps = {
  record?: Maintenance;
  cars: Car[];
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function MaintenanceForm({ record, cars, action }: MaintenanceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = record !== undefined;

  return (
    <FormPage
      title={isEdit ? "Редагування запису" : "Новий запис про обслуговування"}
      subtitle={
        isEdit
          ? "Щоб завершити обслуговування, вкажіть дату завершення"
          : "Дату завершення можна залишити порожньою, якщо обслуговування триває"
      }
      cancelHref="/maintenance"
      submitLabel={isEdit ? "Зберегти" : "Додати запис"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Автомобіль" wide>
        <select name="carId" className="form-control" defaultValue={record?.carId ?? ""}>
          <option value="" disabled>
            Оберіть автомобіль
          </option>

          {cars.map(car => (
            <option key={car.id} value={car.id}>
              {car.brand} {car.model} — {car.plateNumber}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Дата початку">
        <input
          name="startDate"
          type="date"
          className="form-control"
          defaultValue={record?.startDate}
        />
      </FormField>

      <FormField label="Дата завершення">
        <input
          name="endDate"
          type="date"
          className="form-control"
          defaultValue={record?.endDate ?? ""}
        />
      </FormField>

      <FormField label="Опис" wide>
        <input name="description" className="form-control" defaultValue={record?.description} />
      </FormField>

      <FormField label="Вартість, грн">
        <input
          name="cost"
          className="form-control"
          inputMode="decimal"
          defaultValue={record?.cost ?? 0}
        />
      </FormField>
    </FormPage>
  );
}
