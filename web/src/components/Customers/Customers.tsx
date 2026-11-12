"use client";

import styles from "./Customers.module.css";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Customer } from "@/types/customer";
import Link from "next/link";
import { useMemo, useState } from "react";

type CustomersProps = {
  customers: Customer[];
};

export function Customers({ customers }: CustomersProps) {
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        customer.firstName.toLowerCase().includes(normalizedSearch) ||
        customer.lastName.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [customers, search]);

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
      render: () => <span className={styles.placeholder}>—</span>
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
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Пошук за ПІБ або телефоном..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список клієнтів"
        rows={filteredCustomers}
        columns={columns}
        emptyMessage={search ? "За вашим запитом клієнтів не знайдено" : "Клієнтів поки немає"}
      />
    </main>
  );
}
