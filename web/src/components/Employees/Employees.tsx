"use client";

import styles from "./Employees.module.css";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Employee } from "@/types/employee";
import Link from "next/link";
import { useMemo, useState } from "react";

type EmployeesProps = {
  employees: Employee[];
};

export function Employees({ employees }: EmployeesProps) {
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return employees;
    }

    return employees.filter(employee => {
      const fullName = `${employee.lastName} ${employee.firstName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        employee.firstName.toLowerCase().includes(normalizedSearch) ||
        employee.lastName.toLowerCase().includes(normalizedSearch) ||
        employee.position.toLowerCase().includes(normalizedSearch) ||
        employee.phone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [employees, search]);

  const columns: Column<Employee>[] = [
    {
      header: "ПІБ",
      render: employee => (
        <span className={styles.name}>
          {employee.lastName} {employee.firstName}
        </span>
      )
    },
    {
      header: "Посада",
      render: employee => employee.position
    },
    {
      header: "Телефон",
      render: employee => employee.phone
    },
    {
      header: "Дії",
      render: () => <span className={styles.placeholder}>—</span>
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Працівники</h1>
          <p className="page-subtitle">Перегляд і пошук працівників компанії</p>
        </div>

        <Link href="/settings/employees/new" className="button-primary">
          + Додати працівника
        </Link>
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Пошук за ПІБ, посадою або телефоном..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список працівників"
        rows={filteredEmployees}
        columns={columns}
        emptyMessage={
          search ? "За вашим запитом працівників не знайдено" : "Працівників поки немає"
        }
      />
    </main>
  );
}
