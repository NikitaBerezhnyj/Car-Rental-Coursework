import { updateMaintenance } from "@/actions/maintenanceActions";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { MaintenanceForm } from "@/components/forms/MaintenanceForm/MaintenanceForm";
import { carService, maintenanceService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditMaintenanceContent({ params }: PageProps) {
  const { id } = await params;

  const [record, cars] = await Promise.all([
    maintenanceService.getById(parseId(id)),
    carService.list()
  ]);

  if (!record) {
    notFound();
  }

  return (
    <MaintenanceForm
      record={record}
      cars={cars.filter(car => car.status !== "retired" || car.id === record.carId)}
      action={updateMaintenance.bind(null, record.id)}
    />
  );
}

export default function EditMaintenancePage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження запису..." />}>
      <EditMaintenanceContent params={params} />
    </Suspense>
  );
}
