import { Cars } from "@/components/Cars/Cars";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { carService } from "@/container";
import { Suspense } from "react";

async function CarsContent() {
  const cars = await carService.list();

  return <Cars cars={cars} />;
}

export default function CarsPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження автомобілів..." />}>
      <CarsContent />
    </Suspense>
  );
}
