"use client";

import { StatCard } from "../StatCard/StatCard";
import { StatusBadge, type StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./Rentals.module.css";
import { type Column, DataTable } from "@/components/DataTable/DataTable";
import type { Rental, RentalStatus } from "@/types/rental";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type RentalStatusFilter = "all" | RentalStatus;

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

export default function Rentals({ rentals }: { rentals: Rental[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RentalStatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRentals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rentals.filter(rental => {
      const matchesSearch =
        !normalizedSearch ||
        String(rental.id).includes(normalizedSearch) ||
        rental.customerName.toLowerCase().includes(normalizedSearch) ||
        rental.carName.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "all" || rental.status === statusFilter;

      const startDate = rental.startDate.slice(0, 10);

      const matchesDateFrom = !dateFrom || startDate >= dateFrom;
      const matchesDateTo = !dateTo || startDate <= dateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [rentals, search, statusFilter, dateFrom, dateTo]);

  const stats = useMemo(() => {
    return {
      total: rentals.length,
      active: rentals.filter(rental => rental.status === "active").length,
      booked: rentals.filter(rental => rental.status === "booked").length,
      completed: rentals.filter(rental => rental.status === "completed").length
    };
  }, [rentals]);

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

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  const hasFilters = search !== "" || statusFilter !== "all" || dateFrom !== "" || dateTo !== "";

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
        <StatCard title="Усього оренд" value={stats.total} />
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
          onChange={event => setSearch(event.target.value)}
        />

        <select
          className={`form-control ${styles.selectControl}`}
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value as RentalStatusFilter)}
        >
          <option value="ALL">Усі статуси</option>
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
            onChange={event => setDateFrom(event.target.value)}
          />
        </label>

        <label className={styles.dateFilter}>
          <span>До</span>
          <input
            className={`form-control ${styles.dateInput}`}
            type="date"
            value={dateTo}
            onChange={event => setDateTo(event.target.value)}
          />
        </label>

        {hasFilters && (
          <button type="button" className="button-reset" onClick={resetFilters}>
            Скинути
          </button>
        )}
      </section>

      <DataTable
        title="Список оренд"
        rows={filteredRentals}
        columns={columns}
        emptyMessage={hasFilters ? "За заданими параметрами оренд не знайдено" : "Оренд поки немає"}
        onRowClick={rental => router.push(`/rentals/${rental.id}`)}
      />
    </main>
  );
}
