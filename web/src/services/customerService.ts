import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository";
import type { Customer } from "@/types/customer";

export class CustomerService {
  constructor(private readonly customers: ICustomerRepository) {}

  list(): Promise<Customer[]> {
    return this.customers.findAll();
  }
}
