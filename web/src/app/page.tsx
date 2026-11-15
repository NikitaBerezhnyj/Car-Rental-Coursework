import Dashboard from "@/components/screens/Dashboard/Dashboard";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
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
