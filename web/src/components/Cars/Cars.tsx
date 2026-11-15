"use client";

import { StatusBadge, type StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./Cars.module.css";
import { deleteCar } from "@/actions/carActions";
import { type Column, DataTable } from "@/components/DataTable/DataTable";
import { RowActions } from "@/components/RowActions/RowActions";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { Car, CarStatus } from "@/types/car";
import type { CarCategory } from "@/types/carCategory";
import type { CarFilters } from "@/types/filters";
import Link from "next/link";
import { useState } from "react";

const STATUS_LABELS: Record<CarStatus, string> = {
  available: "Доступний",
  rented: "В оренді",
  maintenance: "На обслуговуванні",
  retired: "Списаний"
};

const STATUS_VARIANTS: Record<CarStatus, StatusBadgeVariant> = {
  available: "success",
  rented: "info",
  maintenance: "warning",
  retired: "neutral"
};

type CarsProps = {
  cars: Car[];
  categories: CarCategory[];
  filters: CarFilters;
};

export function Cars({ cars, categories, filters }: CarsProps) {
  const { update, updateDebounced } = useUrlFilters();

  const [search, setSearch] = useState<string>(filters.search ?? "");
  const [status, setStatus] = useState<string>(filters.status ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    filters.categoryId ? String(filters.categoryId) : ""
  );

  const hasFilters = search !== "" || status !== "" || categoryId !== "";

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
    },
    {
      header: "Дії",
      render: car => (
        <RowActions id={car.id} editHref={`/cars/${car.id}/edit`} deleteAction={deleteCar} />
      )
    }
  ];

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
          onChange={event => {
            setSearch(event.target.value);
            updateDebounced({ search: event.target.value.trim() });
          }}
        />

        <div className={styles.filterGroup}>
          <label htmlFor="car-status">Статус:</label>

          <select
            id="car-status"
            className={`form-control ${styles.selectControl}`}
            value={status}
            onChange={event => {
              setStatus(event.target.value);
              update({ status: event.target.value });
            }}
          >
            <option value="">Усі</option>
            <option value="available">Доступний</option>
            <option value="rented">В оренді</option>
            <option value="maintenance">На обслуговуванні</option>
            <option value="retired">Списаний</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="car-category">Категорія:</label>

          <select
            id="car-category"
            className={`form-control ${styles.selectControl}`}
            value={categoryId}
            onChange={event => {
              setCategoryId(event.target.value);
              update({ categoryId: event.target.value });
            }}
          >
            <option value="">Усі</option>

            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <DataTable
        title="Список автомобілів"
        rows={cars}
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
