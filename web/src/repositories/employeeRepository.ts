// employeeRepository.ts
import { query } from "@/lib/db";
import type { Employee } from "@/types/employee";
import type { IEmployeeRepository } from "./interfaces/IEmployeeRepository";

type EmployeeRow = {
  employee_id: number;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
};

const toEmployee = (row: EmployeeRow): Employee => ({
  id: row.employee_id,
  firstName: row.first_name,
  lastName: row.last_name,
  position: row.position,
  phone: row.phone,
});

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const rows = await query<EmployeeRow>(
      `SELECT employee_id, first_name, last_name, position, phone
       FROM employees
       ORDER BY employee_id`,
    );
    return rows.map(toEmployee);
  }
}
