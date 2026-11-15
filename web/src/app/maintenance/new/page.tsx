import { createMaintenance } from "@/actions/maintenanceActions";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { MaintenanceForm } from "@/components/forms/MaintenanceForm/MaintenanceForm";
import { carService } from "@/container";
import { Suspense } from "react";

async function NewMaintenanceContent() {
  const cars = await carService.list();

  return (
    <MaintenanceForm
      cars={cars.filter(car => car.status !== "retired")}
      action={createMaintenance}
    />
  );
}

export default function NewMaintenancePage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження форми..." />}>
      <NewMaintenanceContent />
    </Suspense>
  );
}
