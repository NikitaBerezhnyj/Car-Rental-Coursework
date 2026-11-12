import { StatusBadge, type StatusBadgeVariant } from "../StatusBadge/StatusBadge";
import styles from "./RentalDetails.module.css";
import type { Rental, RentalStatus } from "@/types/rental";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import type { ReactNode } from "react";

const STATUS_LABELS: Record<RentalStatus, string> = {
  booked: "Зарезервована",
  active: "Активна",
  completed: "Завершена",
  cancelled: "Скасована"
};

const STATUS_VARIANTS: Record<RentalStatus, StatusBadgeVariant> = {
  booked: "info",
  active: "success",
  completed: "neutral",
  cancelled: "danger"
};

function formatPrice(value: number): string {
  return `${value.toLocaleString("uk-UA")} грн`;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

export function RentalDetails({ rental }: { rental: Rental }) {
  return (
    <main className="page-container">
      <nav className={styles.breadcrumbs}>
        <Link href="/rentals">Оренди</Link>
        <span>/</span>
        <span>#{rental.id}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.titleRow}>
            <h1 className="page-title">Оренда #{rental.id}</h1>

            <StatusBadge
              label={STATUS_LABELS[rental.status]}
              variant={STATUS_VARIANTS[rental.status]}
            />
          </div>

          <p className="page-subtitle">Детальна інформація про оренду автомобіля</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} disabled>
            Редагувати
          </button>

          <button className={styles.dangerButton} disabled>
            Скасувати оренду
          </button>
        </div>
      </header>

      <Section title="Інформація про оренду">
        <div className={styles.detailsGrid}>
          <DetailItem label="Клієнт" value={rental.customerName} />

          <DetailItem label="Автомобіль" value={rental.carName} />

          <DetailItem label="Працівник" value={rental.employeeName} />

          <DetailItem label="Дата початку" value={formatDate(rental.startDate)} />

          <DetailItem label="Дата завершення" value={formatDate(rental.endDate)} />

          <DetailItem label="Вартість за день" value={`${formatPrice(rental.dailyRate)} / день`} />
        </div>
      </Section>

      <Section title="Додаткові послуги">
        <div className={styles.emptyState}>
          <p>Додаткові послуги поки не завантажуються.</p>
          <span>Тут відображатимуться послуги, додані до цієї оренди.</span>
        </div>
      </Section>

      <Section title="Оплата">
        <div className={styles.paymentSummary}>
          <div className={styles.paymentRow}>
            <span>Загальна вартість</span>
            <strong>—</strong>
          </div>

          <div className={styles.paymentRow}>
            <span>Сплачено</span>
            <strong>—</strong>
          </div>

          <div className={`${styles.paymentRow} ${styles.balanceRow}`}>
            <span>Залишок до сплати</span>
            <strong>—</strong>
          </div>
        </div>

        <div className={styles.sectionActions}>
          <button className={styles.primaryButton} disabled>
            + Зареєструвати оплату
          </button>
        </div>

        <p className={styles.note}>
          Інформація про платежі буде доступна після підключення відповідних даних.
        </p>
      </Section>

      <Section title="Дії з автомобілем">
        <div className={styles.vehicleActions}>
          <div className={styles.actionDescription}>
            <strong>Видача автомобіля</strong>
            <span>Підтвердження передачі автомобіля клієнту.</span>
          </div>

          <button className={styles.secondaryButton} disabled>
            Видати автомобіль
          </button>
        </div>

        <div className={styles.vehicleActions}>
          <div className={styles.actionDescription}>
            <strong>Повернення автомобіля</strong>
            <span>Реєстрація повернення автомобіля після завершення оренди.</span>
          </div>

          <button className={styles.secondaryButton} disabled>
            Зареєструвати повернення
          </button>
        </div>
      </Section>

      <footer className={styles.footer}>
        <Link href="/rentals" className={styles.backButton}>
          ← Повернутися до оренд
        </Link>
      </footer>
    </main>
  );
}
