import type { IDashboardRepository } from "@/repositories/interfaces/IDashboardRepository";
import type { DashboardData } from "@/types/dashboard";

export class DashboardService {
  constructor(private readonly dashboard: IDashboardRepository) {}

  async getOverview(): Promise<DashboardData> {
    const [summary, overdueRentals, upcomingReturns, upcomingPickups, debtors] = await Promise.all([
      this.dashboard.getSummary(),
      this.dashboard.getOverdueRentals(),
      this.dashboard.getUpcomingReturns(),
      this.dashboard.getUpcomingPickups(),
      this.dashboard.getTopDebtors()
    ]);

    return { summary, overdueRentals, upcomingReturns, upcomingPickups, debtors };
  }
}
