import type { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { query } from "@/lib/db";
import { toLikePattern } from "@/utils/sql";
import { SearchFilters } from "@/types/filters";
import type { Payment, PaymentInput, PaymentMethod } from "@/types/payment";

type PaymentRow = {
  payment_id: number;
  rental_id: number;
  customer_name: string;
  amount: string;
  method: PaymentMethod;
  paid_at: string;
};

const toPayment = (row: PaymentRow): Payment => ({
  id: row.payment_id,
  rentalId: row.rental_id,
  customerName: row.customer_name,
  amount: Number(row.amount),
  method: row.method,
  paidAt: row.paid_at
});

export class PaymentRepository implements IPaymentRepository {
  async findAll(filters: SearchFilters = {}): Promise<Payment[]> {
    const rows = await query<PaymentRow>(
      `SELECT p.payment_id, p.rental_id,
              cu.last_name || ' ' || cu.first_name AS customer_name,
              p.amount, p.method,
              to_char(p.paid_at, 'YYYY-MM-DD HH24:MI') AS paid_at
       FROM payments p
       JOIN rentals r USING (rental_id)
       JOIN customers cu USING (customer_id)
       WHERE ($1::text IS NULL
              OR p.rental_id::text ILIKE $1
              OR (cu.last_name || ' ' || cu.first_name) ILIKE $1
              OR (cu.first_name || ' ' || cu.last_name) ILIKE $1)
       ORDER BY p.payment_id`,
      [toLikePattern(filters.search)]
    );
    return rows.map(toPayment);
  }

  async create(data: PaymentInput): Promise<void> {
    await query("INSERT INTO payments (rental_id, amount, method) VALUES ($1, $2, $3)", [
      data.rentalId,
      data.amount,
      data.method
    ]);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query<{ payment_id: number }>(
      "DELETE FROM payments WHERE payment_id = $1 RETURNING payment_id",
      [id]
    );
    return rows.length > 0;
  }
}
