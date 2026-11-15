import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository";
import { customerSchema } from "@/schemas/customerSchema";
import type { Customer } from "@/types/customer";
import { SearchFilters } from "@/types/filters";

const notFound = () => new AppError("Клієнта не знайдено", "NOT_FOUND");

export class CustomerService {
  constructor(private readonly customers: ICustomerRepository) {}

  list(filters: SearchFilters = {}): Promise<Customer[]> {
    return this.customers.findAll(filters);
  }

  getById(id: number): Promise<Customer | null> {
    return this.customers.findById(id);
  }

  create(input: unknown): Promise<Customer> {
    return this.customers.create(parseOrThrow(customerSchema, input));
  }

  async update(id: number, input: unknown): Promise<Customer> {
    const customer = await this.customers.update(id, parseOrThrow(customerSchema, input));
    if (!customer) throw notFound();
    return customer;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.customers.delete(id))) throw notFound();
  }
}
