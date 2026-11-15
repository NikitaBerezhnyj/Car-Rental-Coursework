export const CAR_STATUSES = ["available", "rented", "maintenance", "retired"] as const;
export type CarStatus = (typeof CAR_STATUSES)[number];

export const STORED_CAR_STATUSES = ["available", "retired"] as const;
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
