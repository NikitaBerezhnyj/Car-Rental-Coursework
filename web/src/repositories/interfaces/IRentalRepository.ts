import type { Rental } from "@/types/rental";

export interface IRentalRepository {
  findAll(): Promise<Rental[]>;
}
