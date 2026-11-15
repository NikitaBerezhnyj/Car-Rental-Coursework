export type DashboardSummary = {
  availableCars: number;
  totalCars: number;
  activeRentals: number;
  overdueRentals: number;
  monthIncome: number;
  totalDebt: number;
};

export type OverdueRental = {
  id: number;
  customerName: string;
  carName: string;
  endDate: string;
  daysOverdue: number;
};

export type UpcomingRental = {
  id: number;
  customerName: string;
  carName: string;
  date: string;
};

export type Debtor = {
  id: number;
  customerName: string;
  phone: string;
  rentalsCount: number;
  debt: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  overdueRentals: OverdueRental[];
  upcomingReturns: UpcomingRental[];
  upcomingPickups: UpcomingRental[];
  debtors: Debtor[];
};
