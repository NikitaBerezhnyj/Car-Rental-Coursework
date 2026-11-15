import { phoneField, textField } from "./fields";
import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const customerSchema = z.object({
  firstName: textField("ім'я", 50),
  lastName: textField("прізвище", 50),
  phone: phoneField,
  email: z
    .string()
    .trim()
    .max(100, "Email надто довгий")
    .refine(value => value === "" || EMAIL_REGEX.test(value), "Некоректний email")
    .transform(value => value || null),
  driverLicense: textField("номер посвідчення", 20)
});
