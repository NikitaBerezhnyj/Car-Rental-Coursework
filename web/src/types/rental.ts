// types/rental.ts
export type RentalStatus = "booked" | "active" | "completed" | "cancelled";

export type Rental = {
  id: number;
  customerName: string;
  carName: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  status: RentalStatus;
};
