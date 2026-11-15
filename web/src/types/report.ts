export type MonthlyIncome = {
  id: string;
  month: string;
  paymentsCount: number;
  total: number;
};

export type CategoryStats = {
  id: number;
  name: string;
  rentalsCount: number;
  revenue: number;
};

export type FrequentCustomer = {
  id: number;
  customerName: string;
  rentalsCount: number;
  totalPaid: number;
};

export type CarProfit = {
  id: number;
  carName: string;
  plateNumber: string;
  rentalsCount: number;
  revenue: number;
  maintenanceCost: number;
  profit: number;
};

export type ReportsData = {
  monthlyIncome: MonthlyIncome[];
  categoryStats: CategoryStats[];
  frequentCustomers: FrequentCustomer[];
  carProfits: CarProfit[];
};
