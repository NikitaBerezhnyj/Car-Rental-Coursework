import Dashboard from "@/components/Dashboard/Dashboard";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { carService, rentalService } from "@/container";
import { Suspense } from "react";

async function DashboardContent() {
  const [cars, rentals] = await Promise.all([carService.list(), rentalService.list()]);

  return <Dashboard cars={cars} rentals={rentals} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження головної сторінки..." />}>
      <DashboardContent />
    </Suspense>
  );
}
