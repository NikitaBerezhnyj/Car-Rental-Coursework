import { Customers } from "@/components/screens/Customers/Customers";
import { LoadingState } from "@/components/ui/LoadingState/LoadingState";
import { customerService } from "@/container";
import { parseSearchFilters } from "@/schemas/filterSchemas";
import type { SearchParams } from "@/types/filters";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function CustomersContent({ searchParams }: PageProps) {
  const filters = parseSearchFilters(await searchParams);
  const customers = await customerService.list(filters);

  return <Customers customers={customers} search={filters.search ?? ""} />;
}

export default function CustomersPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження клієнтів..." />}>
      <CustomersContent searchParams={searchParams} />
    </Suspense>
  );
}
