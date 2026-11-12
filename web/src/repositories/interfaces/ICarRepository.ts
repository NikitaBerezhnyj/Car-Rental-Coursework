import type { Car } from "@/types/car";

export interface ICarRepository {
  findAll(): Promise<Car[]>;
}
