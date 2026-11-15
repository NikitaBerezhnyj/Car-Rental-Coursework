import { isValidDate } from "./fields";
import { CAR_STATUSES } from "@/types/car";
import type { CarFilters, RentalFilters, SearchFilters } from "@/types/filters";
import { RENTAL_STATUSES } from "@/types/rental";
import { z } from "zod";

// Фільтри приходять з адреси, тому некоректні значення ігноруємо (catch),
// а не повертаємо помилку: parse ніколи не кидає виняток
const searchField = z
  .string()
  .trim()
  .max(100)
  .transform(value => value || undefined)
  .optional()
  .catch(undefined);

const dateFilterField = z.string().refine(isValidDate).optional().catch(undefined);

const searchFiltersSchema = z.object({ search: searchField });

const carFiltersSchema = z.object({
  search: searchField,
  status: z.enum(CAR_STATUSES).optional().catch(undefined),
  categoryId: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .optional()
    .catch(undefined)
});

const rentalFiltersSchema = z.object({
  search: searchField,
  status: z.enum(RENTAL_STATUSES).optional().catch(undefined),
  dateFrom: dateFilterField,
  dateTo: dateFilterField
});

export const parseSearchFilters = (params: unknown): SearchFilters =>
  searchFiltersSchema.parse(params);

export const parseCarFilters = (params: unknown): CarFilters => carFiltersSchema.parse(params);

export const parseRentalFilters = (params: unknown): RentalFilters =>
  rentalFiltersSchema.parse(params);
