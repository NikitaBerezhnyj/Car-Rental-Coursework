import { DataTable } from "@/components/ui/DataTable/DataTable";
import type { ReportsData } from "@/types/report";
import { formatCurrency } from "@/utils/currency";

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
        title="Популярність категорій автомобілів"
        rows={reports.categoryStats}
        columns={[
          { header: "Категорія", render: row => row.name },
          { header: "Кількість оренд", render: row => row.rentalsCount },
          { header: "Виручка", render: row => formatCurrency(row.revenue) }
        ]}
      />

      <DataTable
        title="Постійні клієнти"
        rows={reports.frequentCustomers}
        columns={[
          { header: "Клієнт", render: row => row.customerName },
          { header: "Кількість оренд", render: row => row.rentalsCount },
          { header: "Сплачено", render: row => formatCurrency(row.totalPaid) }
        ]}
        emptyMessage="Постійних клієнтів поки немає"
      />
    </main>
  );
}
