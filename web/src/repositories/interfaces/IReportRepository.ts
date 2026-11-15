import type { CarProfit, CategoryStats, FrequentCustomer, MonthlyIncome } from "@/types/report";

export interface IReportRepository {
  getMonthlyIncome(): Promise<MonthlyIncome[]>;
  getCategoryStats(): Promise<CategoryStats[]>;
  getFrequentCustomers(): Promise<FrequentCustomer[]>;
  getCarProfits(): Promise<CarProfit[]>;
}
