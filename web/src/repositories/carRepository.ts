import { query } from "@/lib/db";
import type { ICarRepository } from "@/repositories/interfaces/ICarRepository";
import type { Car, CarInput, CarStatus } from "@/types/car";
import { CarFilters } from "@/types/filters";
import { toLikePattern } from "@/utils/sql";

type CarRow = {
  car_id: number;
  brand: string;
  model: string;
  plate_number: string;
  year: number;
  status: CarStatus;
  category_id: number;
  category_name: string;
  daily_rate: string;
};

const SELECT_CAR = `
  SELECT car_id, brand, model, plate_number, year, status,
         category_id, category_name, daily_rate
  FROM car_details`;

const toCar = (row: CarRow): Car => ({
  id: row.car_id,
  brand: row.brand,
  model: row.model,
  plateNumber: row.plate_number,
  year: row.year,
  status: row.status,
  categoryId: row.category_id,
  categoryName: row.category_name,
  dailyRate: Number(row.daily_rate)
});

export class CarRepository implements ICarRepository {
  async findAll(filters: CarFilters = {}): Promise<Car[]> {
    const rows = await query<CarRow>(
      `${SELECT_CAR}
       WHERE ($1::text IS NULL OR (brand || ' ' || model) ILIKE $1 OR plate_number ILIKE $1)
         AND ($2::text IS NULL OR status = $2)
         AND ($3::int IS NULL OR category_id = $3)
       ORDER BY car_id`,
      [toLikePattern(filters.search), filters.status ?? null, filters.categoryId ?? null]
    );
    return rows.map(toCar);
  }

  async findById(id: number): Promise<Car | null> {
    const rows = await query<CarRow>(`${SELECT_CAR} WHERE car_id = $1`, [id]);
    return rows[0] ? toCar(rows[0]) : null;
  }

  async create(data: CarInput): Promise<void> {
    await query(
      `INSERT INTO cars (category_id, brand, model, plate_number, year, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.categoryId, data.brand, data.model, data.plateNumber, data.year, data.status]
    );
  }

  async update(id: number, data: CarInput): Promise<boolean> {
    const rows = await query<{ car_id: number }>(
      `UPDATE cars
       SET category_id = $1, brand = $2, model = $3, plate_number = $4, year = $5, status = $6
       WHERE car_id = $7
       RETURNING car_id`,
      [data.categoryId, data.brand, data.model, data.plateNumber, data.year, data.status, id]
    );
    return rows.length > 0;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ car_id: number }>(
      "DELETE FROM cars WHERE car_id = $1 RETURNING car_id",
      [id]
    );
    return rows.length > 0;
  }

  async findAvailable(startDate: string, endDate: string): Promise<Car[]> {
    const rows = await query<CarRow>(
      `${SELECT_CAR}
       WHERE status <> 'retired'
         AND NOT EXISTS (
             SELECT 1 FROM rentals r
             WHERE r.car_id = car_details.car_id
               AND r.status <> 'cancelled'
               AND daterange(r.start_date, r.end_date, '[]')
                   && daterange($1::date, $2::date, '[]')
         )
         AND NOT EXISTS (
             SELECT 1 FROM maintenance m
             WHERE m.car_id = car_details.car_id
               AND daterange(m.start_date, COALESCE(m.end_date, 'infinity'), '[]')
                   && daterange($1::date, $2::date, '[]')
         )
       ORDER BY brand, model, plate_number`,
      [startDate, endDate]
    );
    return rows.map(toCar);
  }
}
