// types/maintenance.ts
export type Maintenance = {
  id: number;
  carName: string;
  startDate: string;
  endDate: string | null;
  description: string;
  cost: number;
};
