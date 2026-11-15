import type { IReportRepository } from "@/repositories/interfaces/IReportRepository";
import type { ReportsData } from "@/types/report";

export class ReportService {
  constructor(private readonly reports: IReportRepository) {}

  async getAll(): Promise<ReportsData> {
    const [
      monthlyIncome,
      categoryStats,
      debtors,
      overdueRentals,
      frequentCustomers,
      carProfits,
      employeeStats
    ] = await Promise.all([
      this.reports.getMonthlyIncome(),
      this.reports.getCategoryStats(),
      this.reports.getDebtors(),
      this.reports.getOverdueRentals(),
      this.reports.getFrequentCustomers(),
      this.reports.getCarProfits(),
      this.reports.getEmployeeStats()
    ]);

    return {
      monthlyIncome,
      categoryStats,
      debtors,
      overdueRentals,
      frequentCustomers,
      carProfits,
      employeeStats
    };
  }
}
