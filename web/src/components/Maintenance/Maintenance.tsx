"use client";

import { RowActions } from "../RowActions/RowActions";
import { StatusBadge, StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./Maintenance.module.css";
import { deleteMaintenance } from "@/actions/maintenanceActions";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Maintenance as MaintenanceRecord, MaintenanceStatus } from "@/types/maintenance";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import Link from "next/link";

const STATUS_LABELS: Record<MaintenanceStatus, string> = {
  planned: "Заплановано",
  ongoing: "Триває",
  completed: "Завершено"
};

const STATUS_VARIANTS: Record<MaintenanceStatus, StatusBadgeVariant> = {
  planned: "info",
  ongoing: "warning",
  completed: "success"
};

type MaintenanceProps = {
  records: MaintenanceRecord[];
};

export function Maintenance({ records }: MaintenanceProps) {
  const columns: Column<MaintenanceRecord>[] = [
    {
      header: "Автомобіль",
      render: record => (
        <div className={styles.carCell}>
          <span className={styles.carName}>{record.carName}</span>
          <span className={styles.description}>{record.description}</span>
        </div>
      )
    },
    {
      header: "Початок",
      render: record => formatDate(record.startDate)
    },
    {
      header: "Завершення",
      render: record => (record.endDate ? formatDate(record.endDate) : "—")
    },
    {
      header: "Вартість",
      render: record => <span className={styles.cost}>{formatCurrency(record.cost)}</span>
    },
    {
      header: "Статус",
      render: record => (
        <StatusBadge
          label={STATUS_LABELS[record.status]}
          variant={STATUS_VARIANTS[record.status]}
        />
      )
    },
    {
      header: "Дії",
      render: record => (
        <RowActions
          id={record.id}
          editHref={`/maintenance/${record.id}/edit`}
          deleteAction={deleteMaintenance}
        />
      )
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Техобслуговування</h1>
          <p className="page-subtitle">Облік технічного обслуговування автомобілів</p>
        </div>

        <Link href="/maintenance/new" className="button-primary">
          + Додати запис
        </Link>
      </header>

      <DataTable
        title="Історія техобслуговування"
        rows={records}
        columns={columns}
        emptyMessage="Записів про техобслуговування поки немає"
      />
    </main>
  );
}
