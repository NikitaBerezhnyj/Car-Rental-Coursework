"use client";

import styles from "./Customers.module.css";
import { deleteCustomer } from "@/actions/customerActions";
import type { Column } from "@/components/ui/DataTable/DataTable";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import { RowActions } from "@/components/ui/RowActions/RowActions";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { Customer } from "@/types/customer";
import Link from "next/link";
import { useState } from "react";

type CustomersProps = {
  customers: Customer[];
  search: string;
};

export function Customers({ customers, search }: CustomersProps) {
  const { updateDebounced } = useUrlFilters();
  const [searchText, setSearchText] = useState(search);

  const columns: Column<Customer>[] = [
    {
      header: "ПІБ",
      render: customer => (
        <span className={styles.name}>
          {customer.lastName} {customer.firstName}
        </span>
      )
    },
    {
      header: "Телефон",
      render: customer => customer.phone
    },
    {
      header: "Email",
      render: customer => customer.email || "—"
    },
    {
      header: "Дії",
      render: customer => (
        <RowActions
          id={customer.id}
          editHref={`/customers/${customer.id}/edit`}
          deleteAction={deleteCustomer}
        />
      )
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Клієнти</h1>
          <p className="page-subtitle">Перегляд і пошук клієнтів компанії</p>
        </div>

        <Link href="/customers/new" className="button-primary">
          + Додати клієнта
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
          placeholder="Пошук за ПІБ або телефоном..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список клієнтів"
        rows={customers}
        columns={columns}
        emptyMessage={search ? "За вашим запитом клієнтів не знайдено" : "Клієнтів поки немає"}
      />
    </main>
  );
}
