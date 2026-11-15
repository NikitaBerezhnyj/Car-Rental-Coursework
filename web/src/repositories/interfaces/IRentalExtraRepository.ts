import type { RentalExtra } from "@/types/rentalExtra";

export interface IRentalExtraRepository {
  findByRentalId(rentalId: number): Promise<RentalExtra[]>;
}
