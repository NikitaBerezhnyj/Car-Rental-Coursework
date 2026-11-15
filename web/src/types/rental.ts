import type { RentalExtra } from "@/types/rentalExtra";

export const RENTAL_STATUSES = ["booked", "active", "completed", "cancelled"] as const;
export type RentalStatus = (typeof RENTAL_STATUSES)[number];

export type RentalStats = Record<RentalStatus, number>;

export type Rental = {
  id: number;
  customerName: string;
  carName: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  status: RentalStatus;
  days: number;
  rentalCost: number;
  extrasCost: number;
  totalCost: number;
  paidAmount: number;
  balance: number;
};

export type RentalWithExtras = Rental & {
  extras: RentalExtra[];
};

export type RentalInput = {
  customerId: number;
  carId: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  extraIds: number[];
};
