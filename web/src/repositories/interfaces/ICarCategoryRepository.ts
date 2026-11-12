import type { CarCategory } from "@/types/carCategory";

export interface ICarCategoryRepository {
  findAll(): Promise<CarCategory[]>;
}
