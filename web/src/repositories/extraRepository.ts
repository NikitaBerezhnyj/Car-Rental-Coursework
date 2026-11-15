import type { IExtraRepository } from "./interfaces/IExtraRepository";
import { query } from "@/lib/db";
import type { Extra, ExtraInput } from "@/types/extra";

type ExtraRow = {
  service_id: number;
  name: string;
  daily_price: string;
};

const COLUMNS = "service_id, name, daily_price";

const toExtra = (row: ExtraRow): Extra => ({
  id: row.service_id,
  name: row.name,
  dailyPrice: Number(row.daily_price)
});

export class ExtraRepository implements IExtraRepository {
  async findAll(): Promise<Extra[]> {
    const rows = await query<ExtraRow>(
      `SELECT ${COLUMNS} FROM additional_services ORDER BY service_id`
    );
    return rows.map(toExtra);
  }

  async findById(id: number): Promise<Extra | null> {
    const rows = await query<ExtraRow>(
      `SELECT ${COLUMNS} FROM additional_services WHERE service_id = $1`,
      [id]
    );
    return rows[0] ? toExtra(rows[0]) : null;
  }

  async create(data: ExtraInput): Promise<Extra> {
    const rows = await query<ExtraRow>(
      `INSERT INTO additional_services (name, daily_price)
       VALUES ($1, $2)
       RETURNING ${COLUMNS}`,
      [data.name, data.dailyPrice]
    );
    return toExtra(rows[0]);
  }

  async update(id: number, data: ExtraInput): Promise<Extra | null> {
    const rows = await query<ExtraRow>(
      `UPDATE additional_services
       SET name = $1, daily_price = $2
       WHERE service_id = $3
       RETURNING ${COLUMNS}`,
      [data.name, data.dailyPrice, id]
    );
    return rows[0] ? toExtra(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ service_id: number }>(
      "DELETE FROM additional_services WHERE service_id = $1 RETURNING service_id",
      [id]
    );
    return rows.length > 0;
  }
}
