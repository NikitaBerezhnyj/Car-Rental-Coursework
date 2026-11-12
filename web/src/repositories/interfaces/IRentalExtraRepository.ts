import type { RentalExtra } from "@/types/rentalExtra";

export interface IRentalExtraRepository {
  findAll(): Promise<RentalExtra[]>;
}
