import type { IMaintenanceRepository } from "./interfaces/IMaintenanceRepository";
import { query } from "@/lib/db";
import type { Maintenance } from "@/types/maintenance";

type MaintenanceRow = {
  maintenance_id: number;
  car_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
  cost: string;
};

const toMaintenance = (row: MaintenanceRow): Maintenance => ({
  id: row.maintenance_id,
  carName: row.car_name,
  startDate: row.start_date,
  endDate: row.end_date,
  description: row.description,
  cost: Number(row.cost),
});

export class MaintenanceRepository implements IMaintenanceRepository {
  async findAll(): Promise<Maintenance[]> {
    const rows = await query<MaintenanceRow>(
      `SELECT m.maintenance_id,
              c.brand || ' ' || c.model AS car_name,
              m.start_date::text AS start_date,
              m.end_date::text AS end_date,
              m.description,
              m.cost
       FROM maintenance m
       JOIN cars c USING (car_id)
       ORDER BY m.maintenance_id`,
    );
    return rows.map(toMaintenance);
  }
}
