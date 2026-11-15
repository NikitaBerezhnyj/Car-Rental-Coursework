import { parseDate } from "@/utils/date";
import { z } from "zod";

export const textField = (label: string, max: number) =>
  z.string().trim().min(1, `Вкажіть ${label}`).max(max, `Максимум ${max} символів: ${label}`);

export const phoneField = z
  .string()
  .trim()
  .regex(/^\+?\d{10,15}$/, "Некоректний номер телефону");

export const moneyField = z
  .string()
  .trim()
  .regex(/^\d{1,8}([.,]\d{1,2})?$/, "Вкажіть суму числом, наприклад 1200 або 1200.50")
  .transform(value => Number(value.replace(",", ".")));

export const idField = (message: string) =>
  z
    .string({ message })
    .regex(/^[1-9]\d*$/, message)
    .transform(Number);

export const isValidDate = (value: string) => !Number.isNaN(parseDate(value).getTime());

export const dateField = z.string().trim().refine(isValidDate, "Вкажіть коректну дату");

export const optionalDateField = z
  .string()
  .trim()
  .refine(value => value === "" || isValidDate(value), "Вкажіть коректну дату")
  .transform(value => value || null);
