import type { IReportRepository } from "@/repositories/interfaces/IReportRepository";
import type { ReportsData } from "@/types/report";

export class ReportService {
  constructor(private readonly reports: IReportRepository) {}

  async getAll(): Promise<ReportsData> {
    const [monthlyIncome, categoryStats, frequentCustomers, carProfits] = await Promise.all([
      this.reports.getMonthlyIncome(),
      this.reports.getCategoryStats(),
      this.reports.getFrequentCustomers(),
      this.reports.getCarProfits()
    ]);

    return { monthlyIncome, categoryStats, frequentCustomers, carProfits };
  }
}
