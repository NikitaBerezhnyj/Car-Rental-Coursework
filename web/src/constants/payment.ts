import { PaymentMethod } from "@/types/payment";

export const PAYMENT_METHODS = ["cash", "card"] as const;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Готівка",
  card: "Картка"
};
