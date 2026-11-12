// IPaymentRepository.ts
import type { Payment } from "@/types/payment";

export interface IPaymentRepository {
  findAll(): Promise<Payment[]>;
}
