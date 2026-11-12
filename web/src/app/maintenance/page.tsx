import { LoadingState } from "@/components/LoadingState/LoadingState";
import { Maintenance } from "@/components/Maintenance/Maintenance";
import { maintenanceService } from "@/container";
import { Suspense } from "react";

async function MaintenanceContent() {
  const records = await maintenanceService.list();

  return <Maintenance records={records} />;
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження техобслуговування..." />}>
      <MaintenanceContent />
    </Suspense>
  );
}
