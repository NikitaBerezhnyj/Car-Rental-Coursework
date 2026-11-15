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

export type Debtor = {
  id: number;
  customerName: string;
  phone: string;
  rentalsCount: number;
  debt: number;
};

export type OverdueRental = {
  id: number;
  customerName: string;
  carName: string;
  endDate: string;
  daysOverdue: number;
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

export type EmployeeStats = {
  id: number;
  employeeName: string;
  position: string;
  rentalsCount: number;
  revenue: number;
};

export type ReportsData = {
  monthlyIncome: MonthlyIncome[];
  categoryStats: CategoryStats[];
  debtors: Debtor[];
  overdueRentals: OverdueRental[];
  frequentCustomers: FrequentCustomer[];
  carProfits: CarProfit[];
  employeeStats: EmployeeStats[];
};
