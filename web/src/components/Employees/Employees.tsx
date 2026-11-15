"use client";

import styles from "./Employees.module.css";
import { deleteEmployee } from "@/actions/employeeActions";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import { RowActions } from "@/components/RowActions/RowActions";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { Employee } from "@/types/employee";
import Link from "next/link";
import { useState } from "react";

type EmployeesProps = {
  employees: Employee[];
  search: string;
};

export function Employees({ employees, search }: EmployeesProps) {
  const { updateDebounced } = useUrlFilters();
  const [searchText, setSearchText] = useState(search);

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
      render: employee => (
        <RowActions
          id={employee.id}
          editHref={`/settings/employees/${employee.id}/edit`}
          deleteAction={deleteEmployee}
        />
      )
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
          value={searchText}
          onChange={event => {
            setSearchText(event.target.value);
            updateDebounced({ search: event.target.value.trim() });
          }}
          placeholder="Пошук за ПІБ, посадою або телефоном..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список працівників"
        rows={employees}
        columns={columns}
        emptyMessage={
          search ? "За вашим запитом працівників не знайдено" : "Працівників поки немає"
        }
      />
    </main>
  );
}
