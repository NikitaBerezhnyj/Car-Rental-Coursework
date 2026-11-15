import { DataTable } from "@/components/DataTable/DataTable";
import type { ReportsData } from "@/types/report";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

export function Reports({ reports }: { reports: ReportsData }) {
  return (
    <main className="page-container">
      <header>
        <h1 className="page-title">Звіти</h1>
        <p className="page-subtitle">Аналітика роботи пункту прокату на основі даних бази</p>
      </header>

      <DataTable
        title="Надходження оплат за місяцями"
        rows={reports.monthlyIncome}
        columns={[
          { header: "Місяць", render: row => row.month },
          { header: "Кількість оплат", render: row => row.paymentsCount },
          { header: "Сума", render: row => formatCurrency(row.total) }
        ]}
        emptyMessage="Оплат поки немає"
      />

      <DataTable
        title="Популярність категорій автомобілів"
        rows={reports.categoryStats}
        columns={[
          { header: "Категорія", render: row => row.name },
          { header: "Кількість оренд", render: row => row.rentalsCount },
          { header: "Виручка", render: row => formatCurrency(row.revenue) }
        ]}
      />

      <DataTable
        title="Клієнти із заборгованістю"
        rows={reports.debtors}
        columns={[
          { header: "Клієнт", render: row => row.customerName },
          { header: "Телефон", render: row => row.phone },
          { header: "Оренд із боргом", render: row => row.rentalsCount },
          { header: "Борг", render: row => formatCurrency(row.debt) }
        ]}
        emptyMessage="Заборгованостей немає"
      />

      <DataTable
        title="Прострочені оренди"
        rows={reports.overdueRentals}
        columns={[
          { header: "Оренда №", render: row => `#${row.id}` },
          { header: "Клієнт", render: row => row.customerName },
          { header: "Автомобіль", render: row => row.carName },
          { header: "Мав повернутися", render: row => formatDate(row.endDate) },
          { header: "Днів прострочення", render: row => row.daysOverdue }
        ]}
        emptyMessage="Прострочених оренд немає"
      />

      <DataTable
        title="Постійні клієнти (від двох оренд)"
        rows={reports.frequentCustomers}
        columns={[
          { header: "Клієнт", render: row => row.customerName },
          { header: "Кількість оренд", render: row => row.rentalsCount },
          { header: "Сплачено", render: row => formatCurrency(row.totalPaid) }
        ]}
        emptyMessage="Постійних клієнтів поки немає"
      />

      <DataTable
        title="Прибутковість автомобілів"
        rows={reports.carProfits}
        columns={[
          { header: "Автомобіль", render: row => row.carName },
          { header: "Номер", render: row => row.plateNumber },
          { header: "Оренд", render: row => row.rentalsCount },
          { header: "Виручка", render: row => formatCurrency(row.revenue) },
          { header: "Витрати на ТО", render: row => formatCurrency(row.maintenanceCost) },
          { header: "Результат", render: row => formatCurrency(row.profit) }
        ]}
      />

      <DataTable
        title="Робота працівників"
        rows={reports.employeeStats}
        columns={[
          { header: "Працівник", render: row => row.employeeName },
          { header: "Посада", render: row => row.position },
          { header: "Оформлено оренд", render: row => row.rentalsCount },
          { header: "Сума оренд", render: row => formatCurrency(row.revenue) }
        ]}
      />
    </main>
  );
}
