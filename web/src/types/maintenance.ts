export type MaintenanceStatus = "planned" | "ongoing" | "completed";

export type Maintenance = {
  id: number;
  carId: number;
  carName: string;
  startDate: string;
  endDate: string | null;
  description: string;
  cost: number;
  status: MaintenanceStatus;
};

export type MaintenanceInput = {
  carId: number;
  startDate: string;
  endDate: string | null;
  description: string;
  cost: number;
};
