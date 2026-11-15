import type { Car, CarInput } from "@/types/car";
import { CarFilters } from "@/types/filters";

export interface ICarRepository {
  findAll(filters: CarFilters): Promise<Car[]>;
  findById(id: number): Promise<Car | null>;
  create(data: CarInput): Promise<void>;
  update(id: number, data: CarInput): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findAvailable(startDate: string, endDate: string): Promise<Car[]>;
}
