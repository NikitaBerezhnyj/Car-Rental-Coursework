"use client";

import { StatusBadge, type StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./Cars.module.css";
import { type Column, DataTable } from "@/components/DataTable/DataTable";
import type { Car, CarStatus } from "@/types/car";
import Link from "next/link";
import { useMemo, useState } from "react";

const STATUS_LABELS: Record<CarStatus, string> = {
  available: "Доступний",
  maintenance: "На обслуговуванні",
  retired: "Списаний"
};

const STATUS_VARIANTS: Record<CarStatus, StatusBadgeVariant> = {
  available: "success",
  maintenance: "warning",
  retired: "neutral"
};

type CarStatusFilter = "ALL" | CarStatus;

export function Cars({ cars }: { cars: Car[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CarStatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = useMemo(() => [...new Set(cars.map(car => car.categoryName))].sort(), [cars]);

  const filteredCars = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cars.filter(car => {
      const matchesSearch =
        !normalizedSearch ||
        `${car.brand} ${car.model}`.toLowerCase().includes(normalizedSearch) ||
        car.plateNumber.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "ALL" || car.status === statusFilter;

      const matchesCategory = categoryFilter === "ALL" || car.categoryName === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [cars, search, statusFilter, categoryFilter]);

  const columns: Column<Car>[] = [
    {
      header: "Автомобіль",
      render: car => (
        <span className={styles.carName}>
          {car.brand} {car.model}
        </span>
      )
    },
    {
      header: "Номер",
      render: car => car.plateNumber
    },
    {
      header: "Рік",
      render: car => car.year
    },
    {
      header: "Категорія",
      render: car => car.categoryName
    },
    {
      header: "Статус",
      render: car => (
        <StatusBadge label={STATUS_LABELS[car.status]} variant={STATUS_VARIANTS[car.status]} />
      )
    }
  ];

  const hasFilters = search !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL";

  function resetFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
  }

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Автомобілі</h1>
          <p className="page-subtitle">Перегляд та управління автомобільним парком</p>
        </div>

        <Link href="/cars/new" className="button-primary">
          <span>+</span>
          Додати автомобіль
        </Link>
      </header>

      <section className={styles.filters}>
        <input
          type="search"
          className={`form-control ${styles.searchControl}`}
          placeholder="Пошук за маркою, моделлю або номером..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        <div className={styles.filterGroup}>
          <label htmlFor="car-status">Статус:</label>

          <select
            id="car-status"
            className={`form-control ${styles.selectControl}`}
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value as CarStatusFilter)}
          >
            <option value="ALL">Усі</option>
            <option value="available">Доступний</option>
            <option value="maintenance">На обслуговуванні</option>
            <option value="retired">Списаний</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="car-category">Категорія:</label>

          <select
            id="car-category"
            className={`form-control ${styles.selectControl}`}
            value={categoryFilter}
            onChange={event => setCategoryFilter(event.target.value)}
          >
            <option value="ALL">Усі</option>

            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button type="button" className="button-reset" onClick={resetFilters}>
            Скинути
          </button>
        )}
      </section>

      <DataTable
        title="Список автомобілів"
        rows={filteredCars}
        columns={columns}
        emptyMessage={
          hasFilters
            ? "За заданими параметрами автомобілів не знайдено"
            : "Автомобілі поки не додані"
        }
      />
    </main>
  );
}
