import { RentalFilters } from "@/types/filters";
import type { Rental, RentalInput, RentalStats, RentalStatus } from "@/types/rental";

export interface IRentalRepository {
  findAll(filters: RentalFilters): Promise<Rental[]>;
  findById(id: number): Promise<Rental | null>;
  countByStatus(): Promise<RentalStats>;
  create(data: RentalInput): Promise<number>;
  updateStatus(id: number, status: RentalStatus): Promise<boolean>;
}
