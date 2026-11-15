import type { CarStatus } from "@/types/car";
import type { RentalStatus } from "@/types/rental";

export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchFilters = {
  search?: string;
};

export type CarFilters = SearchFilters & {
  status?: CarStatus;
  categoryId?: number;
};

export type RentalFilters = SearchFilters & {
  status?: RentalStatus;
  dateFrom?: string;
  dateTo?: string;
};
