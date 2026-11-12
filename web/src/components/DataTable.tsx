import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T extends { id: number | string }> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
};

export function DataTable<T extends { id: number | string }>({
  title,
  rows,
  columns,
}: DataTableProps<T>) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{rows.length}</span>
      </header>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.header}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
