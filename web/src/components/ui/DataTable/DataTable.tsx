import styles from "./DataTable.module.css";
import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T extends { id: number | string }> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends { id: number | string }>({
  title,
  rows,
  columns,
  emptyMessage = "Записів поки немає",
  onRowClick
}: DataTableProps<T>) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className="page-title">{title}</h2>
        <span className={styles.count}>{rows.length}</span>
      </header>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.header}>{column.header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map(row => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? styles.clickableRow : undefined}
                >
                  {columns.map(column => (
                    <td key={column.header}>{column.render(row)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
