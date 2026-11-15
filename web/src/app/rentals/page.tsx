import { LoadingState } from "@/components/LoadingState/LoadingState";
import Rentals from "@/components/Rentals/Rentals";
import { rentalService } from "@/container";
import { parseRentalFilters } from "@/schemas/filterSchemas";
import type { SearchParams } from "@/types/filters";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function RentalsContent({ searchParams }: PageProps) {
  const filters = parseRentalFilters(await searchParams);

  const [rentals, stats] = await Promise.all([
    rentalService.list(filters),
    rentalService.getStats()
  ]);

  return <Rentals rentals={rentals} stats={stats} filters={filters} />;
}

export default function RentalsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оренд..." />}>
      <RentalsContent searchParams={searchParams} />
    </Suspense>
  );
}
