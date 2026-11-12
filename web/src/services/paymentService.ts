import type { IPaymentRepository } from "@/repositories/interfaces/IPaymentRepository";
import type { Payment } from "@/types/payment";

export class PaymentService {
  constructor(private readonly payments: IPaymentRepository) {}

  list(): Promise<Payment[]> {
    return this.payments.findAll();
  }
}
