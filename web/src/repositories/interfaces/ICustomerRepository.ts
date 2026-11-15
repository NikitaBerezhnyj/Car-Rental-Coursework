import type { Customer, CustomerInput } from "@/types/customer";
import { SearchFilters } from "@/types/filters";

export interface ICustomerRepository {
  findAll(filters: SearchFilters): Promise<Customer[]>;
  findById(id: number): Promise<Customer | null>;
  create(data: CustomerInput): Promise<Customer>;
  update(id: number, data: CustomerInput): Promise<Customer | null>;
  delete(id: number): Promise<boolean>;
}
