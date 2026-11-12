import { query } from "@/lib/db";
import type { Car, CarStatus } from "@/types/car";
import type { ICarRepository } from "@/repositories/interfaces/ICarRepository";

type CarRow = {
  car_id: number;
  brand: string;
  model: string;
  plate_number: string;
  year: number;
  status: CarStatus;
  category_name: string;
  daily_rate: string; // NUMERIC у pg повертається рядком
};

const toCar = (row: CarRow): Car => ({
  id: row.car_id,
  brand: row.brand,
  model: row.model,
  plateNumber: row.plate_number,
  year: row.year,
  status: row.status,
  categoryName: row.category_name,
  dailyRate: Number(row.daily_rate),
});

export class CarRepository implements ICarRepository {
  async findAll(): Promise<Car[]> {
    const rows = await query<CarRow>(
      `SELECT c.car_id, c.brand, c.model, c.plate_number, c.year, c.status,
              cat.name AS category_name, cat.daily_rate
       FROM cars c
       JOIN car_categories cat USING (category_id)
       ORDER BY c.car_id`,
    );
    return rows.map(toCar);
  }
}
