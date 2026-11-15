import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { ICarRepository } from "@/repositories/interfaces/ICarRepository";
import { carSchema } from "@/schemas/carSchema";
import { periodSchema } from "@/schemas/periodSchema";
import type { Car } from "@/types/car";
import { CarFilters } from "@/types/filters";

const notFound = () => new AppError("Автомобіль не знайдено", "NOT_FOUND");

export class CarService {
  constructor(private readonly cars: ICarRepository) {}

  list(filters: CarFilters = {}): Promise<Car[]> {
    return this.cars.findAll(filters);
  }

  getById(id: number): Promise<Car | null> {
    return this.cars.findById(id);
  }

  create(input: unknown): Promise<void> {
    return this.cars.create(parseOrThrow(carSchema, input));
  }

  async update(id: number, input: unknown): Promise<void> {
    if (!(await this.cars.update(id, parseOrThrow(carSchema, input)))) throw notFound();
  }

  async remove(id: number): Promise<void> {
    if (!(await this.cars.delete(id))) throw notFound();
  }

  async listAvailable(startDate: string, endDate: string): Promise<Car[]> {
    const period = periodSchema.safeParse({ startDate, endDate });
    if (!period.success) return [];

    return this.cars.findAvailable(period.data.startDate, period.data.endDate);
  }
}
