import styles from "./CarCategories.module.css";
import type { Column } from "@/components/DataTable/DataTable";
import { DataTable } from "@/components/DataTable/DataTable";
import type { CarCategory } from "@/types/carCategory";
import Link from "next/link";

type CarCategoriesProps = {
  categories: CarCategory[];
};

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 2
});

export function CarCategories({ categories }: CarCategoriesProps) {
  const columns: Column<CarCategory>[] = [
    {
      header: "Назва",
      render: category => <span className={styles.name}>{category.name}</span>
    },
    {
      header: "Тариф за добу",
      render: category => (
        <span className={styles.rate}>{currencyFormatter.format(category.dailyRate)}</span>
      )
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
          <h1 className="page-title">Категорії автомобілів</h1>
          <p className="page-subtitle">Керування категоріями та тарифами оренди</p>
        </div>

        <Link href="/settings/categories/new" className="button-primary">
          + Додати категорію
        </Link>
      </header>

      <DataTable
        title="Список категорій"
        rows={categories}
        columns={columns}
        emptyMessage="Категорій автомобілів поки немає"
      />
    </main>
  );
}
