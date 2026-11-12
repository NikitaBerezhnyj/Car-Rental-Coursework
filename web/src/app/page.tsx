import { Suspense } from "react";
import { DataTable } from "@/components/DataTable";
import {
  carCategoryService,
  carService,
  customerService,
  employeeService,
  extraService,
  maintenanceService,
  paymentService,
  rentalExtraService,
  rentalService,
} from "@/container";
import styles from "./page.module.css";

async function Tables() {
  const [
    customers,
    cars,
    categories,
    employees,
    rentals,
    payments,
    maintenance,
    extras,
    rentalExtras,
  ] = await Promise.all([
    customerService.list(),
    carService.list(),
    carCategoryService.list(),
    employeeService.list(),
    rentalService.list(),
    paymentService.list(),
    maintenanceService.list(),
    extraService.list(),
    rentalExtraService.list(),
  ]);

  return (
    <>
      <DataTable
        title="Клієнти"
        rows={customers}
        columns={[
          {
            header: "Прізвище та ім'я",
            render: (c) => `${c.lastName} ${c.firstName}`,
          },
          { header: "Телефон", render: (c) => c.phone },
          { header: "Email", render: (c) => c.email ?? "—" },
          { header: "Посвідчення", render: (c) => c.driverLicense },
        ]}
      />

      <DataTable
        title="Автомобілі"
        rows={cars}
        columns={[
          { header: "Авто", render: (c) => `${c.brand} ${c.model}` },
          { header: "Номер", render: (c) => c.plateNumber },
          { header: "Рік", render: (c) => c.year },
          { header: "Категорія", render: (c) => c.categoryName },
          { header: "Тариф, грн/доба", render: (c) => c.dailyRate },
          { header: "Статус", render: (c) => c.status },
        ]}
      />

      <DataTable
        title="Категорії автомобілів"
        rows={categories}
        columns={[
          { header: "Назва", render: (c) => c.name },
          { header: "Тариф, грн/доба", render: (c) => c.dailyRate },
        ]}
      />

      <DataTable
        title="Працівники"
        rows={employees}
        columns={[
          {
            header: "Прізвище та ім'я",
            render: (e) => `${e.lastName} ${e.firstName}`,
          },
          { header: "Посада", render: (e) => e.position },
          { header: "Телефон", render: (e) => e.phone },
        ]}
      />

      <DataTable
        title="Оренди"
        rows={rentals}
        columns={[
          { header: "№", render: (r) => r.id },
          { header: "Клієнт", render: (r) => r.customerName },
          { header: "Авто", render: (r) => r.carName },
          { header: "Працівник", render: (r) => r.employeeName },
          { header: "Початок", render: (r) => r.startDate },
          { header: "Кінець", render: (r) => r.endDate },
          { header: "Тариф, грн/доба", render: (r) => r.dailyRate },
          { header: "Статус", render: (r) => r.status },
        ]}
      />

      <DataTable
        title="Оплати"
        rows={payments}
        columns={[
          { header: "Оренда №", render: (p) => p.rentalId },
          { header: "Сума, грн", render: (p) => p.amount },
          { header: "Спосіб", render: (p) => p.method },
          { header: "Дата оплати", render: (p) => p.paidAt },
        ]}
      />

      <DataTable
        title="Технічне обслуговування"
        rows={maintenance}
        columns={[
          { header: "Авто", render: (m) => m.carName },
          { header: "Початок", render: (m) => m.startDate },
          { header: "Кінець", render: (m) => m.endDate ?? "триває" },
          { header: "Опис", render: (m) => m.description },
          { header: "Вартість, грн", render: (m) => m.cost },
        ]}
      />

      <DataTable
        title="Додаткові послуги"
        rows={extras}
        columns={[
          { header: "Назва", render: (e) => e.name },
          { header: "Ціна, грн/доба", render: (e) => e.dailyPrice },
        ]}
      />

      <DataTable
        title="Послуги в орендах"
        rows={rentalExtras}
        columns={[
          { header: "Оренда №", render: (r) => r.rentalId },
          { header: "Послуга", render: (r) => r.extraName },
          { header: "Ціна, грн/доба", render: (r) => r.price },
        ]}
      />
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Прокат автомобілів</h1>
      <Suspense fallback={<p className={styles.loading}>Завантаження…</p>}>
        <Tables />
      </Suspense>
    </main>
  );
}
