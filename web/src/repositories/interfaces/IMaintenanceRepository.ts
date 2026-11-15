import type { Maintenance, MaintenanceInput } from "@/types/maintenance";

export interface IMaintenanceRepository {
  findAll(): Promise<Maintenance[]>;
  findById(id: number): Promise<Maintenance | null>;
  create(data: MaintenanceInput): Promise<void>;
  update(id: number, data: MaintenanceInput): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
