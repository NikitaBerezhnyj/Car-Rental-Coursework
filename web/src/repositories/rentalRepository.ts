import type { IRentalRepository } from "./interfaces/IRentalRepository";
import { query, withTransaction } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { toLikePattern } from "@/utils/sql";
import { RentalFilters } from "@/types/filters";
import type { Rental, RentalInput, RentalStats, RentalStatus } from "@/types/rental";

type RentalRow = {
  rental_id: number;
  customer_name: string;
  car_name: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  daily_rate: string;
  status: RentalStatus;
  days: number;
  rental_cost: string;
  extras_cost: string;
  total_cost: string;
  paid_amount: string;
  balance: string;
};

const SELECT_RENTAL = `
  SELECT r.rental_id,
         cu.last_name || ' ' || cu.first_name AS customer_name,
         c.brand || ' ' || c.model AS car_name,
         e.last_name || ' ' || e.first_name AS employee_name,
         r.start_date::text AS start_date,
         r.end_date::text AS end_date,
         r.daily_rate,
         r.status,
         s.days, s.rental_cost, s.extras_cost, s.total_cost, s.paid_amount, s.balance
  FROM rentals r
  JOIN customers cu USING (customer_id)
  JOIN cars c USING (car_id)
  JOIN employees e USING (employee_id)
  JOIN rental_summary s USING (rental_id)`;

const toRental = (row: RentalRow): Rental => ({
  id: row.rental_id,
  customerName: row.customer_name,
  carName: row.car_name,
  employeeName: row.employee_name,
  startDate: row.start_date,
  endDate: row.end_date,
  dailyRate: Number(row.daily_rate),
  status: row.status,
  days: row.days,
  rentalCost: Number(row.rental_cost),
  extrasCost: Number(row.extras_cost),
  totalCost: Number(row.total_cost),
  paidAmount: Number(row.paid_amount),
  balance: Number(row.balance)
});

export class RentalRepository implements IRentalRepository {
  async findAll(filters: RentalFilters = {}): Promise<Rental[]> {
    const rows = await query<RentalRow>(
      `${SELECT_RENTAL}
       WHERE ($1::text IS NULL
              OR r.rental_id::text ILIKE $1
              OR (cu.last_name || ' ' || cu.first_name) ILIKE $1
              OR (cu.first_name || ' ' || cu.last_name) ILIKE $1
              OR (c.brand || ' ' || c.model) ILIKE $1)
         AND ($2::text IS NULL OR r.status = $2)
         AND ($3::date IS NULL OR r.start_date >= $3)
         AND ($4::date IS NULL OR r.start_date <= $4)
       ORDER BY r.rental_id`,
      [
        toLikePattern(filters.search),
        filters.status ?? null,
        filters.dateFrom ?? null,
        filters.dateTo ?? null
      ]
    );
    return rows.map(toRental);
  }

  async findById(id: number): Promise<Rental | null> {
    const rows = await query<RentalRow>(`${SELECT_RENTAL} WHERE r.rental_id = $1`, [id]);
    return rows[0] ? toRental(rows[0]) : null;
  }

  async countByStatus(): Promise<RentalStats> {
    const rows = await query<{ status: RentalStatus; count: number }>(
      "SELECT status, COUNT(*)::int AS count FROM rentals GROUP BY status"
    );

    const stats: RentalStats = { booked: 0, active: 0, completed: 0, cancelled: 0 };
    for (const row of rows) stats[row.status] = row.count;

    return stats;
  }

  async create(data: RentalInput): Promise<number> {
    return withTransaction(async run => {
      const rentals = await run<{ rental_id: number }>(
        `INSERT INTO rentals (customer_id, car_id, employee_id, start_date, end_date, daily_rate)
         SELECT $1, c.car_id, $3, $4, $5, cat.daily_rate
         FROM cars c
         JOIN car_categories cat USING (category_id)
         WHERE c.car_id = $2
         RETURNING rental_id`,
        [data.customerId, data.carId, data.employeeId, data.startDate, data.endDate]
      );

      if (!rentals[0]) throw new AppError("Автомобіль не знайдено", "NOT_FOUND");
      const rentalId = rentals[0].rental_id;

      if (data.extraIds.length > 0) {
        const extras = await run(
          `INSERT INTO rental_services (rental_id, service_id, price)
           SELECT $1, s.service_id, s.daily_price
           FROM additional_services s
           WHERE s.service_id = ANY($2::int[])
           RETURNING service_id`,
          [rentalId, data.extraIds]
        );

        if (extras.length !== data.extraIds.length) {
          throw new AppError("Одну з додаткових послуг не знайдено", "VALIDATION");
        }
      }

      return rentalId;
    });
  }

  async updateStatus(id: number, status: RentalStatus): Promise<boolean> {
    const rows = await query<{ rental_id: number }>(
      "UPDATE rentals SET status = $1 WHERE rental_id = $2 RETURNING rental_id",
      [status, id]
    );
    return rows.length > 0;
  }
}
