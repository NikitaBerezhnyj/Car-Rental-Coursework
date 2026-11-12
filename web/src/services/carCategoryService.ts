// carCategoryService.ts
import type { ICarCategoryRepository } from "@/repositories/interfaces/ICarCategoryRepository";
import type { CarCategory } from "@/types/carCategory";

export class CarCategoryService {
  constructor(private readonly carCategories: ICarCategoryRepository) {}

  list(): Promise<CarCategory[]> {
    return this.carCategories.findAll();
  }
}
