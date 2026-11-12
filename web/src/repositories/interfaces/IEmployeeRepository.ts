// IEmployeeRepository.ts
import type { Employee } from "@/types/employee";

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
}
