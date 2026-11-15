import { createCar } from "@/actions/carActions";
import { CarForm } from "@/components/forms/CarForm/CarForm";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { carCategoryService } from "@/container";
import { Suspense } from "react";

async function NewCarContent() {
  const categories = await carCategoryService.list();

  return <CarForm categories={categories} action={createCar} />;
}

export default function NewCarPage() {
  return (
    <Suspense fallback={<LoadingState message="Завантаження форми..." />}>
      <NewCarContent />
    </Suspense>
  );
}
