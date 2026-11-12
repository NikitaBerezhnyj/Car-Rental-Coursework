export type PaymentMethod = "cash" | "card";

export type Payment = {
  id: number;
  rentalId: number;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
};
