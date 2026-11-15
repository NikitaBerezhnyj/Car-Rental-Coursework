import { LoadingState } from "@/components/LoadingState/LoadingState";
import { Payments } from "@/components/Payments/Payments";
import { paymentService } from "@/container";
import { parseSearchFilters } from "@/schemas/filterSchemas";
import type { SearchParams } from "@/types/filters";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function PaymentsContent({ searchParams }: PageProps) {
  const filters = parseSearchFilters(await searchParams);
  const payments = await paymentService.list(filters);

  return <Payments payments={payments} search={filters.search ?? ""} />;
}

export default function PaymentsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження оплат..." />}>
      <PaymentsContent searchParams={searchParams} />
    </Suspense>
  );
}
