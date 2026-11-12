// maintenanceService.ts
import type { IMaintenanceRepository } from "@/repositories/interfaces/IMaintenanceRepository";
import type { Maintenance } from "@/types/maintenance";

export class MaintenanceService {
  constructor(private readonly maintenance: IMaintenanceRepository) {}

  list(): Promise<Maintenance[]> {
    return this.maintenance.findAll();
  }
}
