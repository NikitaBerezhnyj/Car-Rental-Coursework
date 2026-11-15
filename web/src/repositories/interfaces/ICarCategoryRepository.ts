import type { CarCategory, CarCategoryInput } from "@/types/carCategory";

export interface ICarCategoryRepository {
  findAll(): Promise<CarCategory[]>;
  findById(id: number): Promise<CarCategory | null>;
  create(data: CarCategoryInput): Promise<CarCategory>;
  update(id: number, data: CarCategoryInput): Promise<CarCategory | null>;
  delete(id: number): Promise<boolean>;
}
