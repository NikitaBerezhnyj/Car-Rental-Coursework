import Rentals from "@/components/screens/Rentals/Rentals";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
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
