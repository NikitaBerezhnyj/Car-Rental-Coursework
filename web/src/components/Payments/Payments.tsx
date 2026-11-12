"use client";

import styles from "./Payments.module.css";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Payment, PaymentMethod } from "@/types/payment";
import type { Rental } from "@/types/rental";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useMemo, useState } from "react";

type PaymentsProps = {
  payments: Payment[];
  rentals: Rental[];
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Готівка",
  card: "Картка"
};

export function Payments({ payments, rentals }: PaymentsProps) {
  const [search, setSearch] = useState("");

  const rentalsById = useMemo(() => new Map(rentals.map(rental => [rental.id, rental])), [rentals]);

  const filteredPayments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return payments;
    }

    return payments.filter(payment => {
      const rental = rentalsById.get(payment.rentalId);
      const customerName = rental?.customerName ?? "";
      const rentalNumber = String(payment.rentalId);

      return (
        rentalNumber.includes(normalizedSearch) ||
        customerName.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [payments, rentalsById, search]);

  const columns: Column<Payment>[] = [
    {
      header: "Оренда №",
      render: payment => (
        <span className={styles.rentalNumber}>{String(payment.rentalId).padStart(3, "0")}</span>
      )
    },
    {
      header: "Клієнт",
      render: payment => rentalsById.get(payment.rentalId)?.customerName ?? "—"
    },
    {
      header: "Сума",
      render: payment => <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
    },
    {
      header: "Спосіб",
      render: payment => METHOD_LABELS[payment.method]
    },
    {
      header: "Дата",
      render: payment => formatDate(payment.paidAt)
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Оплати</h1>
          <p className="page-subtitle">Перегляд зареєстрованих оплат за орендами</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Пошук за клієнтом або номером оренди..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список оплат"
        rows={filteredPayments}
        columns={columns}
        emptyMessage={search ? "За вашим запитом оплат не знайдено" : "Оплат поки немає"}
      />
    </main>
  );
}
