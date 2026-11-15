import { updateCar } from "@/actions/carActions";
import { CarForm } from "@/components/CarForm/CarForm";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { carCategoryService, carService } from "@/container";
import { parseId } from "@/utils/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditCarContent({ params }: PageProps) {
  const { id } = await params;

  const [car, categories] = await Promise.all([
    carService.getById(parseId(id)),
    carCategoryService.list()
  ]);

  if (!car) {
    notFound();
  }

  return <CarForm car={car} categories={categories} action={updateCar.bind(null, car.id)} />;
}

export default function EditCarPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження автомобіля..." />}>
      <EditCarContent params={params} />
    </Suspense>
  );
}
