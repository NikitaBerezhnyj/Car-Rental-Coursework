import { Employees } from "@/components/Employees/Employees";
import { LoadingState } from "@/components/LoadingState/LoadingState";
import { employeeService } from "@/container";
import { parseSearchFilters } from "@/schemas/filterSchemas";
import type { SearchParams } from "@/types/filters";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

async function EmployeesContent({ searchParams }: PageProps) {
  const filters = parseSearchFilters(await searchParams);
  const employees = await employeeService.list(filters);

  return <Employees employees={employees} search={filters.search ?? ""} />;
}

export default function EmployeesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LoadingState message="Завантаження працівників..." />}>
      <EmployeesContent searchParams={searchParams} />
    </Suspense>
  );
}
