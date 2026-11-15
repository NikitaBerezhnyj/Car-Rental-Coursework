import type { ICarCategoryRepository } from "./interfaces/ICarCategoryRepository";
import { query } from "@/lib/db";
import type { CarCategory, CarCategoryInput } from "@/types/carCategory";

type CarCategoryRow = {
  category_id: number;
  name: string;
  daily_rate: string;
};

const COLUMNS = "category_id, name, daily_rate";

const toCarCategory = (row: CarCategoryRow): CarCategory => ({
  id: row.category_id,
  name: row.name,
  dailyRate: Number(row.daily_rate)
});

export class CarCategoryRepository implements ICarCategoryRepository {
  async findAll(): Promise<CarCategory[]> {
    const rows = await query<CarCategoryRow>(
      `SELECT ${COLUMNS} FROM car_categories ORDER BY category_id`
    );
    return rows.map(toCarCategory);
  }

  async findById(id: number): Promise<CarCategory | null> {
    const rows = await query<CarCategoryRow>(
      `SELECT ${COLUMNS} FROM car_categories WHERE category_id = $1`,
      [id]
    );
    return rows[0] ? toCarCategory(rows[0]) : null;
  }

  async create(data: CarCategoryInput): Promise<CarCategory> {
    const rows = await query<CarCategoryRow>(
      `INSERT INTO car_categories (name, daily_rate)
       VALUES ($1, $2)
       RETURNING ${COLUMNS}`,
      [data.name, data.dailyRate]
    );
    return toCarCategory(rows[0]);
  }

  async update(id: number, data: CarCategoryInput): Promise<CarCategory | null> {
    const rows = await query<CarCategoryRow>(
      `UPDATE car_categories
       SET name = $1, daily_rate = $2
       WHERE category_id = $3
       RETURNING ${COLUMNS}`,
      [data.name, data.dailyRate, id]
    );
    return rows[0] ? toCarCategory(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ category_id: number }>(
      "DELETE FROM car_categories WHERE category_id = $1 RETURNING category_id",
      [id]
    );
    return rows.length > 0;
  }
}
