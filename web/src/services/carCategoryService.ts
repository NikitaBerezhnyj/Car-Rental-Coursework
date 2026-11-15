import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { ICarCategoryRepository } from "@/repositories/interfaces/ICarCategoryRepository";
import { carCategorySchema } from "@/schemas/carCategorySchema";
import type { CarCategory } from "@/types/carCategory";

const notFound = () => new AppError("Категорію не знайдено", "NOT_FOUND");

export class CarCategoryService {
  constructor(private readonly carCategories: ICarCategoryRepository) {}

  list(): Promise<CarCategory[]> {
    return this.carCategories.findAll();
  }

  getById(id: number): Promise<CarCategory | null> {
    return this.carCategories.findById(id);
  }

  create(input: unknown): Promise<CarCategory> {
    return this.carCategories.create(parseOrThrow(carCategorySchema, input));
  }

  async update(id: number, input: unknown): Promise<CarCategory> {
    const category = await this.carCategories.update(id, parseOrThrow(carCategorySchema, input));
    if (!category) throw notFound();
    return category;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.carCategories.delete(id))) throw notFound();
  }
}
