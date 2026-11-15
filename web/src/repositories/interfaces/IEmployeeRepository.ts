import type { Employee, EmployeeInput } from "@/types/employee";
import { SearchFilters } from "@/types/filters";

export interface IEmployeeRepository {
  findAll(filters: SearchFilters): Promise<Employee[]>;
  findById(id: number): Promise<Employee | null>;
  create(data: EmployeeInput): Promise<Employee>;
  update(id: number, data: EmployeeInput): Promise<Employee | null>;
  delete(id: number): Promise<boolean>;
}
