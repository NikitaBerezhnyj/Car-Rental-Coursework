import type { IReportRepository } from "./interfaces/IReportRepository";
import { query } from "@/lib/db";
import type {
  CarProfit,
  CategoryStats,
  Debtor,
  EmployeeStats,
  FrequentCustomer,
  MonthlyIncome,
  OverdueRental
} from "@/types/report";

export class ReportRepository implements IReportRepository {
  // 1. Надходження оплат за місяцями: групування за датою
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

  // 2. Популярність категорій: LEFT JOIN чотирьох таблиць, щоб категорії без оренд теж були у звіті
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

  // 3. Клієнти із заборгованістю: представлення rental_summary і агрегація боргу
  getDebtors(): Promise<Debtor[]> {
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
       ORDER BY debt DESC`
    );
  }

  // 4. Прострочені оренди: арифметика з датами
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

  // 5. Постійні клієнти (від двох оренд): HAVING і COUNT(DISTINCT)
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

  // 6. Прибутковість автомобілів: виручка мінус витрати на обслуговування (підзапити у FROM)
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

  // 7. Робота працівників: оформлені оренди та їх сума
  getEmployeeStats(): Promise<EmployeeStats[]> {
    return query<EmployeeStats>(
      `SELECT e.employee_id AS id,
              e.last_name || ' ' || e.first_name AS "employeeName",
              e.position,
              COUNT(r.rental_id)::int AS "rentalsCount",
              COALESCE(SUM(s.total_cost), 0)::float8 AS revenue
       FROM employees e
       LEFT JOIN rentals r ON r.employee_id = e.employee_id AND r.status <> 'cancelled'
       LEFT JOIN rental_summary s ON s.rental_id = r.rental_id
       GROUP BY e.employee_id, e.last_name, e.first_name, e.position
       ORDER BY revenue DESC`
    );
  }
}
