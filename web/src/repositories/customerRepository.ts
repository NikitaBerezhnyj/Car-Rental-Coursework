import { query } from "@/lib/db";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository";
import type { Customer } from "@/types/customer";

type CustomerRow = {
  customer_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  driver_license: string;
};

const toCustomer = (row: CustomerRow): Customer => ({
  id: row.customer_id,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  email: row.email,
  driverLicense: row.driver_license,
});

export class CustomerRepository implements ICustomerRepository {
  async findAll(): Promise<Customer[]> {
    const rows = await query<CustomerRow>(
      `SELECT customer_id, first_name, last_name, phone, email, driver_license
       FROM customers
       ORDER BY last_name, first_name`,
    );
    return rows.map(toCustomer);
  }
}
