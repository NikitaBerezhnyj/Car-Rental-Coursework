import { RowActions } from "../RowActions/RowActions";
import styles from "./Extras.module.css";
import { deleteExtra } from "@/actions/extraActions";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Extra } from "@/types/extra";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";

type ExtrasProps = {
  extras: Extra[];
};

export function Extras({ extras }: ExtrasProps) {
  const columns: Column<Extra>[] = [
    {
      header: "Назва",
      render: extra => <span className={styles.name}>{extra.name}</span>
    },
    {
      header: "Ціна за добу",
      render: extra => <span className={styles.price}>{formatCurrency(extra.dailyPrice)}</span>
    },
    {
      header: "Дії",
      render: extra => (
        <RowActions
          id={extra.id}
          editHref={`/extras/${extra.id}/edit`}
          deleteAction={deleteExtra}
        />
      )
    }
  ];

  return (
    <main className="page-container">
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Додаткові послуги</h1>
          <p className="page-subtitle">Перелік послуг, доступних під час оформлення оренди</p>
        </div>

        <Link href="/extras/new" className="button-primary">
          + Додати послугу
        </Link>
      </header>

      <DataTable
        title="Список послуг"
        rows={extras}
        columns={columns}
        emptyMessage="Додаткових послуг поки немає"
      />
    </main>
  );
}
