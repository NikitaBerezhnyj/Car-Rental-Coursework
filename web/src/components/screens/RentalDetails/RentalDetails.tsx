import { ActionButton } from "../../ui/ActionButton/ActionButton";
import { StatusBadge, type StatusBadgeVariant } from "../../ui/StatusBadge/StatusBadge";
import styles from "./RentalDetails.module.css";
import { cancelRental, issueRental, returnRental } from "@/actions/rentalActions";
import type { RentalStatus, RentalWithExtras } from "@/types/rental";
import { formatCurrency } from "@/utils/currency";
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

export function RentalDetails({ rental }: { rental: RentalWithExtras }) {
  const canRegisterPayment = rental.status !== "cancelled" && rental.balance > 0;

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
          <ActionButton
            id={rental.id}
            label="Скасувати оренду"
            className={styles.dangerButton}
            action={cancelRental}
            confirmMessage="Скасувати оренду?"
            disabled={rental.status !== "booked"}
          />
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
        {rental.extras.length > 0 ? (
          <div className={styles.paymentSummary}>
            {rental.extras.map(extra => (
              <div key={extra.id} className={styles.paymentRow}>
                <span>{extra.extraName}</span>
                <strong>{formatCurrency(extra.price)} / доба</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Додаткових послуг немає</p>
          </div>
        )}
      </Section>

      <Section title="Оплата">
        <div className={styles.paymentSummary}>
          <div className={styles.paymentRow}>
            <span>Оренда ({rental.days} дн.)</span>
            <strong>{formatCurrency(rental.rentalCost)}</strong>
          </div>

          <div className={styles.paymentRow}>
            <span>Додаткові послуги</span>
            <strong>{formatCurrency(rental.extrasCost)}</strong>
          </div>

          <div className={styles.paymentRow}>
            <span>Загальна вартість</span>
            <strong>{formatCurrency(rental.totalCost)}</strong>
          </div>

          <div className={styles.paymentRow}>
            <span>Сплачено</span>
            <strong>{formatCurrency(rental.paidAmount)}</strong>
          </div>

          <div className={`${styles.paymentRow} ${styles.balanceRow}`}>
            <span>Залишок до сплати</span>
            <strong>{formatCurrency(rental.balance)}</strong>
          </div>
        </div>

        <div className={styles.sectionActions}>
          {canRegisterPayment ? (
            <Link href={`/rentals/${rental.id}/payments/new`} className={styles.primaryButton}>
              + Зареєструвати оплату
            </Link>
          ) : (
            <button className={styles.primaryButton} disabled>
              + Зареєструвати оплату
            </button>
          )}
        </div>
      </Section>

      <Section title="Дії з автомобілем">
        <div className={styles.vehicleActions}>
          <div className={styles.actionDescription}>
            <strong>Видача автомобіля</strong>
            <span>Підтвердження передачі автомобіля клієнту.</span>
          </div>

          <ActionButton
            id={rental.id}
            label="Видати автомобіль"
            className={styles.secondaryButton}
            action={issueRental}
            confirmMessage="Видати автомобіль клієнту?"
            disabled={rental.status !== "booked"}
          />
        </div>

        <div className={styles.vehicleActions}>
          <div className={styles.actionDescription}>
            <strong>Повернення автомобіля</strong>
            <span>Реєстрація повернення автомобіля після завершення оренди.</span>
          </div>

          <ActionButton
            id={rental.id}
            label="Зареєструвати повернення"
            className={styles.secondaryButton}
            action={returnRental}
            confirmMessage="Підтвердити повернення автомобіля?"
            disabled={rental.status !== "active"}
          />
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
