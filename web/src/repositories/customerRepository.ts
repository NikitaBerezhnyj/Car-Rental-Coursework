import { query } from "@/lib/db";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository";
import type { Customer, CustomerInput } from "@/types/customer";
import { SearchFilters } from "@/types/filters";
import { toLikePattern } from "@/utils/sql";

type CustomerRow = {
  customer_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  driver_license: string;
};

const COLUMNS = "customer_id, first_name, last_name, phone, email, driver_license";

const toCustomer = (row: CustomerRow): Customer => ({
  id: row.customer_id,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  email: row.email,
  driverLicense: row.driver_license
});

export class CustomerRepository implements ICustomerRepository {
  async findAll(filters: SearchFilters = {}): Promise<Customer[]> {
    const rows = await query<CustomerRow>(
      `SELECT ${COLUMNS} FROM customers
       WHERE ($1::text IS NULL
              OR (last_name || ' ' || first_name) ILIKE $1
              OR (first_name || ' ' || last_name) ILIKE $1
              OR phone ILIKE $1)
       ORDER BY last_name, first_name`,
      [toLikePattern(filters.search)]
    );
    return rows.map(toCustomer);
  }

  async findById(id: number): Promise<Customer | null> {
    const rows = await query<CustomerRow>(
      `SELECT ${COLUMNS} FROM customers WHERE customer_id = $1`,
      [id]
    );
    return rows[0] ? toCustomer(rows[0]) : null;
  }

  async create(data: CustomerInput): Promise<Customer> {
    const rows = await query<CustomerRow>(
      `INSERT INTO customers (first_name, last_name, phone, email, driver_license)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [data.firstName, data.lastName, data.phone, data.email, data.driverLicense]
    );
    return toCustomer(rows[0]);
  }

  async update(id: number, data: CustomerInput): Promise<Customer | null> {
    const rows = await query<CustomerRow>(
      `UPDATE customers
       SET first_name = $1, last_name = $2, phone = $3, email = $4, driver_license = $5
       WHERE customer_id = $6
       RETURNING ${COLUMNS}`,
      [data.firstName, data.lastName, data.phone, data.email, data.driverLicense, id]
    );
    return rows[0] ? toCustomer(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ customer_id: number }>(
      "DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id",
      [id]
    );
    return rows.length > 0;
  }
}
