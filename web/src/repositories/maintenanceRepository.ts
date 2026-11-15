import type { IMaintenanceRepository } from "./interfaces/IMaintenanceRepository";
import { query } from "@/lib/db";
import type { Maintenance, MaintenanceInput, MaintenanceStatus } from "@/types/maintenance";

type MaintenanceRow = {
  maintenance_id: number;
  car_id: number;
  car_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
  cost: string;
  status: MaintenanceStatus;
};

const SELECT_MAINTENANCE = `
  SELECT m.maintenance_id, m.car_id,
         c.brand || ' ' || c.model AS car_name,
         m.start_date::text AS start_date,
         m.end_date::text AS end_date,
         m.description, m.cost,
         CASE
             WHEN m.start_date > CURRENT_DATE THEN 'planned'
             WHEN m.end_date IS NULL OR m.end_date >= CURRENT_DATE THEN 'ongoing'
             ELSE 'completed'
         END AS status
  FROM maintenance m
  JOIN cars c USING (car_id)`;

const toMaintenance = (row: MaintenanceRow): Maintenance => ({
  id: row.maintenance_id,
  carId: row.car_id,
  carName: row.car_name,
  startDate: row.start_date,
  endDate: row.end_date,
  description: row.description,
  cost: Number(row.cost),
  status: row.status
});

export class MaintenanceRepository implements IMaintenanceRepository {
  async findAll(): Promise<Maintenance[]> {
    const rows = await query<MaintenanceRow>(
      `${SELECT_MAINTENANCE} ORDER BY m.start_date DESC, m.maintenance_id DESC`
    );
    return rows.map(toMaintenance);
  }

  async findById(id: number): Promise<Maintenance | null> {
    const rows = await query<MaintenanceRow>(`${SELECT_MAINTENANCE} WHERE m.maintenance_id = $1`, [
      id
    ]);
    return rows[0] ? toMaintenance(rows[0]) : null;
  }

  async create(data: MaintenanceInput): Promise<void> {
    await query(
      `INSERT INTO maintenance (car_id, start_date, end_date, description, cost)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.carId, data.startDate, data.endDate, data.description, data.cost]
    );
  }

  async update(id: number, data: MaintenanceInput): Promise<boolean> {
    const rows = await query<{ maintenance_id: number }>(
      `UPDATE maintenance
       SET car_id = $1, start_date = $2, end_date = $3, description = $4, cost = $5
       WHERE maintenance_id = $6
       RETURNING maintenance_id`,
      [data.carId, data.startDate, data.endDate, data.description, data.cost, id]
    );
    return rows.length > 0;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ maintenance_id: number }>(
      "DELETE FROM maintenance WHERE maintenance_id = $1 RETURNING maintenance_id",
      [id]
    );
    return rows.length > 0;
  }
}
