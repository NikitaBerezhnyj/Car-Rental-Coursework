import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { Maintenance } from "@/components/screens/Maintenance/Maintenance";
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
