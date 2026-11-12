import type { IRentalRepository } from "./interfaces/IRentalRepository";
import { query } from "@/lib/db";
import type { Rental, RentalStatus } from "@/types/rental";

type RentalRow = {
  rental_id: number;
  customer_name: string;
  car_name: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  daily_rate: string;
  status: RentalStatus;
};

const toRental = (row: RentalRow): Rental => ({
  id: row.rental_id,
  customerName: row.customer_name,
  carName: row.car_name,
  employeeName: row.employee_name,
  startDate: row.start_date,
  endDate: row.end_date,
  dailyRate: Number(row.daily_rate),
  status: row.status,
});

export class RentalRepository implements IRentalRepository {
  async findAll(): Promise<Rental[]> {
    const rows = await query<RentalRow>(
      `SELECT r.rental_id,
              cu.last_name || ' ' || cu.first_name AS customer_name,
              c.brand || ' ' || c.model AS car_name,
              e.last_name || ' ' || e.first_name AS employee_name,
              r.start_date::text AS start_date,
              r.end_date::text AS end_date,
              r.daily_rate,
              r.status
       FROM rentals r
       JOIN customers cu USING (customer_id)
       JOIN cars c USING (car_id)
       JOIN employees e USING (employee_id)
       ORDER BY r.rental_id`,
    );
    return rows.map(toRental);
  }
}
