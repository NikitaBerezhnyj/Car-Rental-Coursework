import type { IRentalExtraRepository } from "@/repositories/interfaces/IRentalExtraRepository";
import type { RentalExtra } from "@/types/rentalExtra";

export class RentalExtraService {
  constructor(private readonly rentalExtras: IRentalExtraRepository) {}

  list(): Promise<RentalExtra[]> {
    return this.rentalExtras.findAll();
  }
}
