"use client";

import styles from "./Payments.module.css";
import { deletePayment } from "@/actions/paymentActions";
import type { Column } from "@/components/ui/DataTable/DataTable";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import { RowActions } from "@/components/ui/RowActions/RowActions";
import { PAYMENT_METHOD_LABELS } from "@/constants/payment";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { Payment } from "@/types/payment";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useState } from "react";

type PaymentsProps = {
  payments: Payment[];
  search: string;
};

export function Payments({ payments, search }: PaymentsProps) {
  const { updateDebounced } = useUrlFilters();
  const [searchText, setSearchText] = useState(search);

  const columns: Column<Payment>[] = [
    {
      header: "Оренда №",
      render: payment => (
        <span className={styles.rentalNumber}>{String(payment.rentalId).padStart(3, "0")}</span>
      )
    },
    {
      header: "Клієнт",
      render: payment => payment.customerName
    },
    {
      header: "Сума",
      render: payment => <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
    },
    {
      header: "Спосіб",
      render: payment => PAYMENT_METHOD_LABELS[payment.method]
    },
    {
      header: "Дата",
      render: payment => formatDate(payment.paidAt)
    },
    {
      header: "Дії",
      render: payment => <RowActions id={payment.id} deleteAction={deletePayment} />
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
          value={searchText}
          onChange={event => {
            setSearchText(event.target.value);
            updateDebounced({ search: event.target.value.trim() });
          }}
          placeholder="Пошук за клієнтом або номером оренди..."
          className={`form-control ${styles.searchControl}`}
        />
      </div>

      <DataTable
        title="Список оплат"
        rows={payments}
        columns={columns}
        emptyMessage={search ? "За вашим запитом оплат не знайдено" : "Оплат поки немає"}
      />
    </main>
  );
}
