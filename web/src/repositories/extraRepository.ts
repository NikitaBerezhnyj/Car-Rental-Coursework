import type { IExtraRepository } from "./interfaces/IExtraRepository";
import { query } from "@/lib/db";
import type { Extra } from "@/types/extra";

type ExtraRow = {
  service_id: number;
  name: string;
  daily_price: string;
};

const toExtra = (row: ExtraRow): Extra => ({
  id: row.service_id,
  name: row.name,
  dailyPrice: Number(row.daily_price),
});

export class ExtraRepository implements IExtraRepository {
  async findAll(): Promise<Extra[]> {
    const rows = await query<ExtraRow>(
      `SELECT service_id, name, daily_price
       FROM additional_services
       ORDER BY service_id`,
    );
    return rows.map(toExtra);
  }
}
