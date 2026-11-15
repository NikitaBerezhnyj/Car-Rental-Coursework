import type { CAR_STATUSES, STORED_CAR_STATUSES } from "@/constants/car";

export type CarStatus = (typeof CAR_STATUSES)[number];
export type StoredCarStatus = (typeof STORED_CAR_STATUSES)[number];

export type Car = {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  year: number;
  status: CarStatus;
  categoryId: number;
  categoryName: string;
  dailyRate: number;
};

export type CarInput = {
  categoryId: number;
  brand: string;
  model: string;
  plateNumber: string;
  year: number;
  status: StoredCarStatus;
};
