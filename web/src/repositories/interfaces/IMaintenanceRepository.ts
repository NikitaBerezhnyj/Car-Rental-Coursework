// IMaintenanceRepository.ts
import type { Maintenance } from "@/types/maintenance";

export interface IMaintenanceRepository {
  findAll(): Promise<Maintenance[]>;
}
