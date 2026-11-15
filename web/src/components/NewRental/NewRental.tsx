"use client";

import styles from "./NewRental.module.css";
import type { Car } from "@/types/car";
import type { Customer } from "@/types/customer";
import type { Employee } from "@/types/employee";
import type { Extra } from "@/types/extra";
import type { FormState } from "@/types/formState";
import { formatCurrency } from "@/utils/currency";
import { countDays } from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useActionState, useState } from "react";

type NewRentalProps = {
  customers: Customer[];
  employees: Employee[];
  extras: Extra[];
  cars: Car[];
  minDate: string;
  initialStartDate: string;
  initialEndDate: string;
  initialCustomerId?: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { error: null };

export function NewRental({
  customers,
  employees,
  extras,
  cars,
  minDate,
  initialStartDate,
  initialEndDate,
  initialCustomerId,
  action
}: NewRentalProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [carId, setCarId] = useState("");
  const [extraIds, setExtraIds] = useState<number[]>([]);

  const selectedCar = cars.find(car => String(car.id) === carId);
  const selectedExtras = extras.filter(extra => extraIds.includes(extra.id));

  const isPeriodValid = startDate !== "" && endDate !== "" && endDate >= startDate;
  const days = isPeriodValid ? countDays(startDate, endDate) : 0;

  const rentalCost = selectedCar ? days * selectedCar.dailyRate : 0;
  const extrasCost = days * selectedExtras.reduce((sum, extra) => sum + extra.dailyPrice, 0);

  // Період зберігається в адресі: сервер повертає автомобілі, вільні на ці дати
  function changePeriod(nextStartDate: string, nextEndDate: string) {
    setStartDate(nextStartDate);
    setEndDate(nextEndDate);

    if (nextStartDate !== "" && nextEndDate !== "" && nextEndDate >= nextStartDate) {
      router.replace(`/rentals/new?startDate=${nextStartDate}&endDate=${nextEndDate}`, {
        scroll: false
      });
    }
  }

  function toggleExtra(id: number) {
    setExtraIds(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Створення оренди</h1>
          <p className={styles.subtitle}>
            Заповніть інформацію для оформлення нової оренди автомобіля.
          </p>
        </div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Клієнт</h2>

          <div className={styles.field}>
            <label htmlFor="customerId" className={styles.label}>
              Клієнт
            </label>

            <select
              id="customerId"
              name="customerId"
              className={styles.input}
              defaultValue={initialCustomerId ?? ""}
            >
              <option value="" disabled>
                Оберіть клієнта
              </option>

              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.lastName} {customer.firstName} — {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/customers/new?returnTo=${encodeURIComponent(
              `/rentals/new?startDate=${startDate}&endDate=${endDate}`
            )}`}
            className={styles.textLink}
          >
            + Додати нового клієнта
          </Link>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Період оренди</h2>

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label htmlFor="startDate" className={styles.label}>
                Дата початку
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                min={minDate}
                className={styles.input}
                value={startDate}
                onChange={event => {
                  const value = event.target.value;
                  changePeriod(value, endDate < value ? value : endDate);
                }}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="endDate" className={styles.label}>
                Дата завершення
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                min={startDate || minDate}
                className={styles.input}
                value={endDate}
                onChange={event => changePeriod(startDate, event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Автомобіль</h2>

          <div className={styles.field}>
            <label htmlFor="carId" className={styles.label}>
              Вільні автомобілі на обраний період
            </label>

            <select
              id="carId"
              name="carId"
              className={styles.input}
              value={selectedCar ? carId : ""}
              onChange={event => setCarId(event.target.value)}
            >
              <option value="" disabled>
                Оберіть автомобіль
              </option>

              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} — {car.plateNumber} · {car.categoryName} (
                  {formatCurrency(car.dailyRate)} / доба)
                </option>
              ))}
            </select>
          </div>

          {cars.length === 0 && (
            <p className={styles.hint}>На обраний період вільних автомобілів немає</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Додаткові послуги</h2>

          <div className={styles.services}>
            {extras.map(extra => (
              <label key={extra.id} className={styles.service}>
                <span className={styles.serviceInfo}>
                  <input
                    type="checkbox"
                    name="extraIds"
                    value={extra.id}
                    checked={extraIds.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.serviceName}>{extra.name}</span>
                </span>

                <span className={styles.servicePrice}>
                  {formatCurrency(extra.dailyPrice)} / доба
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Працівник</h2>

          <div className={styles.field}>
            <label htmlFor="employeeId" className={styles.label}>
              Відповідальний працівник
            </label>

            <select id="employeeId" name="employeeId" className={styles.input} defaultValue="">
              <option value="" disabled>
                Оберіть працівника
              </option>

              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.lastName} {employee.firstName} — {employee.position}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className={styles.summary}>
          <h2 className={styles.sectionTitle}>Розрахунок</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Оренда автомобіля{days > 0 ? ` (${days} дн.)` : ""}</span>
              <span>{formatCurrency(rentalCost)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Додаткові послуги</span>
              <span>{formatCurrency(extrasCost)}</span>
            </div>
          </div>

          <div className={styles.total}>
            <span>Загальна вартість</span>
            <span>{formatCurrency(rentalCost + extrasCost)}</span>
          </div>

          <p className={styles.hint}>Вартість попередня: остаточну розраховує сервер.</p>
        </section>

        {state.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}

        <div className={styles.actions}>
          <Link href="/rentals" className={styles.cancelButton}>
            Скасувати
          </Link>

          <button type="submit" className={styles.submitButton} disabled={pending}>
            Створити оренду
          </button>
        </div>
      </form>
    </main>
  );
}
