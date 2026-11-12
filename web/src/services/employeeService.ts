import type { IEmployeeRepository } from "@/repositories/interfaces/IEmployeeRepository";
import type { Employee } from "@/types/employee";

export class EmployeeService {
  constructor(private readonly employees: IEmployeeRepository) {}

  list(): Promise<Employee[]> {
    return this.employees.findAll();
  }
}
