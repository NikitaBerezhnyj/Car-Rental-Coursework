import type { IReportRepository } from "./interfaces/IReportRepository";
import { query } from "@/lib/db";
import type { CarProfit, CategoryStats, FrequentCustomer, MonthlyIncome } from "@/types/report";

export class ReportRepository implements IReportRepository {
  getMonthlyIncome(): Promise<MonthlyIncome[]> {
    return query<MonthlyIncome>(
      `SELECT to_char(date_trunc('month', paid_at), 'YYYY-MM') AS id,
              to_char(date_trunc('month', paid_at), 'MM.YYYY') AS month,
              COUNT(*)::int AS "paymentsCount",
              SUM(amount)::float8 AS total
       FROM payments
       GROUP BY date_trunc('month', paid_at)
       ORDER BY date_trunc('month', paid_at) DESC`
    );
  }

  getCategoryStats(): Promise<CategoryStats[]> {
    return query<CategoryStats>(
      `SELECT cat.category_id AS id,
              cat.name,
              COUNT(r.rental_id)::int AS "rentalsCount",
              COALESCE(SUM(s.total_cost), 0)::float8 AS revenue
       FROM car_categories cat
       LEFT JOIN cars c ON c.category_id = cat.category_id
       LEFT JOIN rentals r ON r.car_id = c.car_id AND r.status IN ('active', 'completed')
       LEFT JOIN rental_summary s ON s.rental_id = r.rental_id
       GROUP BY cat.category_id, cat.name
       ORDER BY "rentalsCount" DESC, revenue DESC`
    );
  }

  getFrequentCustomers(): Promise<FrequentCustomer[]> {
    return query<FrequentCustomer>(
      `SELECT cu.customer_id AS id,
              cu.last_name || ' ' || cu.first_name AS "customerName",
              COUNT(DISTINCT r.rental_id)::int AS "rentalsCount",
              COALESCE(SUM(p.amount), 0)::float8 AS "totalPaid"
       FROM customers cu
       JOIN rentals r ON r.customer_id = cu.customer_id AND r.status <> 'cancelled'
       LEFT JOIN payments p ON p.rental_id = r.rental_id
       GROUP BY cu.customer_id, cu.last_name, cu.first_name
       HAVING COUNT(DISTINCT r.rental_id) >= 2
       ORDER BY "totalPaid" DESC`
    );
  }

  getCarProfits(): Promise<CarProfit[]> {
    return query<CarProfit>(
      `SELECT c.car_id AS id,
              c.brand || ' ' || c.model AS "carName",
              c.plate_number AS "plateNumber",
              COALESCE(rev.rentals_count, 0)::int AS "rentalsCount",
              COALESCE(rev.revenue, 0)::float8 AS revenue,
              COALESCE(mnt.cost, 0)::float8 AS "maintenanceCost",
              (COALESCE(rev.revenue, 0) - COALESCE(mnt.cost, 0))::float8 AS profit
       FROM cars c
       LEFT JOIN (
           SELECT r.car_id, COUNT(*) AS rentals_count, SUM(s.total_cost) AS revenue
           FROM rentals r
           JOIN rental_summary s USING (rental_id)
           WHERE r.status IN ('active', 'completed')
           GROUP BY r.car_id
       ) rev ON rev.car_id = c.car_id
       LEFT JOIN (
           SELECT car_id, SUM(cost) AS cost
           FROM maintenance
           GROUP BY car_id
       ) mnt ON mnt.car_id = c.car_id
       ORDER BY profit DESC, "carName"`
    );
  }
}
