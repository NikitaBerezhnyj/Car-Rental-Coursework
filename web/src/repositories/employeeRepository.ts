import type { IEmployeeRepository } from "./interfaces/IEmployeeRepository";
import { query } from "@/lib/db";
import { toLikePattern } from "@/utils/sql";
import type { Employee, EmployeeInput, EmployeePosition } from "@/types/employee";
import { SearchFilters } from "@/types/filters";

type EmployeeRow = {
  employee_id: number;
  first_name: string;
  last_name: string;
  position: EmployeePosition;
  phone: string;
};

const COLUMNS = "employee_id, first_name, last_name, position, phone";

const toEmployee = (row: EmployeeRow): Employee => ({
  id: row.employee_id,
  firstName: row.first_name,
  lastName: row.last_name,
  position: row.position,
  phone: row.phone
});

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(filters: SearchFilters = {}): Promise<Employee[]> {
    const rows = await query<EmployeeRow>(
      `SELECT ${COLUMNS} FROM employees
       WHERE ($1::text IS NULL
              OR (last_name || ' ' || first_name) ILIKE $1
              OR (first_name || ' ' || last_name) ILIKE $1
              OR position ILIKE $1
              OR phone ILIKE $1)
       ORDER BY employee_id`,
      [toLikePattern(filters.search)]
    );
    return rows.map(toEmployee);
  }

  async findById(id: number): Promise<Employee | null> {
    const rows = await query<EmployeeRow>(
      `SELECT ${COLUMNS} FROM employees WHERE employee_id = $1`,
      [id]
    );
    return rows[0] ? toEmployee(rows[0]) : null;
  }

  async create(data: EmployeeInput): Promise<Employee> {
    const rows = await query<EmployeeRow>(
      `INSERT INTO employees (first_name, last_name, position, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [data.firstName, data.lastName, data.position, data.phone]
    );
    return toEmployee(rows[0]);
  }

  async update(id: number, data: EmployeeInput): Promise<Employee | null> {
    const rows = await query<EmployeeRow>(
      `UPDATE employees
       SET first_name = $1, last_name = $2, position = $3, phone = $4
       WHERE employee_id = $5
       RETURNING ${COLUMNS}`,
      [data.firstName, data.lastName, data.position, data.phone, id]
    );
    return rows[0] ? toEmployee(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ employee_id: number }>(
      "DELETE FROM employees WHERE employee_id = $1 RETURNING employee_id",
      [id]
    );
    return rows.length > 0;
  }
}
