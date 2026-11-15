import type {
  CarProfit,
  CategoryStats,
  Debtor,
  EmployeeStats,
  FrequentCustomer,
  MonthlyIncome,
  OverdueRental
} from "@/types/report";

export interface IReportRepository {
  getMonthlyIncome(): Promise<MonthlyIncome[]>;
  getCategoryStats(): Promise<CategoryStats[]>;
  getDebtors(): Promise<Debtor[]>;
  getOverdueRentals(): Promise<OverdueRental[]>;
  getFrequentCustomers(): Promise<FrequentCustomer[]>;
  getCarProfits(): Promise<CarProfit[]>;
  getEmployeeStats(): Promise<EmployeeStats[]>;
}
