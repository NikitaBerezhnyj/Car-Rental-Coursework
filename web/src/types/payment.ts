import { PAYMENT_METHODS } from "@/constants/payment";

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

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
