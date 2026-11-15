import { idField, moneyField } from "./fields";
import { PAYMENT_METHODS } from "@/types/payment";
import { z } from "zod";

export const paymentSchema = z.object({
  rentalId: idField("Некоректна оренда"),
  amount: moneyField.refine(value => value > 0, "Сума оплати має бути більшою за 0"),
  method: z.enum(PAYMENT_METHODS, { message: "Оберіть спосіб оплати" })
});
