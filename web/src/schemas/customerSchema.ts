import { phoneField, textField } from "./fields";
import { z } from "zod";

export const customerSchema = z.object({
  firstName: textField("ім'я", 50),
  lastName: textField("прізвище", 50),
  phone: phoneField,
  email: z
    .string()
    .trim()
    .max(100, "Email надто довгий")
    .refine(value => value === "" || z.email().safeParse(value).success, "Некоректний email")
    .transform(value => value || null),
  driverLicense: textField("номер посвідчення", 20)
});
