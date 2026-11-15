"use client";

import { StatCard } from "../StatCard/StatCard";
import styles from "./Dashboard.module.css";
import { DataTable } from "@/components/DataTable/DataTable";
import type { DashboardData } from "@/types/dashboard";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";

export default function Dashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const { summary } = data;

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Головна</h1>
          <p className="page-subtitle">Огляд роботи пункту прокату</p>
        </div>

        <button className="button-primary" onClick={() => router.push("/rentals/new")}>
          <span>+</span>
          Нова оренда
        </button>
      </header>

      <section className={styles.stats}>
        <StatCard
          title="Вільні автомобілі"
          value={`${summary.availableCars} з ${summary.totalCars}`}
          description="Готові до оренди"
        />
        <StatCard
          title="Активні оренди"
          value={summary.activeRentals}
          description="Автомобілі зараз у клієнтів"
        />
        <StatCard
          title="Прострочені"
          value={summary.overdueRentals}
          description="Потребують уваги"
        />
        <StatCard
          title="Надходження за місяць"
          value={formatCurrency(summary.monthIncome)}
          description={`Борг клієнтів: ${formatCurrency(summary.totalDebt)}`}
        />
      </section>

      <section className={styles.grid}>
        <DataTable
          title="Прострочені повернення"
          rows={data.overdueRentals}
          onRowClick={rental => router.push(`/rentals/${rental.id}`)}
          columns={[
            { header: "Клієнт", render: row => row.customerName },
            { header: "Автомобіль", render: row => row.carName },
            { header: "Мав повернутися", render: row => formatDate(row.endDate) },
            { header: "Днів", render: row => row.daysOverdue }
          ]}
          emptyMessage="Прострочених оренд немає"
        />

        <DataTable
          title="Повернення найближчі 7 днів"
          rows={data.upcomingReturns}
          onRowClick={rental => router.push(`/rentals/${rental.id}`)}
          columns={[
            { header: "Клієнт", render: row => row.customerName },
            { header: "Автомобіль", render: row => row.carName },
            { header: "Дата", render: row => formatDate(row.date) }
          ]}
          emptyMessage="Найближчим часом повернень немає"
        />

        <DataTable
          title="Видачі найближчі 7 днів"
          rows={data.upcomingPickups}
          onRowClick={rental => router.push(`/rentals/${rental.id}`)}
          columns={[
            { header: "Клієнт", render: row => row.customerName },
            { header: "Автомобіль", render: row => row.carName },
            { header: "Дата початку", render: row => formatDate(row.date) }
          ]}
          emptyMessage="Найближчим часом видач немає"
        />

        <DataTable
          title="Найбільші борги клієнтів"
          rows={data.debtors}
          columns={[
            { header: "Клієнт", render: row => row.customerName },
            { header: "Телефон", render: row => row.phone },
            { header: "Борг", render: row => formatCurrency(row.debt) }
          ]}
          emptyMessage="Заборгованостей немає"
        />
      </section>
    </main>
  );
}
