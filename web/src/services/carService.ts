import type { CarRepository } from "@/repositories/carRepository";
import type { Car } from "@/types/car";

export class CarService {
  constructor(private readonly cars: CarRepository) {}

  list(): Promise<Car[]> {
    return this.cars.findAll();
  }
}
