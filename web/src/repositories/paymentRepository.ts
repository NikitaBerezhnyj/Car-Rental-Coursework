// paymentRepository.ts
import { query } from "@/lib/db";
import type { Payment, PaymentMethod } from "@/types/payment";
import type { IPaymentRepository } from "./interfaces/IPaymentRepository";

type PaymentRow = {
  payment_id: number;
  rental_id: number;
  amount: string;
  method: PaymentMethod;
  paid_at: string;
};

const toPayment = (row: PaymentRow): Payment => ({
  id: row.payment_id,
  rentalId: row.rental_id,
  amount: Number(row.amount),
  method: row.method,
  paidAt: row.paid_at,
});

export class PaymentRepository implements IPaymentRepository {
  async findAll(): Promise<Payment[]> {
    const rows = await query<PaymentRow>(
      `SELECT payment_id, rental_id, amount, method,
              to_char(paid_at, 'YYYY-MM-DD HH24:MI') AS paid_at
       FROM payments
       ORDER BY payment_id`,
    );
    return rows.map(toPayment);
  }
}
