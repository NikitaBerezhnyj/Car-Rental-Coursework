import { Cars } from "@/components/Cars/Cars";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { carCategoryService, carService } from "@/container";
import { parseCarFilters } from "@/schemas/filterSchemas";
import type { SearchParams } from "@/types/filters";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function CarsContent({ searchParams }: PageProps) {
  const filters = parseCarFilters(await searchParams);

  const [cars, categories] = await Promise.all([
    carService.list(filters),
    carCategoryService.list()
  ]);

  return <Cars cars={cars} categories={categories} filters={filters} />;
}

export default function CarsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження автомобілів..." />}>
      <CarsContent searchParams={searchParams} />
    </Suspense>
  );
}
