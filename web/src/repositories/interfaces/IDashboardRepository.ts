import type { DashboardSummary, Debtor, OverdueRental, UpcomingRental } from "@/types/dashboard";

export interface IDashboardRepository {
  getSummary(): Promise<DashboardSummary>;
  getOverdueRentals(): Promise<OverdueRental[]>;
  getUpcomingReturns(): Promise<UpcomingRental[]>;
  getUpcomingPickups(): Promise<UpcomingRental[]>;
  getTopDebtors(): Promise<Debtor[]>;
}
