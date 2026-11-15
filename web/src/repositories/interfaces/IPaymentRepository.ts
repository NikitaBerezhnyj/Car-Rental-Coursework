import { SearchFilters } from "@/types/filters";
import type { Payment, PaymentInput } from "@/types/payment";

export interface IPaymentRepository {
  findAll(filters: SearchFilters): Promise<Payment[]>;
  create(data: PaymentInput): Promise<void>;
  delete(id: number): Promise<boolean>;
}
