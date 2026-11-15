import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { IMaintenanceRepository } from "@/repositories/interfaces/IMaintenanceRepository";
import { maintenanceSchema } from "@/schemas/maintenanceSchema";
import type { Maintenance } from "@/types/maintenance";

const notFound = () => new AppError("Запис про обслуговування не знайдено", "NOT_FOUND");

export class MaintenanceService {
  constructor(private readonly maintenance: IMaintenanceRepository) {}

  list(): Promise<Maintenance[]> {
    return this.maintenance.findAll();
  }

  getById(id: number): Promise<Maintenance | null> {
    return this.maintenance.findById(id);
  }

  create(input: unknown): Promise<void> {
    return this.maintenance.create(parseOrThrow(maintenanceSchema, input));
  }

  async update(id: number, input: unknown): Promise<void> {
    if (!(await this.maintenance.update(id, parseOrThrow(maintenanceSchema, input)))) {
      throw notFound();
    }
  }

  async remove(id: number): Promise<void> {
    if (!(await this.maintenance.delete(id))) throw notFound();
  }
}
