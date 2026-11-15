"use client";

import { StatCard } from "../StatCard/StatCard";
import { StatusBadge, type StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./Rentals.module.css";
import { type Column, DataTable } from "@/components/DataTable/DataTable";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { RentalFilters } from "@/types/filters";
import type { Rental, RentalStats, RentalStatus } from "@/types/rental";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABELS: Record<RentalStatus, string> = {
  booked: "Заброньована",
  active: "Активна",
  completed: "Завершена",
  cancelled: "Скасована"
};

const STATUS_VARIANTS: Record<RentalStatus, StatusBadgeVariant> = {
  booked: "info",
  active: "success",
  completed: "neutral",
  cancelled: "danger"
};

type RentalsProps = {
  rentals: Rental[];
  stats: RentalStats;
  filters: RentalFilters;
};

export default function Rentals({ rentals, stats, filters }: RentalsProps) {
  const router = useRouter();
  const { update, updateDebounced } = useUrlFilters();

  const [search, setSearch] = useState<string>(filters.search ?? "");
  const [status, setStatus] = useState<string>(filters.status ?? "");
  const [dateFrom, setDateFrom] = useState<string>(filters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState<string>(filters.dateTo ?? "");

  const total = stats.booked + stats.active + stats.completed + stats.cancelled;
  const hasFilters = search !== "" || status !== "" || dateFrom !== "" || dateTo !== "";

  const columns: Column<Rental>[] = [
    {
      header: "№",
      render: rental => `#${rental.id}`
    },
    {
      header: "Клієнт",
      render: rental => rental.customerName
    },
    {
      header: "Автомобіль",
      render: rental => rental.carName
    },
    {
      header: "Початок",
      render: rental => formatDate(rental.startDate)
    },
    {
      header: "Завершення",
      render: rental => formatDate(rental.endDate)
    },
    {
      header: "Ставка за день",
      render: rental => rental.dailyRate.toLocaleString("uk-UA")
    },
    {
      header: "Статус",
      render: rental => (
        <StatusBadge
          label={STATUS_LABELS[rental.status]}
          variant={STATUS_VARIANTS[rental.status]}
        />
      )
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Оренди</h1>
          <p className="page-subtitle">Перегляд та управління орендами автомобілів</p>
        </div>

        <Link href="/rentals/new" className="button-primary">
          <span>+</span>
          Створити оренду
        </Link>
      </header>

      <section className={styles.stats}>
        <StatCard title="Усього оренд" value={total} />
        <StatCard title="Активні" value={stats.active} />
        <StatCard title="Зарезервовані" value={stats.booked} />
        <StatCard title="Завершені" value={stats.completed} />
      </section>

      <section className={styles.filters}>
        <input
          className={`form-control ${styles.searchControl}`}
          type="search"
          placeholder="Пошук за клієнтом, автомобілем або ID..."
          value={search}
          onChange={event => {
            setSearch(event.target.value);
            updateDebounced({ search: event.target.value.trim() });
          }}
        />

        <select
          className={`form-control ${styles.selectControl}`}
          value={status}
          onChange={event => {
            setStatus(event.target.value);
            update({ status: event.target.value });
          }}
        >
          <option value="">Усі статуси</option>
          <option value="booked">Зарезервовані</option>
          <option value="active">Активні</option>
          <option value="completed">Завершені</option>
          <option value="cancelled">Скасовані</option>
        </select>

        <label className={styles.dateFilter}>
          <span>Від</span>
          <input
            className={`form-control ${styles.dateInput}`}
            type="date"
            value={dateFrom}
            onChange={event => {
              setDateFrom(event.target.value);
              update({ dateFrom: event.target.value });
            }}
          />
        </label>

        <label className={styles.dateFilter}>
          <span>До</span>
          <input
            className={`form-control ${styles.dateInput}`}
            type="date"
            value={dateTo}
            onChange={event => {
              setDateTo(event.target.value);
              update({ dateTo: event.target.value });
            }}
          />
        </label>
      </section>

      <DataTable
        title="Список оренд"
        rows={rentals}
        columns={columns}
        emptyMessage={hasFilters ? "За заданими параметрами оренд не знайдено" : "Оренд поки немає"}
        onRowClick={rental => router.push(`/rentals/${rental.id}`)}
      />
    </main>
  );
}
