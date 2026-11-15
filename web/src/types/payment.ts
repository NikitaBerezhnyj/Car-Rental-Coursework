export const PAYMENT_METHODS = ["cash", "card"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Готівка",
  card: "Картка"
};

export type Payment = {
  id: number;
  rentalId: number;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
};

export type PaymentInput = {
  rentalId: number;
  amount: number;
  method: PaymentMethod;
};
