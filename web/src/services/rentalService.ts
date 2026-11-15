import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { IRentalExtraRepository } from "@/repositories/interfaces/IRentalExtraRepository";
import type { IRentalRepository } from "@/repositories/interfaces/IRentalRepository";
import { rentalSchema } from "@/schemas/rentalSchema";
import { RentalFilters } from "@/types/filters";
import type { Rental, RentalStats, RentalStatus, RentalWithExtras } from "@/types/rental";

export class RentalService {
  constructor(
    private readonly rentals: IRentalRepository,
    private readonly rentalExtras: IRentalExtraRepository
  ) {}

  list(filters: RentalFilters = {}): Promise<Rental[]> {
    return this.rentals.findAll(filters);
  }

  async getById(id: number): Promise<RentalWithExtras | null> {
    const rental = await this.rentals.findById(id);
    if (!rental) return null;

    const extras = await this.rentalExtras.findByRentalId(id);
    return { ...rental, extras };
  }

  getStats(): Promise<RentalStats> {
    return this.rentals.countByStatus();
  }

  create(input: unknown): Promise<number> {
    return this.rentals.create(parseOrThrow(rentalSchema, input));
  }

  async changeStatus(id: number, status: RentalStatus): Promise<void> {
    if (!(await this.rentals.updateStatus(id, status))) {
      throw new AppError("Оренду не знайдено", "NOT_FOUND");
    }
  }
}
