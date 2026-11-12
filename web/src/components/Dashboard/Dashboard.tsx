import { StatCard } from "../StatCard/StatCard";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./Dashboard.module.css";
import { DataTable } from "@/components/DataTable/DataTable";
import type { Car } from "@/types/car";
import type { Rental } from "@/types/rental";
import { formatDate, getToday, parseDate } from "@/utils/date";
import Link from "next/link";

function isActiveRental(rental: Rental): boolean {
  return rental.status === "active";
}

function isAvailableCar(car: Car): boolean {
  return car.status === "available";
}

function isOverdue(rental: Rental): boolean {
  return isActiveRental(rental) && parseDate(rental.endDate) < getToday();
}

export default function Dashboard({ cars, rentals }: { cars: Car[]; rentals: Rental[] }) {
  const activeRentals = rentals.filter(isActiveRental);
  const overdueRentals = activeRentals.filter(isOverdue);

  const availableCars = cars.filter(isAvailableCar);

  const attentionRentals = [...activeRentals]
    .sort((a, b) => {
      return (
        Number(isOverdue(b)) - Number(isOverdue(a)) ||
        parseDate(a.endDate).getTime() - parseDate(b.endDate).getTime()
      );
    })
    .slice(0, 10);

  return (
    <main className="page-container">
      <header className={styles.header}>
        <h1 className="page-title">Головна</h1>
        <p className="page-subtitle">Огляд роботи пункту прокату</p>
      </header>

      <section className={styles.stats}>
        <StatCard title="Автомобілі" value={cars.length} description="Усього в автопарку" />
        <StatCard title="Доступні" value={availableCars.length} description="Готові до оренди" />
        <StatCard
          title="Активні оренди"
          value={activeRentals.length}
          description="Автомобілі зараз в оренді"
        />
        <StatCard
          title="Прострочені"
          value={overdueRentals.length}
          description="Потребують уваги"
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Оренди, які потребують уваги</h2>

            <p className={styles.sectionDescription}>
              Поточні оренди та автомобілі, які потрібно повернути
            </p>
          </div>

          <Link href="/rentals/new" className="button-primary">
            <span>+</span>
            Нова оренда
          </Link>
        </div>

        <div className={styles.tableWrapper}>
          <DataTable
            title="Активні оренди"
            rows={attentionRentals}
            columns={[
              {
                header: "Клієнт",
                render: rental => rental.customerName
              },
              {
                header: "Автомобіль",
                render: rental => rental.carName
              },
              {
                header: "Дата повернення",
                render: rental => formatDate(rental.endDate)
              },
              {
                header: "Статус",
                render: rental => (
                  <StatusBadge
                    label={isOverdue(rental) ? "Прострочена" : "Активна"}
                    variant={isOverdue(rental) ? "danger" : "success"}
                  />
                )
              }
            ]}
            emptyMessage="Немає активних оренд"
          />
        </div>

        <div className={styles.tableFooter}>
          <Link href="/rentals" className={styles.viewAll}>
            Переглянути всі оренди →
          </Link>
        </div>
      </section>
    </main>
  );
}
