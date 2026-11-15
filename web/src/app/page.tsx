import Dashboard from "@/components/Dashboard/Dashboard";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { dashboardService } from "@/container";
import { Suspense } from "react";

async function DashboardContent() {
  const data = await dashboardService.getOverview();

  return <Dashboard data={data} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження головної сторінки..." />}>
      <DashboardContent />
    </Suspense>
  );
}
