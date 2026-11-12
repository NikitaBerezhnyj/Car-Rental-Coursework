import type { Customer } from "@/types/customer";

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
}
