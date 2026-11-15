import { AppError } from "@/lib/errors";
import { parseOrThrow } from "@/lib/validation";
import type { IPaymentRepository } from "@/repositories/interfaces/IPaymentRepository";
import { paymentSchema } from "@/schemas/paymentSchema";
import { SearchFilters } from "@/types/filters";
import type { Payment } from "@/types/payment";

export class PaymentService {
  constructor(private readonly payments: IPaymentRepository) {}

  list(filters: SearchFilters = {}): Promise<Payment[]> {
    return this.payments.findAll(filters);
  }

  create(input: unknown): Promise<void> {
    return this.payments.create(parseOrThrow(paymentSchema, input));
  }

  async remove(id: number): Promise<void> {
    if (!(await this.payments.delete(id))) {
      throw new AppError("Оплату не знайдено", "NOT_FOUND");
    }
  }
}
