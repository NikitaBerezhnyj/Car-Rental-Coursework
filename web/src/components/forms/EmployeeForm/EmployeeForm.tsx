"use client";

import { FormField } from "@/components/ui/FormField/FormField";
import { FormPage } from "@/components/ui/FormPage/FormPage";
import { type Employee, EMPLOYEE_POSITIONS } from "@/types/employee";
import type { FormState } from "@/types/formState";
import { useActionState } from "react";

type EmployeeFormProps = {
  employee?: Employee;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function EmployeeForm({ employee, action }: EmployeeFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = employee !== undefined;

  const values = {
    firstName: employee?.firstName ?? "",
    lastName: employee?.lastName ?? "",
    position: employee?.position ?? "",
    phone: employee?.phone ?? ""
  };

  return (
    <FormPage
      title={isEdit ? "Редагування працівника" : "Новий працівник"}
      subtitle={
        isEdit ? "Змініть дані працівника та збережіть" : "Заповніть дані нового працівника"
      }
      cancelHref="/settings/employees"
      submitLabel={isEdit ? "Зберегти" : "Додати працівника"}
      action={formAction}
      pending={pending}
      error={state.error}
    >
      <FormField label="Ім'я">
        <input name="firstName" className="form-control" defaultValue={values.firstName} />
      </FormField>

      <FormField label="Прізвище">
        <input name="lastName" className="form-control" defaultValue={values.lastName} />
      </FormField>

      <FormField label="Посада">
        <select name="position" className="form-control" defaultValue={values.position}>
          <option value="" disabled>
            Оберіть посаду
          </option>

          {EMPLOYEE_POSITIONS.map(position => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Телефон">
        <input
          name="phone"
          className="form-control"
          placeholder="+380671112233"
          defaultValue={values.phone}
        />
      </FormField>
    </FormPage>
  );
}
