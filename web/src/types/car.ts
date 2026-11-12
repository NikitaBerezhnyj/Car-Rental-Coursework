export type CarStatus = "available" | "maintenance" | "retired";

export type Car = {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  year: number;
  status: CarStatus;
  categoryName: string;
  dailyRate: number;
};
