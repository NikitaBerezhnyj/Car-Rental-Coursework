// carCategoryRepository.ts
import { query } from "@/lib/db";
import type { CarCategory } from "@/types/carCategory";
import type { ICarCategoryRepository } from "./interfaces/ICarCategoryRepository";

type CarCategoryRow = {
  category_id: number;
  name: string;
  daily_rate: string;
};

const toCarCategory = (row: CarCategoryRow): CarCategory => ({
  id: row.category_id,
  name: row.name,
  dailyRate: Number(row.daily_rate),
});

export class CarCategoryRepository implements ICarCategoryRepository {
  async findAll(): Promise<CarCategory[]> {
    const rows = await query<CarCategoryRow>(
      `SELECT category_id, name, daily_rate
       FROM car_categories
       ORDER BY category_id`,
    );
    return rows.map(toCarCategory);
  }
}
