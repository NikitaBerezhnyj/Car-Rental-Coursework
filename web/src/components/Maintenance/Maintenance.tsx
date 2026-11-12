"use client";

import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./Maintenance.module.css";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Maintenance as MaintenanceRecord } from "@/types/maintenance";
import Link from "next/link";

type MaintenanceProps = {
  records: MaintenanceRecord[];
};

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  // Дата у форматі YYYY-MM-DD має трактуватися як локальна,
  // а не як UTC, щоб уникнути зсуву на попередній день.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  const date = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function Maintenance({ records }: MaintenanceProps) {
  const columns: Column<MaintenanceRecord>[] = [
    {
      header: "Автомобіль",
      render: record => (
        <div className={styles.carCell}>
          <span className={styles.carName}>{record.carName}</span>
          <span className={styles.description}>{record.description}</span>
        </div>
      )
    },
    {
      header: "Початок",
      render: record => formatDate(record.startDate)
    },
    {
      header: "Завершення",
      render: record => formatDate(record.endDate)
    },
    {
      header: "Вартість",
      render: record => <span className={styles.cost}>{currencyFormatter.format(record.cost)}</span>
    },
    {
      header: "Статус",
      render: record => (
        <StatusBadge
          label={record.endDate ? "Завершено" : "Триває"}
          variant={record.endDate ? "success" : "warning"}
        />
      )
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Техобслуговування</h1>
          <p className="page-subtitle">Облік технічного обслуговування автомобілів</p>
        </div>

        <Link href="/maintenance/new" className="button-primary">
          + Додати запис
        </Link>
      </header>

      <DataTable
        title="Історія техобслуговування"
        rows={records}
        columns={columns}
        emptyMessage="Записів про техобслуговування поки немає"
      />
    </main>
  );
}
