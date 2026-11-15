import type { IDashboardRepository } from "./interfaces/IDashboardRepository";
import { query } from "@/lib/db";
import type { DashboardSummary, Debtor, OverdueRental, UpcomingRental } from "@/types/dashboard";

export class DashboardRepository implements IDashboardRepository {
  async getSummary(): Promise<DashboardSummary> {
    const rows = await query<DashboardSummary>(
      `SELECT
         (SELECT COUNT(*) FROM car_details WHERE status = 'available')::int AS "availableCars",
         (SELECT COUNT(*) FROM car_details WHERE status <> 'retired')::int AS "totalCars",
         (SELECT COUNT(*) FROM rentals WHERE status = 'active')::int AS "activeRentals",
         (SELECT COUNT(*) FROM rentals
           WHERE status = 'active' AND end_date < CURRENT_DATE)::int AS "overdueRentals",
         (SELECT COALESCE(SUM(amount), 0) FROM payments
           WHERE to_char(paid_at, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM'))::float8
           AS "monthIncome",
         (SELECT COALESCE(SUM(s.balance), 0)
            FROM rental_summary s
            JOIN rentals r USING (rental_id)
           WHERE r.status IN ('active', 'completed'))::float8 AS "totalDebt"`
    );
    return rows[0];
  }

  getOverdueRentals(): Promise<OverdueRental[]> {
    return query<OverdueRental>(
      `SELECT r.rental_id AS id,
              cu.last_name || ' ' || cu.first_name AS "customerName",
              c.brand || ' ' || c.model AS "carName",
              r.end_date::text AS "endDate",
              (CURRENT_DATE - r.end_date)::int AS "daysOverdue"
       FROM rentals r
       JOIN customers cu USING (customer_id)
       JOIN cars c USING (car_id)
       WHERE r.status = 'active' AND r.end_date < CURRENT_DATE
       ORDER BY "daysOverdue" DESC`
    );
  }

  getUpcomingReturns(): Promise<UpcomingRental[]> {
    return query<UpcomingRental>(
      `SELECT r.rental_id AS id,
              cu.last_name || ' ' || cu.first_name AS "customerName",
              c.brand || ' ' || c.model AS "carName",
              r.end_date::text AS "date"
       FROM rentals r
       JOIN customers cu USING (customer_id)
       JOIN cars c USING (car_id)
       WHERE r.status = 'active'
         AND r.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
       ORDER BY r.end_date, r.rental_id`
    );
  }

  getUpcomingPickups(): Promise<UpcomingRental[]> {
    return query<UpcomingRental>(
      `SELECT r.rental_id AS id,
              cu.last_name || ' ' || cu.first_name AS "customerName",
              c.brand || ' ' || c.model AS "carName",
              r.start_date::text AS "date"
       FROM rentals r
       JOIN customers cu USING (customer_id)
       JOIN cars c USING (car_id)
       WHERE r.status = 'booked' AND r.start_date <= CURRENT_DATE + 7
       ORDER BY r.start_date, r.rental_id`
    );
  }

  getTopDebtors(): Promise<Debtor[]> {
    return query<Debtor>(
      `SELECT cu.customer_id AS id,
              cu.last_name || ' ' || cu.first_name AS "customerName",
              cu.phone,
              COUNT(*)::int AS "rentalsCount",
              SUM(s.balance)::float8 AS debt
       FROM rental_summary s
       JOIN rentals r USING (rental_id)
       JOIN customers cu USING (customer_id)
       WHERE r.status IN ('active', 'completed') AND s.balance > 0
       GROUP BY cu.customer_id, cu.last_name, cu.first_name, cu.phone
       ORDER BY debt DESC
       LIMIT 5`
    );
  }
}
