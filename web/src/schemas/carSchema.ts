import { idField, textField } from "./fields";
import { STORED_CAR_STATUSES } from "@/constants/car";
import { z } from "zod";

export const carSchema = z.object({
  categoryId: idField("Оберіть категорію"),
  brand: textField("марку", 50),
  model: textField("модель", 50),
  plateNumber: z
    .string()
    .transform(value => value.replace(/\s+/g, "").toUpperCase())
    .refine(value => /^[A-Z0-9]{4,10}$/.test(value), "Номерний знак: 4-10 латинських літер і цифр"),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Вкажіть рік чотирма цифрами")
    .transform(Number)
    .refine(
      year => year >= 1990 && year <= new Date().getFullYear() + 1,
      "Некоректний рік випуску"
    ),
  status: z.enum(STORED_CAR_STATUSES, { message: "Некоректний статус" }).default("available")
});
