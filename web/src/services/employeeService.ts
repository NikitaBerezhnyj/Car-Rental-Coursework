import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { IEmployeeRepository } from "@/repositories/interfaces/IEmployeeRepository";
import { employeeSchema } from "@/schemas/employeeSchema";
import type { Employee } from "@/types/employee";
import { SearchFilters } from "@/types/filters";

const notFound = () => new AppError("Працівника не знайдено", "NOT_FOUND");

export class EmployeeService {
  constructor(private readonly employees: IEmployeeRepository) {}

  list(filters: SearchFilters = {}): Promise<Employee[]> {
    return this.employees.findAll(filters);
  }

  getById(id: number): Promise<Employee | null> {
    return this.employees.findById(id);
  }

  create(input: unknown): Promise<Employee> {
    return this.employees.create(parseOrThrow(employeeSchema, input));
  }

  async update(id: number, input: unknown): Promise<Employee> {
    const employee = await this.employees.update(id, parseOrThrow(employeeSchema, input));
    if (!employee) throw notFound();
    return employee;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.employees.delete(id))) throw notFound();
  }
}
