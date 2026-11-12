import type { IRentalRepository } from "@/repositories/interfaces/IRentalRepository";
import type { Rental } from "@/types/rental";

export class RentalService {
  constructor(private readonly rentals: IRentalRepository) {}

  list(): Promise<Rental[]> {
    return this.rentals.findAll();
  }
}
